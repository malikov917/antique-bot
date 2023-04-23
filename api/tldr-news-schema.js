const mongoose = require('mongoose');
const tldrNewsSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, 'Id is required']
  },
  headline: { type: String, required: [true, 'Link is required'] },
  description: { type: String, required: [true, 'Link is required']  },
  url: { type: String, required: [true, 'Link is required']  },
  image: { type: String },
  status: { type: String, enum: ['POSTED', 'NEW'], default: 'NEW' }
}, { timestamps: true });

module.exports = tldrNewsSchema;
