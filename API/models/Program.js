var mongoose = require('mongoose');
    Schema = mongoose.Schema,
    Program = mongoose.model('programs', new Schema({
      id: { type: Number, required: true },
      categoryID: { type: Number },
      title: { type: String, required: true },
      cover: { type: String },
      details: { type: String }
    }));

module.exports = Program;
