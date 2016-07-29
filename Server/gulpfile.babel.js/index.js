/**
 * Tasks
 */
global.debug = true;
global.watch = false;

require('./tasks/install');
require('./tasks/clean');
require('./tasks/js');
require('./tasks/build');
require('./tasks/watch');
require('./tasks/serve');
require('./tasks/default');
