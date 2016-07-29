var YAML = require('yamljs'),
    restify = require('restify'),
    charset = require('superagent-charset'),
    request = require('superagent'),
    x = require('x-ray')({
      filters: require('./filters')
    }),

    server = restify.createServer(),
    host = 'http://www.seesantv.com';
    encoding = 'win874';

// Charset encoding support
charset(request);

/**
 * Helpers
 */
function $url(path, params) {
  params = params || {};
  return (host + path);
}

/**
 * Models
 */
function categories(req, res, next) {
  var resource = host;

  request
    .get(resource)
    .charset(encoding)
    .end(function(err, response) {
      var html = response.text;

      x(html, '#feature-hilight-tabs ul.tabs-nav > li', [{
        id: 'a@href | parseCategoryId',
        category: 'a'
      }])(function(err, data) {
        res.send(data || err);
        next();
      });
    });
}

function programs(req, res, next) {
  var resources = [
        $url('/seesantv_2014/program.php?id='+req.params.id),
        $url('/seesantv_2014/program_ajax3.php?id='+req.params.id+'&page=$1')
      ],

      programs = [],
      intPrograms,
      pageCount,
      minProgramCount,
			intPage;

  request
    .get(resources[0])
    .charset(encoding)
    .end(function(err, response) {
      var html = response.text;

      html = html.replace(/\t|\n/g, '');
      html = html.replace(/"a_page_([0-9]+)"/g, resources[1]);

      x(html, ['#pager_div a@id'])(function(err, pages) {
        pageCount = pages.length;
        minProgramCount = pages.length ? ((pages.length - 1) * 35) : 0;

        for(intPage = 0; intPage < pages.length; intPage++) {
          x(pages[intPage], 'li.alpha > figure', [{
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
              res.send(programs);
							next();
            }
          })
        }
      });
  	});
}

/**
 * Routes
 */
var categories = YAML.load('./data/categories.yml');

server.get('/api/categories', function(req, res, next) {
  res.send(categories);
  next();
});

server.get('/api/programs/:id', programs);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
