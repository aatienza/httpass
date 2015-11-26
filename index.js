var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    rp = require('request-promise'),
    port = process.env.PORT || 3000;

    app.disable('x-powered-by');
    app.use(compress());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

app.post('/', function (req, res) {
  var text = req.body.text;

  if( !text ) {
    return res.send('Whoops! No input');
  }

  var urlArray = text.match(/https?:\/\/[^ ]*/);

  var uri = false;
  if( urlArray && urlArray.length ) {
    uri = urlArray[0];
  }

  if( !uri ) {
    return res.send('Invalid URL');
  }

  var method = 'GET';

  if( text.match(/GET|POST|PUT|DELETE/i) ) {
    method = text.match(/GET|POST|PUT|DELETE/i)[0].toUpperCase();
  }

  var payload = text.match(/-p \{.*\}/) ? text.match(/-p (\{.*\})/)[1] : false;

  var options = {
    uri: uri,
    method: method
  };

  if( payload ) {

    try {
      payload = JSON.parse(payload);
    } catch(e) {
      return res.send('Invalid payload. Must be JSON.');
    }

    options.payload = payload;
  }

  rp(options)
    .then(function (parsedBody) {
        return res.send(parsedBody);
    })
    .catch(function (err) {
        return res.send(err);
    });

});

app.listen(3000, function () {
  console.log('Example app listening on port ' + port);
});
