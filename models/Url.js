const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  title: { type: String, required: true },
  original_url: { type: String, required: true },
  short_url: { type: String, required: true, unique: true },
  custom_url: { type: String, unique: true, sparse: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qr_code: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);
