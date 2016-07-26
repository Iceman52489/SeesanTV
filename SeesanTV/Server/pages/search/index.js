import ATV from 'atvjs';
import template from './template.hbs';
import _results from './results.hbs';

function buildResults(doc, searchText) {
  let regExp = new RegExp(searchText, 'i'),
      matchesText = function(value) {
        return regExp.test(value);
      },

      movies = {
        "The Puffin": 1,
        "Lola and Max": 2,
        "Road to Firenze": 3,
        "Three Developers and a Baby": 4,
        "Santa Cruz Surf": 5,
        "Cinque Terre": 6,
        "Creatures of the Rainforest": 7
      },

      titles = Object.keys(movies),

      domImplementation = doc.implementation,
      lsParser = domImplementation.createLSParser(1, null),
      lsInput = domImplementation.createLSInput(),
      results = [];

  lsInput.stringData = ``;

  titles = (searchText) ? titles.filter(matchesText) : titles;

  for(let i = 0, len = titles.length; i < len; i++) {
    results.push({
      name: titles[i],
      image: `${ATV.launchOptions.BASEURL}assets/img/movies/movie_${movies[titles[i]]}.lcr`
    });
  }

  lsInput.stringData = _results({titles: results});
  lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
}

let Page = ATV.Page.create({
  name: 'search',
  template: template,
  afterReady(doc) {
    let searchField = doc.getElementsByTagName('searchField').item(0);
    let keyboard = searchField && searchField.getFeature('Keyboard');

    if (keyboard) {
      keyboard.onTextChange = function() {
        let searchText = keyboard.text;
        console.log(`search text changed: ${searchText}`);
        buildResults(doc, searchText);
      };
    }
  }
});

export default Page;
