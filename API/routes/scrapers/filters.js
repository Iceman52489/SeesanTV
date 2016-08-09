module.exports = {
  trim: function (value) {
    return typeof value === 'string' ? value.trim() : value
  },

  reverse: function(value) {
    return typeof value === 'string' ? value.split('').reverse().join('') : value
  },

  slice: function(value, start , end) {
    return typeof value === 'string' ? value.slice(start, end) : value
  },

  parseCategoryID: function(value) {
    return parseInt(value.replace(/javascript:show_index_hilight\('([0-9]+)'\)/g, '$1'));
  },

  parseClipID: function(value) {
    return parseInt(value.replace(/player\.php\?clip_id=([0-9]+)&.+/g, '$1').trim());
  },

  parseProgramID: function(value) {
    return parseInt(value.replace(/program_detail\.php\?id=([0-9]+)$/g, '$1'));
  },

  parseDescription: function(value) {
    value = value.replace(/\t|\n|\r/g, ' ')
    value = value.replace(/ +/g, ' ');
    return value.trim();
  }
};
