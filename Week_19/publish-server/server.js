let http = require('http');
let fs = require('fs');
let unzipper = require('unzipper');

const server = http.createServer((request, response) => {
  console.log(request.headers);

  // let outFile = fs.createWriteStream('../server/public/tmp.zip')

  // request.pipe(outFile)

  request.pipe(unzipper.Extract({ path: '../server/public/' }))

  // request.on('data', chunk => {
  //   // console.log(chunk.toString())
  //   outFile.write(chunk)
  // })
  // request.on('end', () => {
  //   outFile.end()
  //   response.end("Success!")
  // }) 
});
server.listen(8082);