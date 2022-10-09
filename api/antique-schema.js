const mongoose = require('mongoose');
const antiques = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, 'Id is required']
  },
  title: { type: String },
  description: { type: String },
  price: { type: String },
  status: { type: 'POSTED' | 'NEW' }
});

module.exports = antiques;
