var moment = require('moment')
    Program = require('../models/Program'),
    Clip = require('../models/Clip'),
    scrapers = {
      programs: require('./scrapers/programs'),
      clips: require('./scrapers/clips')
    },

    program = {};

module.exports.find = function(req, res, next) {
  Program
    .find()
    .exec(function(err, programs) {
      if(programs.length) {
        var diff = moment(new Date, 'DD/MM/YYYY HH:mm:ss').diff(moment(programs[0].updatedAt, 'DD/MM/YYYY HH:mm:ss'), 'days');

        if(diff < 1) {
          res.send(programs);
        } else {
          scrapers.programs.run(req, function(newPrograms) {
            res.send(newPrograms);
            return next();
          });
        }
      } else {
        scrapers.programs.run(req, function(newPrograms) {
          res.send(newPrograms);
          return next();
        });
      }
    });
};

module.exports.findByID = function(req, res, next) {
  var programID = req.params.id;
  console.log();
  Program
    .findOne({ id: programID })
    .exec(function(err, query) {
      program = query;

      Clip
        .find({ programID: programID })
        .exec(function(err, clips) {
          program.clips = clips;

          if(clips.length) {
            var diff = moment(new Date, 'DD/MM/YYYY HH:mm:ss').diff(moment(clips[0].updatedAt, 'DD/MM/YYYY HH:mm:ss'), 'days');

            if(diff < 1) {
              res.send(program);
            } else {
              scrapers.clips.run(req, function(newProgram) {
                res.send(newProgram);
                return next();
              });
            }
          } else {
            scrapers.clips.run(req, function(newProgram) {
              res.send(newProgram);
              return next();
            });
          }
        });
    });
};
