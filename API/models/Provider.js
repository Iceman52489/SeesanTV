var mongoose = require('mongoose');
    Schema = mongoose.Schema,
    Provider = mongoose.model('accounts', new Schema({
      id: { type: String, required: true },
      name: { type: String, required: true }
    }));
/*
db.providers.insert({
  _id: "seesan",
  name: "SeesanTV"
})
*/
module.exports = Provider;
