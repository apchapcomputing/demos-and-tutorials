import sys
import gzip
import socket
import threading


CLRF = '\r\n'
INVALID_ENCODING = 'INVALID ENCODING'
GZIP_ENCODING = 'gzip'

class HTTPResponse:

    def __init__(self, status: str="", headers: dict=None, body: str=""):
        self.status = status
        self.headers = headers
        self.body = body

    def to_string(self):
        headers_str = ""
        if self.headers:
            for k, v in self.headers.items():
                headers_str += f"{k}: {v}{CLRF}"
        return f"HTTP/1.1 {self.status}{CLRF}{headers_str}{CLRF}{self.body}"
    
    def to_bytes(self):
        return self.to_string().encode()
    
    def to_compressed_response(self):
        compressed_body = gzip.compress(self.body.encode())
        self.headers.update({"Content-Length": len(compressed_body)})
        headers_str = ""
        if self.headers:
            for k, v in self.headers.items():
                headers_str += f"{k}: {v}{CLRF}"
        res_str = f"HTTP/1.1 {self.status}{CLRF}{headers_str}{CLRF}"
        res_byte = res_str.encode() + compressed_body
        return res_byte

        


def check_encoding(req: str):
    if "Accept-Encoding" not in req:
        return None
    
    encodings = req.split("Accept-Encoding: ")[1].split("\r\n")[0].split(", ")
    if GZIP_ENCODING in encodings:
        return GZIP_ENCODING
    else:
        return INVALID_ENCODING


def request_handler(conn: socket.socket, cli_args: list):
    req = conn.recv(4096).decode()
    req_vals = req.split(" ")
    req_verb = req_vals[0]
    req_path = req_vals[1]
    req_body = req.split(CLRF * 2)[1]
    print(req_body)

    filepath_dir = ""
    if len(cli_args) > 1 and cli_args[1] == "--directory":
        filepath_dir = cli_args[2]

    encoding = check_encoding(req)
    
    res = HTTPResponse()

    if req_path == "/":
        # res = "HTTP/1.1 200 OK\r\n\r\n"
        res.status = "200 OK"
    
    elif req_path == "/user-agent":
        user_agent_content = req.split("User-Agent: ")[1].split("\r\n")[0]
        # res = f"HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: {len(user_agent_content)}\r\n\r\n{user_agent_content}"
        res.status = "200 OK"
        res.headers = {"Content-Type": "text/plain", "Content-Length": len(user_agent_content)}
        res.body = user_agent_content

    elif req_path.startswith("/echo/"):
        path_content = req_path[6:] # remove "/echo/" from the path
        # res = f"HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: {len(path_content)}\r\n\r\n{path_content}"
        res.status = "200 OK"
        res.headers = {"Content-Type": "text/plain", "Content-Length": len(path_content)}
        res.body = path_content

    elif req_path.startswith("/files/"):
        filepath = filepath_dir + req_path[7:] # remove "/files/" from the path

        if req_verb == "GET":
            try:
                with open(filepath, "r") as f:
                    filepath = f.read()
                    # res = f"HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: {len(filepath)}\r\n\r\n{filepath}"
                    res.status = "200 OK"
                    res.headers = {"Content-Type": "application/octet-stream", "Content-Length": len(filepath)}
                    res.body = filepath
            except FileNotFoundError:
                # res = "HTTP/1.1 404 Not Found\r\n\r\n"
                res.status = "404 Not Found"
        elif req_verb == "POST":
            with open(filepath, "w") as f:
                f.write(req_body)  # write file contents from request body
                # res = "HTTP/1.1 201 Created\r\n\r\n"
                res.status = "201 Created"

    else:
        # res = "HTTP/1.1 404 Not Found\r\n\r\n"
        res.status = "404 Not Found"

    # add Content-Encoding header to response, if Accept-Encoding is present in request headers
    if encoding == GZIP_ENCODING:
        res.headers.update({"Content-Encoding": GZIP_ENCODING})
        conn.sendall(res.to_compressed_response())
    else:
        conn.sendall(res.to_bytes())

    conn.close()


def main():
    server_socket = socket.create_server(("localhost", 4221), reuse_port=True)
    
    while True:
        conn, addr = server_socket.accept()
        t = threading.Thread(target=request_handler, args=[conn, sys.argv])
        t.start()


if __name__ == "__main__":
    main()
