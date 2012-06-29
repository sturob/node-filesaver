// #!/usr/bin/node

var app  = require('express').createServer(),
    fs   = require('fs'),
    port = 6969,
    log  = console.log,
    dirs = {
      basic:  '/Users/stu/Desktop/browser-data/',
      vectee: '/Users/stu/Sites/vectee/data/'
    }

function strip_dotdot(str) { return str.replace(/\.\.\//g, '') }

app.get('/:dir/*', function(req, res){
  var file_to_get = strip_dotdot(dirs[req.params.dir] + req.params[0])

  log( 'GET ' + req.originalUrl )

  var body = fs.readFileSync( file_to_get )
  res.contentType("text/plain").header('Access-Control-Allow-Origin', '*')
  log( 'Sending: ' + file_to_get )
  res.send( body );
})

// ===================================================

app.post('/:dir/*', function(req, res){
  var file_to_post = strip_dotdot(dirs[req.params.dir] + req.params[0]),
      body         = ''
  
  log( 'POST ' + req.originalUrl )

  req.on('data', function (data) {
    body += data
  })

  req.on('end', function () {
    fs.writeFile( file_to_post, body, function (err) {
      if (err) throw err
      log('Saved ' + file_to_post + ' [' + body.length + ']')
    })
  })

  log('Writing to ' + file_to_post)
  
  res.contentType('text/plain').header('Access-Control-Allow-Origin', '*')

  res.send('gotcha')
})

// ===================================================

log('Listening on: ' + port)
app.listen( port )
