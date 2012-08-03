// #!/usr/bin/node

var app  = require('express').createServer(),
    fs   = require('fs'),
    port = 6969,
    log  = console.log,
    dirs = {
      basic:      '/Users/stu/Desktop/browser-data/',
      vectee:     '/Users/stu/Desktop/projects/vectee/data/',
      jollywalker: '/Users/stu/Desktop/projects/thebackofyourhand.com/data/'
    }
    red   = '\033[31m',
    green = '\033[32m',
    reset = '\033[0m'

function strip_dotdot(str) { return str.replace(/\.\.\//g, '') }
function now() { return (new Date()).toISOString().replace(/T/, ' ').slice(0, -5) }

function ip_allowed(req) {
  var allowed = (req.ip == '127.0.0.1')
  if (! allowed) {
    log('access blocked from ip address: ' + req.ip)
  }
  return allowed
}

app.get('/:dir/*', function(req, res) {
  if (! ip_allowed(req)) return;
  
  var file_to_get = strip_dotdot(dirs[req.params.dir] + req.params[0])

  log( 'GET ' + req.originalUrl )

  var body = fs.readFileSync( file_to_get )
  res.contentType("text/plain").header('Access-Control-Allow-Origin', '*')
  res.header( 'Cache-Control', 'no-cache' )
  
  res.send( body )
  log( green + 'Sent: ' + file_to_get + reset )
})

// ===================================================

app.post('/:dir/*', function(req, res) {
  if (! ip_allowed(req)) return;

  var file_to_post = strip_dotdot(dirs[req.params.dir] + req.params[0]),
      body         = ''
  
  log( 'POST ' + req.originalUrl )

  req.on('data', function (data) {
    body += data
  })

  req.on('end', function () {
    fs.writeFile( file_to_post, body, function (err) {
      if (err) throw err
      log(now() + green + ' Saved ' + file_to_post + reset + ' ' + body.length )
    })
  })

  log( 'Writing to ' + file_to_post)
  
  res.contentType('text/plain').header('Access-Control-Allow-Origin', '*')

  res.send('gotcha')
})

// ===================================================

log('Listening on: ' + port)
app.listen( port )
