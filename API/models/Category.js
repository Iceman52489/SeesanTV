var mongoose = require('mongoose');
    Schema = mongoose.Schema,
    Category = mongoose.model('categories', new Schema({
      id: { type: Number, required: true },
      category: { type : String, required : true },
      updatedAt: { type: Date, default: Date.now }
    }));

module.exports = Category;
