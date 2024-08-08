
// create HTTPRequest class
class HTTPRequest {
    constructor(method, path, headers, body) {
        this.method = method;
        this.path = path;
        this.headers = headers;
        this.body = body;
    }
}

class HTTPResponse {
    constructor(status, headers, body) {
        this.status = status;
        this.headers = headers;
        this.body = body;
    }
}

function processData(data) {
    const dataString = data.toString();
    const dataSplit = dataString.split("\r\n");

    const method = dataSplit[0].split(" ")[0];
    const path = dataSplit[0].split(" ")[1];
    const headers = {};
    const body = dataSplit[dataSplit.length - 1];

    for (let i = 1; i < dataSplit.length - 2; i++) {
        const headerSplit = dataSplit[i].split(": ");
        headers[headerSplit[0]] = headerSplit[1];
    }

    return new HTTPRequest(method, path, headers, body);
}

function getHeadersAsString(headers) {
    let headersString = "";
    for (const [key, value] of Object.entries(headers)) {
        headersString += `${key}: ${value}\r\n`;
    }
    return headersString;
}

const net = require("net");
const fs = require("fs");
const zlib = require("zlib");

args = process.argv.slice(2);
if (args[0] == "--directory") {
    directory = args[1];
}

const server = net.createServer((socket) => {
    socket.on("close", () => {
        socket.end();
    });

    socket.on("data", async (data) => {
        req = processData(data);
        res = HTTPResponse;

        if (req.path == "/") {
            res.status = "200 OK";
        } else if (req.path.startsWith("/echo/")) {
            res.status = "200 OK";
            res.body = req.path.split("/echo/")[1];
            console.log(res.body);
            res.headers = {
                "Content-Type": "text/plain",
                "Content-Length": res.body.length
            };
        } else if (req.path == "/user-agent") {
            res.status = "200 OK";
            res.body = req.headers["User-Agent"];
            res.headers = {
                "Content-Type": "text/plain",
                "Content-Length": res.body.length
            };
        } else if (req.path.startsWith("/files/")) {
            file_name = req.path.split("/files/")[1];
            file_path = `${directory}${file_name}`;

            if (req.method == "POST") {
                // POST -- write file
                file_content = req.body;
                fs.writeFileSync(file_path, file_content);
                res.status = "201 Created";
            } else {
                // GET -- read file
                if (fs.existsSync(file_path)) {
                    const file_content = fs.readFileSync(file_path).toString();
                    
                    res.status = "200 OK";
                    res.headers = {
                        "Content-Type": "application/octet-stream",
                        "Content-Length": file_content.length
                    }
                    res.body = file_content;
                } else {
                    res.status = "404 Not Found";
                }
            }
        } else {
            res.status = "404 Not Found";
        }

        if (req.headers["Accept-Encoding"] && req.headers["Accept-Encoding"].includes("gzip")) {
            res.headers["Content-Encoding"] = "gzip";
            res.body = zlib.gzipSync(res.body.trim());
            res.headers["Content-Length"] = res.body.length;
            headersAsString = res.headers ? getHeadersAsString(res.headers) : "";
            socket.write(`HTTP/1.1 ${res.status}\r\n${headersAsString}\r\n`);
            socket.write(res.body);
            socket.end();
            return
        }

        headersAsString = res.headers ? getHeadersAsString(res.headers) : "";
        socket.write(`HTTP/1.1 ${res.status}\r\n${headersAsString}\r\n${res.body}`);
        socket.end();
    }) 
});

server.listen(4221, "localhost");