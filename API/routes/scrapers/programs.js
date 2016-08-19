var request = require('../../request'),
    series = require('async/series'),
    x = require('x-ray')({ filters: require('./filters') }),
    config = require('../../config'),
    Program = require('../../models/Program'),
    categoryID,
    programs = [];

function scrape(cb) {
  var resources = [
        '/program.php?id='+categoryID,
        '/program_ajax3.php?id='+categoryID+'&page=$1'
      ],

      intPrograms,
      pageCount,
      intPage;

  request(resources[0])
    .end(function(err, response) {
      if(!err) {
        var html = response.text || '';

        html = html.replace(/\t|\n/g, '');
        html = html.replace(/"a_page_([0-9]+)"/g, resources[1]);

        x(html, ['#pager_div a@id'])(function(err, pages) {
          if(pages !== undefined && pages.length) {
            var page,
                intPages = 0;

            pages = pages.join(',');
            pages = pages.replace(/,?(a_page_first|a_page_pre|a_page_next|a_page_last),?/g, '');
            pages = pages.split(',');

            pageCount = pages.length;

            for(intPage = 0; intPage < pages.length; intPage++) {
              page = pages[intPage];

              request(page)
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
