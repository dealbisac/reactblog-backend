'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');

const app = module.exports = loopback();

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

//List of models
console.log(Object.keys(app.models));

app.models.User.afterRemote('create', (ctx, user, next) => {
  console.log("New User is", user);

  // New Profile Instance
  app.models.Profile.create({
    first_name: user.name,
    created_at: new Date(),
    userId: user.id
  }, (err, result) => {
    if (!err, result) {
      console.log("Created New Profile", result);
    } else {
      console.log("Some error occured", err);
    }
    next();
  });
});
