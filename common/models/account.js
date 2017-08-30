'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function(Account) {
  //send verification email after registration
  Account
    .observe('after save', function(ctx, next) {
      if (ctx.isNewInstance != undefined && ctx.isNewInstance) {
        var account = ctx.instance;
        var redirecUrl = process.env.REDIRECT_URL || "http://cost-sheet-app.herokuapp.com";
        var host = process.env.API_HOST || "cost-sheet-api.herokuapp.com"; //cost-sheet-api.herokuapp.com
        var port = process.env.API_PORT || 443; //80 for http, 443 fot https
        var protocol = process.env.API_PROTOCOL || 'https'; //80 for 
        var text = '{href}';

        var options = {
          type: 'email',
          to: account.email,
          from: process.env.SUBSCRIPTION_FROM_EMAIL || 'costsheets.unitec@gmail.com',
          subject: 'Gracias por registrarte!',
          template: path.resolve(__dirname, '../../server/views/verify.ejs'),
          redirect: redirecUrl + "/login",
          account: account,
          host: host,
          port: port,
          protocol: protocol,
          text: text,
        };
        account.verify(options, function(err, response) {
          if (err) {
            Account.deleteById(account.id);
            return next(err);
          }
          next();
        });
      } else {
        next();
      }
    });

  //send password reset link when requested
  Account.on('resetPasswordRequest', function(info) {
    var baseUrl = process.env.REDIRECT_URL || "http://localhost:3001"
    var url = baseUrl + "/reset-password";
    var html = 'Click <a href="' + url + '?access_token=' + info.accessToken.id + '">here</a> to reset your password';

    Account
      .app
      .models
      .Email
      .send({
        to: info.email,
        from: info.email,
        subject: 'Password reset',
        html: html,
      }, function(err) {
        if (err) {
          return;
        }
        console.log('> sending password reset email to:', info.email);
      });
  });
};
