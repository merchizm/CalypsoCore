var mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.Schema.Types.String,
    index: true,
    unique: true,
  },
  guildName: {
    type: mongoose.Schema.Types.String,
  },
  systemChannelId: {
    type: mongoose.Schema.Types.Number
  },
  prefix: {
    type: mongoose.Schema.Types.String,
    default: 'j!'
  }
});

const setting = mongoose.model('setting', settingsSchema);

module.exports = {
  setting
};