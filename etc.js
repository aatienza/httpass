exports.getURI = function ( text ) {
  var urlArray = text.match(/https?:\/\/[^ ]*/);

  var uri = false;
  if( urlArray && urlArray.length ) {
    uri = urlArray[0];
  }

  if( !uri ) {
    throw new Error('Missing URI');
  }

  return uri;
}

exports.getMethod = function(text) {
  var method = 'GET';

  if( text.match(/GET|POST|PUT|DELETE/i) ) {
    method = text.match(/GET|POST|PUT|DELETE/i)[0].toUpperCase();
  }

  return method;
}

exports.getPayload = function (text) {
  var payload = text.match(/-[p|payload] \{.*\}/) ? text.match(/-[p|payload] (\{.*\})/)[1] : false;
  try {
    payload = JSON.parse(payload);
  } catch(e) {
    throw new Error('Invalid JSON for payload');
  }
  return payload;
}

exports.getHeaders = function (text) {
  var headers = text.match(/-[h|headers] \{.*\}/) ? text.match(/-[h|headers] (\{.*\})/)[1] : false;
  try {
    headers = JSON.parse(headers);
  } catch(e) {
    throw new Error('Invalid JSON for headers');
  }
  return headers;
}
