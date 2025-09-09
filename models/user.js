const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//passport-local-mongoose adds username and a password field automatically
const userSchema = new Schema({
    email:{
        type: String,
        require: true,
    },

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema);


