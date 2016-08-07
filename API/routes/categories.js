var YAML = require('yamljs'),
    categories = YAML.load('./data/categories.yml'),
    Category = require('../models/Category');

module.exports.find = function(req, res, next) {
  Category
    .find()
    .exec(function(err, categories) {
      res.send(categories);
      return next();
    });
};

module.exports.findByID = function(req, res, next) {
  Category
    .findOne({ id: req.params.id })
    .exec(function(err, category) {
      res.send(category);
      return next();
    });
};
