const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const animeAction = require('anime-actions');
const {Discord, EmbedBuilder} = require("discord.js")

class KissCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
      .setName('kiss')
      .setDescription('Kiss someone (or yourself)')
      .addUserOption((option) =>
        option
        .setName('user')
        .setDescription('Who to kiss 💋')
        .setRequired(true)
    )
    );
  }

  async chatInputRun(interaction) {
        const author = interaction.user.displayName
        const targetUser = interaction.options.getUser('user').displayName
        const kissgif = await animeAction.kiss(); 
        if (author == targetUser) {
            const hugEmbed = new EmbedBuilder()
            .setTitle(`${author} kiss themself passionately`)
            .setImage(`${kissgif}`)
        const msg = interaction.reply({ embeds: [hugEmbed]});
        } else {
            const hugEmbed = new EmbedBuilder()
                .setTitle(`${author} kisses ${targetUser}`)
                .setImage(`${kissgif}`)
            const msg = interaction.reply({ embeds: [hugEmbed]});
        }
  }
}

module.exports = {
  KissCommand
};