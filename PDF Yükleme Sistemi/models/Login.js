const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const GirisSchema = new Schema({
    username: String,
    password: String,
    authority:String,
    
  })

  const giris = mongoose.model('giris', GirisSchema);

  module.exports= giris