To start the server, run `./run_server.sh`.

To send HTTP requests to the running server, use cURL, like so:

For GET requests, run `curl <ip-of-machine>:5050/<route>`. There are currently three supported routes `/`, `/signup` and `/posts`.

For POST requests, run `curl -X POST -H "Content-Type: application/json" -d <json_payload> <ip-of-machine>:5050/<route>`.

For example, to simulate a signup request to the server, run `curl -X POST -H "Content-Type: application/json" -d '{"email": "john_doe@gmail.com", "password":"jane_doe"}' http://<ip>:5050/signup`
