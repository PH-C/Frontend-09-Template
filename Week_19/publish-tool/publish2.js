let http = require('http');
// let fs = require('fs');
let archiver = require('archiver');
let child_process = require("child_process")

// fs.stat("./sample.html", (err, states) => {
  let request = http.request({
    hostname: "127.0.0.1",
    port: 8082,
    method: "post",
    headers: {
      'Content-Type': 'application/octet-stream',
      // 'Content-Length': states.size
    }
  }, response => {
    console.log(response);
  });


  // let file = fs.createReadStream("./sample.html");


  const archive = archiver('zip', {
    zlib: { level:9 }
  });
  archive.directory('./sample/', false);

  archive.finalize();
 
  archive.pipe(request);
  
  // file.on('end', () => request.end());
// });