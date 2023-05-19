const mongoose = require('mongoose');
const antiques = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, 'Id is required']
  },
  title: { type: String },
  description: { type: String },
  url: { type: String, required: true },
  price: { type: String },
  status: { type: String, enum: ['POSTED', 'NEW'], default: 'NEW' }
}, { timestamps: true });

module.exports = antiques;
