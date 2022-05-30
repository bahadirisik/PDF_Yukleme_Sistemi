const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ContentSchema = new Schema({
    pdf_id:String,
    ad: [String],   
    numara:[String],
    juriler:[String],
    dersadi:String,
    tarih:String,
    ozet:String,
    baslik:String,
    anahtarKelimeler:[String],

  })

  const content = mongoose.model('Content', ContentSchema);

  module.exports= content