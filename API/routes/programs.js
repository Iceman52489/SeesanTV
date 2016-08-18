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
      if(!err) {
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

  Program
    .findOne({ id: programID })
    .exec(function(err, query) {
      if(!err) {
        query.clips = [];

        Clip
          .find({ programID: programID })
          .exec(function(err, clips) {
            program = {
              _id: query._id,
              categoryID:  query.categoryID,
              cover: query.cover,
              title: query.title,
              clips: (clips || []),
              updatedAt: query.updatedAt
            };

            if(clips.length) {
              var diff = moment(new Date, 'DD/MM/YYYY HH:mm:ss').diff(moment(clips[0].updatedAt, 'DD/MM/YYYY HH:mm:ss'), 'days');
diff = 2;
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
        } else {
          res.send({});
        }
    });
};
