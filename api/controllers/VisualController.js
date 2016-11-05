/**
 * VisualController
 *
 * @description :: Server-side logic for managing visuals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  
  /**
   * `VisualController.tree()`
   */
  tree: function (req, res) {
    FeaturesService.getFeatureInfo({
      reference_num: req.param('reference_num'),
      token: req.session.token,
      subdomain: req.session.subdomain,
      filter: req.param('filter')
    }, function(featureData) {
      return res.send(featureData)
    });
  },
  
  /**
   * `VisualController.pdView()`
   */
  pdView: function (req, res) {
    FeaturesService.getProductFeatures({
      productId: req.param('productId'),
      token: req.session.token,
      subdomain: req.session.subdomain,
    }, function(productFeatures) {
      var allFeatureDetails = [];
      productFeatures.features.forEach(function(val, idx, arr) {
        FeaturesService.getFeatureInfo({
          reference_num: val.reference_num,
          token: req.session.token,
          subdomain: req.session.subdomain,
        }, function(featureDetail) {
          allFeatureDetails.unshift(featureDetail.feature);
          if (allFeatureDetails.length == arr.length){
            return res.view('pdView', {
              features: allFeatureDetails.sort(function(a, b) {
                return a.position - b.position;
              })
            });
          }
        });
      });
    });
  }
};

