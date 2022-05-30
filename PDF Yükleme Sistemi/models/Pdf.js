const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const PdfSchema = new Schema({
    id:String,
    pdf:String
    
  })

  const pdf = mongoose.model('pdf', PdfSchema);

  module.exports= pdf