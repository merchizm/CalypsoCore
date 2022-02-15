const model = require('../models/users').user;

module.exports = {
  createUser: function(userId, userName, userDiscriminator, guildId, guildName, dateJoined, bot) {
    model.create({
      userId: userId,
      userName: userName,
      userDiscriminator: userDiscriminator,
      guildId: guildId,
      guildName: guildName,
      dateJoined: dateJoined,
      bot: bot,
      currentMember: true
    }, function(err) {
      return !err;
    });
  },
  getUser: function(userId, guildId) {
    return model.findOne({ guildId: guildId, userId: userId }, null,{ strict: false });
  },
  getCurrentMembers: function(guildId) {
    return model.find({ guildId: guildId, currentMember: true }, null,{ strict: false }).select('userId');
  },
  getMissingMembers: function(guildId) {
    return model.find({ guildId: guildId, currentMember: false }, null,{ strict: false }).select('userId');
  },
  updateCurrentMember: function(guildId, userId, currentMember) {
    return model.updateOne({guildId: guildId, userId: userId}, {currentMember: currentMember}, function(err) {
      return !err;
    });
  },
  updateGuildName: function(guildId, guildName) {
    return model.updateOne({ guildId: guildId }, { guildName: guildName }, function(err) {
      return !err;
    });
  },
  updateUser: function(userId, userName, userDiscriminator) {
    return model.updateOne({ userId: userId }, { userName: userName, userDiscriminator: userDiscriminator }, function(err) {
      return !err;
    });
  },
  removeGuild: function(guildId) {
    return model.deleteMany({ guildId: guildId }, function(err) {
      return !err;
    });
  },
};