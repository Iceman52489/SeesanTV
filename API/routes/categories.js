var moment = require('moment'),
    Category = require('../models/Category'),
    scraper = require('./scrapers/categories');

module.exports.find = function(req, res, next) {
  Category
    .find()
    .exec(function(err, categories) {
      if(categories.length) {
        var diff = moment(new Date, 'DD/MM/YYYY HH:mm:ss').diff(moment(categories[0].updatedAt, 'DD/MM/YYYY HH:mm:ss'), 'days');

        if(diff < 1) {
          res.send(categories);
        } else {
          scraper.run(req, function(newCategories) {
            res.send(newCategories);
            return next();
          });
        }
      } else {
        scraper.run(req, function(newCategories) {
          res.send(newCategories);
          return next();
        });
      }
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
