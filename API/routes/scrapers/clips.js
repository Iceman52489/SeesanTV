var request = require('../../request'),
    series = require('async/series'),
    x = require('x-ray')({ filters: require('./filters') }),
    config = require('../../config'),
    Program = require('../../models/Program'),
    Clip = require('../../models/Clip'),
    clips = [],
    requests = [],
    program,
    programID,
    details,
    count;


// US3: https://1188813643.rsc.cdn77.org/ch3
// US4: http://us99c.seesantv.com/ch3x
/*
VIDEO: https://1188813643.rsc.cdn77.org/ch3/09590/20160810d-09590s.mp4
PROGRAM-DETAILS: http://seesantv.com/seesantv_2014/player.php?clip_id=645991&program_id=9590
*/

function scrape(cb) {
  var url = '/program_detail.php?id=' + programID;

  request(url)
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
          var baseUri = config.api.host,
              clip,
              intClip;

          if(!err) {
            program = data;
            clips = data.clips;
            count = 0;

            for(intClip = 0; intClip < clips.length; intClip++) {
              clip = clips[intClip];
              clip.src = '/' + clip.src;

              requests.push(function(callback) {
                request(clip.src).end(function(err, res) {
                  if(!err) {
                    var html = res.text || '',
                        index = intClip;

                    x(html, '.video-wrap', {
                      src: 'script | parseVideoSrc'
                    })(function(err, video) {
                      clips[count].src = (video.src || null);
                      count++;
                      callback(null);
                    });
                  }
                });
              });

              series(requests, function(err, data) {
                cb();
              });
            }
          }
        });
      }
    });
}

function save(cb) {
  Program
    .findOne({ id: programID })
    .exec(function(err, data) {
      var newProgram,
          clip,
          intClip;

      if(!err) {
        newProgram = {
          _id: data._id,
          id: data.id,
          categoryID: data.categoryID,
          title: data.title,
          cover: data.cover,
          description: program.description,
          clips: clips
        };

        Program.findOneAndUpdate({ id: programID }, newProgram, { upsert: true }, function(err, data) {
          if(err) {
            return res.send(500, { error: err });
          }
        });

        for(intClip = 0; intClip < clips.length; intClip++) {
          clip = clips[intClip];
          clip.programID = programID;

          Clip.findOneAndUpdate({ id: clip.id }, clip, { upsert: true }, function(err, doc) {
            if(err) {
              console.log(err);
            }
          })
        }

        cb(null, newProgram);
      }
    })
}

function run(req, callback) {
  programID = parseInt(req.params.id);

  series([
    scrape,
    save
  ], function(err, data) {
    callback(data[1]);
  });
}

module.exports = {
  run: run
};
