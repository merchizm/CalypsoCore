var mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.String,
    index: true,
    unique: true,
  },
  userName: {
    type: mongoose.Schema.Types.String,
  },
  userDiscriminator: {
    type: mongoose.Schema.Types.Number,
  },
  guildId: {
    type: mongoose.Schema.Types.Number,
    index: true,
  },
  guildName: {
    type: mongoose.Schema.Types.String,
  },
  dateJoined: {
    type: mongoose.Schema.Types.Date,
  },
  bot: {
    type: mongoose.Schema.Types.Boolean,
  },
  currentMember: {
    type: mongoose.Schema.Types.Boolean,
  },
  systemChannelId: {
    type: mongoose.Schema.Types.Number,
  },
});

const user = mongoose.model('user', usersSchema);

module.exports = {
  user
};