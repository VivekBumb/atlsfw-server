docker build . -t app-server
docker run --init -it -p 5050:5050 app-server
