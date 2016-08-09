var charset = require('superagent-charset'),
    request = require('superagent'),
    series = require('async/series'),
    x = require('x-ray')({ filters: require('./filters') }),
    config = require('../../config'),
    utils = require('./utilities'),
    Program = require('../../models/Program'),
    categoryID,
    programs = [];

// Charset encoding support
charset(request);

function scrape(cb) {
  var resources = [
        utils.$url('/seesantv_2014/program.php?id='+categoryID),
        utils.$url('/seesantv_2014/program_ajax3.php?id='+categoryID+'&page=$1')
      ],

      intPrograms,
      pageCount,
			intPage;

  request
    .get(resources[0])
    .charset(config.api.encoding)
    .end(function(err, response) {
      if(!err) {
        var html = response.text || '';

        html = html.replace(/\t|\n/g, '');
        html = html.replace(/"a_page_([0-9]+)"/g, resources[1]);

        x(html, ['#pager_div a@id'])(function(err, pages) {
          var page,
              intPages = 0;

          pageCount = pages.length;

          for(intPage = 0; intPage < pages.length; intPage++) {
            page = pages[intPage];

            request
              .get(page)
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
                    if(!err) {
                      programs = programs.concat(pageData);
                      intPages++;

          						// Send the response when we have scraped all the programs
                      if(intPages == pages.length) {
                        cb(null);
                      }
                    }
                  });
                }
              });
          }
        });
      }
  	});
}

function save(cb) {
  var program,
      intProgram;

  for(intProgram = 0; intProgram < programs.length; intProgram++) {
    program = programs[intProgram];
    program.categoryID = categoryID;
    program.updatedAt = new Date;

    Program.findOneAndUpdate({ id: program.id }, program, { upsert: true }, function(err, doc) {
      if(err) {
        console.log(err);
      }
    });
  }

  cb(null, programs);
}

function run(req, callback) {
  categoryID = parseInt(req.params.id);

  series([
    scrape,
    save
  ], function(err, data) {
    callback(programs);
  });
}

module.exports = {
  run: run
};
