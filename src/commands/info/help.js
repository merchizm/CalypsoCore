const Command = require('../Command.js');
const {MessageEmbed} = require('discord.js');
const emojis = require('../../utils/emojis.json');
const {oneLine, stripIndent} = require('common-tags');
const {setting: model} = require('../../database/models/settings');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'h'],
      usage: 'help [command | all]',
      description: oneLine`
        Displays a list of all current commands, sorted by category. 
        Can be used in conjunction with a command for additional information.
        Will only display commands that you have permission to access unless the \`all\` parameter is given.
      `,
      type: client.types.INFO,
      examples: ['help ping']
    });
  }

  async run(message, args) {

    const all = (args[0] === 'all') ? args[0] : '';
    const embed = new MessageEmbed();
    const prefix = await model.findOne({guildId: message.guild.id}); // Get prefix
    const {INFO, MISC} = message.client.types;
    const {capitalize} = message.client.utils;

    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (command) {

      embed // Build specific command help embed
        .setTitle(`Command: \`${command.name}\``)
        .setThumbnail('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png')
        .setDescription(command.description)
        .addField('Usage', `\`${prefix.prefix}${command.usage}\``, true)
        .addField('Type', `\`${capitalize(command.type)}\``, true)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      if (command.aliases) embed.addField('Aliases', command.aliases.map(c => `\`${c}\``).join(' '));
      if (command.examples) embed.addField('Examples', command.examples.map(c => `\`${prefix.prefix}${c}\``).join('\n'));

    } else if (args.length > 0 && !all) {
      return this.sendErrorMessage(message, 0, 'Unable to find command, please check provided command');

    } else {

      // Get commands
      const commands = {};
      for (const type of Object.values(message.client.types)) {
        commands[type] = [];
      }

      const emojiMap = {
        [INFO]: `${emojis.info} ${capitalize(INFO)}`,
        [MISC]: `${emojis.misc} ${capitalize(MISC)}`,
      };

      message.client.commands.forEach(command => {
        if (command.userPermissions && command.userPermissions.every(p => message.member.hasPermission(p)) && !all)
          commands[command.type].push(`\`${command.name}\``);
        else if (!command.userPermissions || all) {
          commands[command.type].push(`\`${command.name}\``);
        }
      });

      const total = Object.values(commands).reduce((a, b) => a + b.length, 0);
      const size = message.client.commands.size;

      embed // Build help embed
        .setTitle(`${message.client.botName}'s Commands`)
        .setDescription(stripIndent`
          **Prefix:** \`${prefix.prefix}\`
          **More Information:** \`${prefix.prefix}help [command]\`
          ${(!all && size != total) ? `**All Commands:** \`${prefix.prefix}help all\`` : ''}
        `)
        .setFooter(
          (!all && size != total) ?
            'Only showing available commands.\n' + message.member.displayName : message.member.displayName,
          message.author.displayAvatarURL({dynamic: true})
        )
        .setTimestamp()
        .setImage('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso_Title.png')
        .setColor(message.guild.me.displayHexColor);

      for (const type of Object.values(message.client.types)) {
        if (commands[type][0])
          embed.addField(`**${emojiMap[type]} [${commands[type].length}]**`, commands[type].join(' '));
      }

      embed.addField(
        '**Links**',
        '**[Invite Me](${message.client.inviteLink}) | [Support Server](${message.client.supportServer}) | [Repository](https://github.com/merchizm/CalypsoCore)**'
      );

    }
    message.channel.send({embeds: [embed]});
  }
};