var utils = require('gulp-util');

module.exports = function() {
	var args = Array.prototype.slice.call(arguments);

	utils.log(utils.colors.red(args[0].message));

	// Keep gulp from hanging on this task
	this.emit('end');
};
