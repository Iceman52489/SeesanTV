var charset = require('superagent-charset'),
    request = require('superagent'),
    series = require('async/series'),
    x = require('x-ray')({ filters: require('./filters') }),
    config = require('../../config'),
    utils = require('./utilities'),
    Program = require('../../models/Program'),
    Clip = require('../../models/Clip'),
    programID,
    details;

// Charset encoding support
charset(request);

function scrape(cb) {
  var url = utils.$url('/seesantv_2014/program_detail.php?id='+programID);

  request
    .get(url.replace(/\{programID\}/, program.id))
    .charset(config.api.encoding)
    .end(function(err, response) {
      if(!err) {
        var html = response.text || '';

        x(html, '.program-detail', {
          details: '.info | parseDescription',
          clips: x('.program-archive > tr', [{
            id: 'a@href | parseClipID',
            name: 'a | trim',
            src: 'a@href | trim'
          }])
        })(function(err, data) {
          if(!err) {
            details = data;
          }

          cb(null);
        });
      }
    });
}

function save(cb) {
  Program
    .findOne({ id: programID })
    .exec(function(err, program) {
      var clips = details.clips,
          clip,
          intClip;

      if(!err) {
        program.description = details.description;

        Program.findOneAndUpdate({ id: programID }, program, { upsert: true }, function(err, doc) {
          if(err) {
            return res.send(500, { error: err });
          }
        });

        for(intClip = 0; intClip < clips.length; intClip++) {
          clip = clips[intClip];
          clip.programID = programID;
          program.updatedAt = new Date;

          Clip.findOneAndUpdate({ id: clip.id }, clip, { upsert: true }, function(err, doc) {
            if(err) {
              console.log(err);
            }
          })
        }

        cb(null, program);
      }
    })
}

function run(req, callback) {
  programID = parseInt(req.params.id);

  series([
    scrape,
    save
  ], function(err, data) {
    callback(data);
  });
}

module.exports = {
  run: run
};
