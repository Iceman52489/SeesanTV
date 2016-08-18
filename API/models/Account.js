var mongoose = require('mongoose');
    Schema = mongoose.Schema,
    Account = mongoose.model('accounts', new Schema({
      provider: { type: String, required: true },
      username: { type : String, required : true },
      password: { type : String, required : true }
    }));
/*
db.accounts.insert({
  provider: "seesantv",
  username: "",
  password: ""
})
*/
module.exports = Account;
