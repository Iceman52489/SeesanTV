import ATV from 'atvjs';
import Handlebars from 'handlebars';

function _imgPath(name) {
  return (_.startsWith(name, 'http://') || _.startsWith(name, 'https://')) ?
    name :
    `${ATV.launchOptions.BASEURL}resources/images/${name}`;
}

function _background(img = '', className = '') {
  return `<background><img class="${className}" src="${imageUrl(img)}" /></background>`;
}

const helpers = {
  toJSON(obj = {}) {
    let str;

    try {
      str = JSON.stringify(obj);
    } catch (ex) {
      str = "{}"
    }

    return str;
  },

  imgPath(img) {
    return new Handlebars.SafeString(_imgPath(img));
  },

  background(img) {
    return new Handlebars.SafeString(_background(img));
  }
};

// Register all helpers
_.each(helpers, (fn, name) => Handlebars.registerHelper(name, fn));

export default helpers;
