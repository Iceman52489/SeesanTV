var mongoose = require('mongoose');
    Schema = mongoose.Schema,
    Clip = mongoose.model('clips', new Schema({
      id: { type: Number, required: true },
      programID: { type: Number, required: true },
      name: { type: String },
      src: { type: String },
      updatedAt: { type: Date, default: Date.now }
    }));

module.exports = Clip;
