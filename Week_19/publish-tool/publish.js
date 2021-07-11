let http = require('http')
let fs = require('fs');

let request = http.request({
  hostname: '1.117.186.165',
  port: 8082,
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream'
  }
}, response => {
  console.log(" response::: ", response)
})

let file = fs.createReadStream('./sample.html')

file.on('data', chunk => {
  console.log(" file chunk::: ", chunk.toString())
  request.write(chunk);
})
file.on('end', chunk => {
  console.log(" file read finished")
  request.end(chunk)
})