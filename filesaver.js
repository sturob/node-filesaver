// #!/usr/bin/node

var app = require('express').createServer(),
    fs  = require('fs'),
    port = 6969;

var dirs = {
  basic:  '/Users/stu/Desktop/browser-data/',
  vectee: '/Users/stu/Sites/vectee/data/'
};

app.get('/:dir/:file', function(req, res){
  var p = req.params,
      file_to_get = dirs[p.dir] + p.file;

  console.log('GET /' + p.dir + '/' + p.file);
  console.log('Sending: ' + file_to_get);

  var body = fs.readFileSync( file_to_get );
  res.contentType("text/plain").header('Access-Control-Allow-Origin', '*');
  res.send( body );
});

// ===================================================

app.post('/:dir/:file', function(req, res){
  var p = req.params,
      file_to_post = dirs[p.dir] + p.file,
      body     = '';
  
  req.on('data', function (data) {
    body = body + data;
  });

  req.on('end', function () {
    fs.writeFile( file_to_post, body, function (err) {
      if (err) throw err;
      console.log('Saved ' + file_to_post );
    });
  });

  console.log('POST to /' + p.dir + '/' + p.file);
  console.log('Writing to ' + file_to_post );
  
  res.contentType('text/plain').header('Access-Control-Allow-Origin', '*');

  res.send('gotcha');
});

// ===================================================

console.log('Listening on: ' + port);
app.listen(port);
