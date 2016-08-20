import _superagent from 'superagent';
import _prefix from 'superagent-prefix';
import methods from 'methods';
import { extend } from 'underscore';

let superagent = extend({}, _superagent),
    request,
    prefix = _prefix('http://api.mochadevelopment.com'),
    uses = [];

superagent.use = function(fn) {
  uses.push(fn);
  return this;
};

methods.indexOf('del') == -1 && methods.push('del');
methods.forEach(function(method) {
  superagent[method] = function() {
    let $request = _superagent[method].apply(superagent, arguments);
    uses.forEach(function(use) {
      $request = $request.use(use);
    });

    return request;
  };
});


request = superagent;
request.use(prefix);

export default request;
