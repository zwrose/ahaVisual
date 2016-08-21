/**
 * MenuController
 *
 * @description :: Server-side logic for managing starts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

module.exports = {

  /**
    * `MenuController.auth()`
    */
  auth: function (req, res) {
    req.session.subdomain = req.param('subdomain').toLowerCase();
    req.session.product = req.param('product').toUpperCase();
    return res.redirect('https://' + req.param('subdomain').toLowerCase() + '.aha.io/oauth/authorize?client_id=703a5ff2d4c8328852e20ac8b18dd8b840e1215202291831a23888ad554917bf&redirect_uri=https%3A%2F%2Fnode-playground-161360.nitrousapp.com%2Fmenu&response_type=code')
  },

  /**
    * `MenuController.list()`
    */
  list: function (req, res) {
    if(req.query.code) {
      //go get token, store token, return list
      request({
        method: 'POST',
        url: 'https://' + req.session.subdomain + '.aha.io/oauth/token',
        form: {
          code: req.query.code,
          client_id: '703a5ff2d4c8328852e20ac8b18dd8b840e1215202291831a23888ad554917bf',
          client_secret: process.env.APP_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: 'https://node-playground-161360.nitrousapp.com/menu'
        }
      }, function(err, response, body){
        console.log(response.statusCode);
        if(response.statusCode == 200) {
          req.session.token = JSON.parse(body).access_token;
          return res.view('menu', {
            subdomain: req.session.subdomain,
            product: req.session.product
          });
        } else {
          return res.redirect('start');
        }
      })
    } else if(req.session.token) {
      return res.view('menu', {
        subdomain: req.session.subdomain,
        product: req.session.product
      });
    } else {
      return res.redirect('start');
    }
  },

};
