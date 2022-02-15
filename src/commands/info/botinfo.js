const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const pkg = require(__basedir + '/package.json');
const { oneLine, stripIndent } = require('common-tags');
const {setting: model} = require('../../database/models/settings');

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bot', 'bi'],
      usage: 'botinfo',
      description: `Fetches ${client.botName} Bot information.`,
      type: client.types.INFO
    });
  }
  async run(message) {
    const prefix = await model.findOne({guildId: message.guild.id});
    const tech = stripIndent`
      Version     :: ${pkg.version}
      Library     :: Discord.js v13.6.0
      Environment :: Node.js v16.13.0
      Database    :: MongoDB
    `;
    const embed = new MessageEmbed()
      .setTitle(`${message.client.botName}'s Bot Information`)
      .setDescription(oneLine`${message.client.botDesc}`)
      .addField('Prefix', `\`${prefix.prefix}\``, true)
      .addField('Client ID', `\`${message.client.user.id}\``, true)
      .addField('Developer', '<@' + message.client.ownerId + '>', true)
      .addField('Tech', `\`\`\`asciidoc\n${tech}\`\`\``)
      .addField('Links',
        `[Invite Me](${message.client.inviteLink}) | [Support Server](${message.client.supportServer}) | `
      )
      .setFooter(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};
