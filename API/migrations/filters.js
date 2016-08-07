module.exports = {
	parseCategoryID: function(value) {
		return parseInt(value.replace(/javascript:show_index_hilight\('([0-9]+)'\)/g, '$1'));
	},

  parseProgramID: function(value) {
		return parseInt(value.replace(/program_detail\.php\?id=([0-9]+)$/g, '$1'));
	}
};
