const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  url_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true },
  city: { type: String },
  device: { type: String },
  browser: { type: String },
  os: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Click', clickSchema);
