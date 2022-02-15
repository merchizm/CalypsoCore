const model = require('../models/settings').setting;

module.exports = {
  createGuild: function(guildId, guildName, systemChannelId) {
    return model.create({
      guildId: guildId,
      guildName: guildName,
      systemChannelId: systemChannelId,
      prefix: 'j!'
    }, function(err) {
      return !err;
    });
  },
  getGuilds: function() {
    return model.find({});
  },
  getGuild: function(guildId) {
    return model.findOne({guildId: guildId});
  },
  getSystemChannelId: function(guildId) {
    return model.findOne({guildId: guildId});
  },
  updatePrefix: function(guildId, newPrefix) {
    return model.updateOne({guildId: guildId}, {prefix: newPrefix}, function(err) {
      return !err;
    });
  },
  updateSystemChannelId: function(guildId, systemChannelId) {
    return model.updateOne({guildId: guildId}, {getSystemChannelId: systemChannelId}, function(err) {
      return !err;
    });
  },
  removeGuild: function(guildId){
    return model.deleteOne({guildId: guildId}, function(err) {
      return !err;
    });
  }
};