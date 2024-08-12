const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const animeAction = require('anime-actions');
const {Discord, EmbedBuilder} = require("discord.js")

class HugCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
      .setName('hug')
      .setDescription('Hug someone (or yourself)')
      .addUserOption((option) =>
        option
        .setName('user')
        .setDescription('Who to hug 🫂')
        .setRequired(true)
    )
    );
  }

  async chatInputRun(interaction) {
        const author = interaction.user.displayName
        const targetUser = interaction.options.getUser('user').displayName
        const huggif = await animeAction.hug(); 
        if (author == targetUser) {
            const hugEmbed = new EmbedBuilder()
            .setTitle(`${author} hugs themself`)
            .setImage(`${huggif}`)
        const msg = interaction.reply({ embeds: [hugEmbed]});
        } else {
            const hugEmbed = new EmbedBuilder()
                .setTitle(`${author} hugs ${targetUser}`)
                .setImage(`${huggif}`)
            const msg = interaction.reply({ embeds: [hugEmbed]});
        }
  }
}
module.exports = {
  HugCommand
};