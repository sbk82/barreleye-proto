'use strict';

var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

// install securityHandlers
// security code
// sha-256 : http://www.xorbin.com/tools/sha256-hash-calculator
// "This is my design"
config.swaggerSecurityHandlers = {
  api_key: function securityHandler1(req, authOrSecDef, scopesOrApiKey, cb) {
    // your security code
    if ('43a06ad9b5293d41d53b57a1430d032782f126101967a14e0c2c61314f85eb0c' === scopesOrApiKey) {
      cb(true);
    } else {
      cb(new Error('access denied!'));
    }
  }
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install swagger-ui
  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8088;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/v1/scenarios/single']) {
    console.log('try this:\ncurl http://localhost:' + port + '/scenarios/single/{s_id}');
  }
});
