var mongoose = require('mongoose');
    Schema = mongoose.Schema,
    Category = mongoose.model('categories', new Schema({
      id: { type: Number, required: true },
      category: { type : String, required : true }
    }));

module.exports = Category;
