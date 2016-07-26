import ATV from 'atvjs';
import Handlebars from 'hbsfy/runtime';

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

  imgPath(path) {
    path = (path.toString().search(/^https?:\/\//g) > -1) ? path : `${ATV.launchOptions.BASEURL}resources/images/${path}`;
    return new Handlebars.SafeString(path);
  },

  background(img = '', className = '') {
    return new Handlebars.SafeString(`<background><img class="${className}" src="${imgPath(img)}" /></background>`);
  },

  or(value, safeValue) {
    let out = value || safeValue;
    return new Handlebars.SafeString(out);
  }
};

// Register all helpers
Handlebars.registerHelper(helpers);

export default helpers;
