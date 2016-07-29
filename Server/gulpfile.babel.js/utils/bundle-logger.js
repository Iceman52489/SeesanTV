import utils from 'gulp-util';
import prettyHrtime from 'pretty-hrtime';

let startTime;

module.exports = {
	start: function(filepath) {
		startTime = process.hrtime();
		utils.log('Bundle', utils.colors.green('started'), 'for', utils.colors.yellow(filepath) + '...');
	},

	watch: function(bundleName) {
		utils.log('Watching files required by', utils.colors.yellow(bundleName));
	},

	end: function(filepath) {
		var taskTime = process.hrtime(startTime),
				prettyTime = prettyHrtime(taskTime);

		utils.log('Bundle', utils.colors.cyan('finished'), 'for', utils.colors.yellow(filepath), 'in', utils.colors.magenta(prettyTime));
	}
};
