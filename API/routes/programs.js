var YAML = require('yamljs');
    programs = YAML.load('./data/programs.yml'),
    Program = require('../models/Program');

module.exports.find = function(req, res, next) {
  Program
    .find()
    .exec(function(err, programs) {
      res.send(programs);
      return next();
    });
};

module.exports.findByID = function(req, res, next) {
  Program
    .findOne({ id: req.params.id })
    .exec(function(err, program) {
      res.send(program);
      return next();
    });
};
