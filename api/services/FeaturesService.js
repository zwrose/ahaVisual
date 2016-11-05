var request = require('request');

module.exports = {
  /**
   * Return information for the given feature.
   *
   * @required {String} reference_num
   *   The unique Aha identifier for the feature.
   * @required {String} subdomain
   *   The Aha account containing the feature.
   * @required {String} token
   *   The Aha API auth token
   * @optional {String} filter {description | requirements | relations}
   * @returns {Object}
   *   Contains feature name, key
   */
  getFeatureInfo: function(options, done) {
    request({
      method: 'GET',
      url: 'https://' + options.subdomain + '.aha.io/api/v1/features/' + options.reference_num.toUpperCase(),
      headers: {
        'Authorization': 'Bearer ' + options.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }, function(err, response, body) {
      if(response.statusCode == 200){
        var featureData = JSON.parse(body);
        switch(options.filter){
          case 'description':
            return done({
              feature: {
                id: featureData.feature.id,
                reference_num: featureData.feature.reference_num,
                name: featureData.feature.name,
                description: featureData.feature.description.body
              }
            })
          
          case 'requirements':
            return done({
              feature: {
                id: featureData.feature.id,
                reference_num: featureData.feature.reference_num,
                name: featureData.feature.name,
                requirements: featureData.feature.requirements
              }
            })
          
          case 'relations':
            return done({
              feature: {
                id: featureData.feature.id,
                reference_num: featureData.feature.reference_num,
                name: featureData.feature.name,
                relations: featureData.feature.feature_links
              }
            })
          
          default:
            return done(featureData);
        }
      } else {
        return done({
          errorMsg: 'Something went wrong with the request to Aha.',
          statusCode: response.statusCode,
          err: err,
          response: response
        })
      }
    });
  },
  
  /**
   * Return returns a list of features for a product.
   *
   * @required {String} productId
   *   The unique Aha identifier prefix for the product.
   * @required {String} subdomain
   *   The Aha account containing the feature.
   * @required {String} token
   *   The Aha API auth token
   * @returns {Object}
   *   Contains a list of features
   */
  getProductFeatures: function(options, done) {
    request({
      method: 'GET',
      url: 'https://' + options.subdomain + '.aha.io/api/v1/products/' + options.productId.toUpperCase() + '/features',
      headers: {
        'Authorization': 'Bearer ' + options.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }, function(err, response, body) {
      if(response.statusCode == 200){
        return done(JSON.parse(body));
      } else {
        return done({
          errorMsg: 'Something went wrong with the request to Aha.',
          statusCode: response.statusCode,
          err: err,
          response: response
        })
      }
    });
  }
};