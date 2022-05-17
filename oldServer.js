var fs = require('fs');
var path = require('path');
var http = require('http');
var port = process.env.PORT || 8000;

var pets = [{"age":1,"kind":"baby","name":"goober"},{"age":5,"kind":"snake","name":"Buttons"}]

var server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'text/plain')
  switch (true) {
    case (request.url == '/'):
      response.statusCode = 200
      response.end(JSON.stringify(pets))
      break
    case (String(+request.url.split('/')[2]).match(/NaN|undefined/) == null):
      response.statusCode = 200
      if (pets[+request.url.split('/')[2]])
      response.end(JSON.stringify(pets[+request.url.split('/')[2]]))
      else {
        response.statusCode = 400
        response.end("Out of bounds")
      }
      break
    default:
      response.statusCode = 400
      response.end("Internal Server Error")
      break
   }
})

server.listen(port, () => {
  console.log('Listening on port', port);
})
