var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    rp = require('request-promise'),
    etc = require('./etc'),
    getURI = etc.getURI,
    getMethod = etc.getMethod,
    getPayload = etc.getPayload,
    getHeaders = etc.getHeaders,
    port = process.env.PORT || 3000,
    SLACK_TOKEN = process.env.SLACK_TOKEN || 'UnFrZyP8p6RrlHo1NdYNoxIx';

    app.disable('x-powered-by');
    app.use(compress());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));



app.post('/', function (req, res) {
  var text = req.body.text;

  try {

    if( !text ) {
      throw new Error('No input');
    }

    if( !req.body.token === SLACK_TOKEN ) {
      throw new Error('Invalid token');
    }

    var uri = getURI(text);

    var method = getMethod(text);

    var options = {
      uri: uri,
      method: method
    };

    var payload = getPayload(text);

    if( payload ) {
      options.payload = payload;
    }

    rp(options)
      .then(function (parsedBody) {
          return res.send(parsedBody);
      })
      .catch(function (err) {
          return res.send(err);
      });

  } catch (e) {
    res.send(e);
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port ' + port);
});
