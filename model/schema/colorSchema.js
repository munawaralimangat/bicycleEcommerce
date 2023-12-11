const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  color_name: {
    type: String,
    required: true,
  },
});

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;