module.exports = {
	parseCategoryId: function(value) {
		return parseInt(value.replace(/javascript:show_index_hilight\('([0-9]+)'\)/g, '$1'));
	}
};
