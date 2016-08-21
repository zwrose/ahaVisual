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
  }
};

