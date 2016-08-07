var charset = require('superagent-charset'),
    request = require('superagent'),
    x = require('x-ray')({ filters: require('./filters') }),
    config = require('../config'),
    utils = require('./utilities'),
    Category = require('../models/Category'),
    Program = require('../models/Program'),
    intPrograms = 0;

// Charset encoding support
charset(request);

function migratePrograms(programs, categoryID, cb) {
  var program,
      intProgram;

  for(intProgram = 0; intProgram < programs.length; intProgram++) {
    program = programs[intProgram];
    program.categoryID = parseInt(categoryID);

    Program.findOneAndUpdate({ id: program.id }, program, { upsert: true }, function(err, doc) {
      if(err) {
        return res.send(500, { error: err });
      }

      return res.send("succesfully saved");
    });
  }

  cb();
}

function scrapePrograms(categoryID, req, res, next) {
  var resources = [
        utils.$url('/seesantv_2014/program.php?id='+categoryID),
        utils.$url('/seesantv_2014/program_ajax3.php?id='+categoryID+'&page=$1')
      ],

      programs = [],
      intPrograms,
      pageCount,
      minProgramCount,
			intPage;

  return request
    .get(resources[0])
    .charset(config.api.encoding)
    .end(function(err, response) {
      if(!err) {
        var html = response.text || '';

        html = html.replace(/\t|\n/g, '');
        html = html.replace(/"a_page_([0-9]+)"/g, resources[1]);

        x(html, ['#pager_div a@id'])(function(err, pages) {
          pageCount = pages.length;
          minProgramCount = pages.length ? ((pages.length - 1) * 35) : 0;

          for(intPage = 0; intPage < pages.length; intPage++) {
            request
              .get(pages[intPage])
              .charset(config.api.encoding)
              .end(function(err, response) {
                if(!err) {
                  var html = response.text || '';

                  x(html, 'li.alpha > figure', [{
                    id: 'a@href | parseProgramID',
                    title: 'img@alt',
                    cover: 'img@src',
                    details: 'a@href'
                  }])(function(err, pageData) {
                    programs = programs.concat(pageData);

        						// Sometimes Seesan has pages with no videos...
        						if(!pageData.length) {
        							minProgramCount -= 35;
        						}

        						// Send the response when we have scraped all the programs
                    if(programs.length >= minProgramCount) {
                      migratePrograms(programs, categoryID, function() {
                        res.send(programs.length + ' records migrated!');
                        return next();
                      });
                    }
                  });
                }
              });
          }
        });
      }
  	});
}

function programs(req, res, next) {
  scrapePrograms(req.params.id, req, res, next);
}

module.exports = programs;
