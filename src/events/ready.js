module.exports = async (client) => {

  const activities = [
    {name: 'upgrade', type: 'LISTENING'},
    {name: client.botName, type: 'LISTENING'}
  ];

  // Update presence
  client.user.setPresence({status: 'online', activities: [activities[0]]});

  let activity = 0;

  // Update activity every 30 seconds
  setInterval(() => {
    activities[2] = {name: `${client.guilds.cache.size} servers`, type: 'WATCHING'}; // Update server count
    activities[3] = {name: `${client.users.cache.size} users`, type: 'WATCHING'}; // Update user count
    if (activity > 3) activity = 0;
    client.user.setActivity(activities[activity]);
    activity++;
  }, 30000);

  client.logger.info('Updating database and scheduling jobs...');
  for (const guild of client.guilds.cache.values()) {

    /** ------------------------------------------------------------------------------------------------
     * UPDATE TABLES
     * ------------------------------------------------------------------------------------------------ */
    // Update settings table
    client.db.settings.createGuild(
      guild.id,
      guild.name,
      guild.systemChannelId
    );
    // Update users table
    guild.members.cache.forEach(member => {
      client.db.users.createUser(
        member.id,
        member.user.username,
        member.user.discriminator,
        guild.id,
        guild.name,
        member.joinedAt.toString(),
        member.user.bot
      );
    });

    /** ------------------------------------------------------------------------------------------------
     * CHECK DATABASE
     * ------------------------------------------------------------------------------------------------ */
    // If member left
    const currentMemberIds = await client.db.users.getCurrentMembers(guild.id);
    for (let id of currentMemberIds) {
      if (!guild.members.cache.has(id))
        client.db.users.updateCurrentMember(guild.id, id, 0);
    }

    // If member joined
    const missingMemberIds = await client.db.users.getMissingMembers(guild.id);
    for (let id of missingMemberIds) {
      if (guild.members.cache.has(id))
        client.db.users.updateCurrentMember(guild.id, id, 1);
    }
  }

  // Remove left guilds
  const dbGuilds = await client.db.settings.getGuilds();
  const guilds = Array.from(client.guilds.cache.keys());
  const leftGuilds = await dbGuilds.filter(g => !guilds.includes(g.guildId));
  for (const guild of leftGuilds) {
    client.db.settings.removeGuild(guild.guildId);
    client.db.users.removeGuild(guild.guildId);

    client.logger.info(`${client.botName} has left ${guild.guildName}`);
  }

  client.logger.info(`${client.botName} is now online`);
  client.logger.info(`${client.botName} is running on ${client.guilds.cache.size} server(s)`);
};
