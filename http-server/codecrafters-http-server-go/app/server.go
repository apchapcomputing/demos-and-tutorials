package main

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"net"
	"os"
	"strings"
)

const (
	GZIP = "gzip"
)

type HTTPRequest struct {
	method      string // GET, POST, PUT, DELETE
	targetPath  string
	httpVersion string

	headers map[string]string

	body string
}

type HTTPResponse struct {
	// HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 3\r\n\r\nabc
	statusMessage string // 200 OK, 404 Not Found, etc

	headers map[string]string

	body string
}

func NewHTTPResponse() HTTPResponse {
	return HTTPResponse{
		headers: make(map[string]string),
	}
}

func parseRequest(request string) HTTPRequest {
	httpRequest := HTTPRequest{}

	// split the request into lines
	lines := strings.Split(request, "\r\n")

	// parse the request line
	requestLine := strings.Split(lines[0], " ")
	httpRequest.method = requestLine[0]
	httpRequest.targetPath = requestLine[1]
	httpRequest.httpVersion = requestLine[2]

	// parse the headers
	httpRequest.headers = make(map[string]string)
	headersLine := lines[1 : len(lines)-2] // skip the first and last lines
	for _, header := range headersLine {
		headerParts := strings.Split(header, ": ")
		httpRequest.headers[headerParts[0]] = headerParts[1]
	}

	// parse the body
	httpRequest.body = lines[len(lines)-1] // last line is the body

	return httpRequest
}

func (req *HTTPRequest) CreateResponse() HTTPResponse {
	res := NewHTTPResponse()

	// get the cli args
	fileDirectory := ""
	if len(os.Args) > 1 && os.Args[1] == "--directory" {
		fileDirectory = os.Args[2]
	}

	// get the encoding header
	if strings.Contains(req.headers["Accept-Encoding"], GZIP) {
		// encoding := req.headers["Accept-Encoding"]
		res.headers["Content-Encoding"] = GZIP
	}

	if req.targetPath == "/" {
		res.statusMessage = "200 OK"
	} else if strings.HasPrefix(req.targetPath, "/echo/") {
		body := strings.Split(req.targetPath, "/echo/")[1]
		if res.headers["Content-Encoding"] == GZIP {
			var b bytes.Buffer
			gz := gzip.NewWriter(&b)
			gz.Write([]byte(body))
			gz.Close()
			res.body = b.String()
		} else {
			res.body = body
		}

		res.headers["Content-Length"] = fmt.Sprintf("%d", len(res.body))
		res.headers["Content-Type"] = "text/plain"
		res.statusMessage = "200 OK"
	} else if req.targetPath == "/user-agent" {
		res.body = req.headers["User-Agent"]
		res.headers["Content-Type"] = "text/plain"
		res.headers["Content-Length"] = fmt.Sprintf("%d", len(res.body))
		res.statusMessage = "200 OK"
	} else if strings.HasPrefix(req.targetPath, "/files/") {
		fileName := strings.Split(req.targetPath, "/files/")[1]
		filePath := fmt.Sprintf("%s/%s", fileDirectory, fileName)

		if req.method == "GET" {
			// read the target file in local directory
			file, err := os.ReadFile(filePath)
			if err != nil {
				res.statusMessage = "404 Not Found"
				return res
			}

			res.statusMessage = "200 OK"
			res.body = string(file)
			res.headers["Content-Type"] = "application/octet-stream"
			res.headers["Content-Length"] = fmt.Sprintf("%d", len(res.body))
		} else if req.method == "POST" {
			// write the target file in local directory
			content := strings.Trim(req.body, "\x00")
			err := os.WriteFile(filePath, []byte(content), 0644)
			if err != nil {
				res.statusMessage = "500 Internal Server Error"
				return res
			}

			res.statusMessage = "201 Created"
		}
	} else {
		res.statusMessage = "404 Not Found"
	}

	return res
}

func (res *HTTPResponse) ToString() string {
	return fmt.Sprintf("HTTP/1.1 %s\r\n%s\r\n%s", res.statusMessage, headersToString(res.headers), res.body)
}

func headersToString(headersMap map[string]string) (headers string) {
	for key, value := range headersMap {
		headers += fmt.Sprintf("%s: %s\r\n", key, value)
	}

	return headers
}

func handleConnection(conn net.Conn) {
	defer conn.Close()
	// read the request
	buf := make([]byte, 1024)
	_, err := conn.Read(buf)
	if err != nil {
		fmt.Println("Error reading: ", err.Error())
		os.Exit(1)
	}

	request := parseRequest(string(buf))
	fmt.Println(request)

	// write the response
	response := request.CreateResponse()

	conn.Write([]byte(response.ToString()))
}

func main() {
	l, err := net.Listen("tcp", "0.0.0.0:4221")
	if err != nil {
		fmt.Println("Failed to bind to port 4221")
		os.Exit(1)
	}

	for {
		conn, err := l.Accept()
		if err != nil {
			fmt.Println("Error accepting connection: ", err.Error())
			os.Exit(1)
		}
		go handleConnection(conn)
	}
}
