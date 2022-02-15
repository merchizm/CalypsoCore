const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const {setting: model} = require('../database/models/settings');

module.exports = async (client, message) => {
  if (message.channel.type === 'dm' || !message.channel.viewable || message.author.bot) return;


  // Command handler
  let prefix = await model.findOne({guildId: message.guild.id});
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix.prefix})s*`);

  if (prefixRegex.test(message.content)) {

    const [, match] = message.content.match(prefixRegex);
    const args = message.content.slice(match.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd) || client.aliases.get(cmd); // If command not found, check aliases
    if (command) {
      // Check permissions
      const permission = command.checkPermissions(message);
      if (permission) {
        message.command = true; // Add flag for messageUpdate event
        return command.run(message, args); // Run command
      }
    } else if (
      (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) &&
      message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const embed = new MessageEmbed()
        .setTitle(`Hi, I'm ${client.botName}. Need help?`)
        .setDescription(`You can see everything I can do by using the \`${prefix.prefix}help\` command.`)
        .addField('Invite Me', oneLine`
          You can add me to your server by clicking 
          [here](${message.client.inviteLink})!
        `)
        .addField('Support', oneLine`
          If you have questions, suggestions, or found a bug, please join the 
          [Calypso Support Server](${message.client.supportServer})!
        `)
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({embeds:[embed]});
    }
  }
};

