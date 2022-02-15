const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class GitHubCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'github',
      aliases: ['gh', 'repo'],
      usage: 'github',
      description: `Displays the link to ${client.botName}'s GitHub repository.`,
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('GitHub Link')
      .setThumbnail('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png')
      .setDescription(oneLine`
        Click [here](https://github.com/merchizm/CalypsoCore) to to visit my GitHub repository!
        Please support me by starring ⭐ the repo, and feel free to comment about issues or suggestions!
      `)
      .addField('Other Links',
        `[Invite Me](${message.client.inviteLink}) | [Support Server](${message.client.supportServer})`
      )
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds:[embed]});
  }
};
