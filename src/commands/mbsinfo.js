const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder, channelMention, roleMention, userMention } = require('discord.js')

class MbsInfoCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
      .setName('mbsinfo')
      .setDescription('kiểm tra thời hạn membership của bạn')
    );
  }

  async chatInputRun(interaction) {
      
      const userId = await interaction.member.id

      const mbsSchema = require('../schema/membership-schema')
      const premSchema = require('../schema/premium-schema')
      const userMbs = await mbsSchema.findOne({memberId: userId})
      const userPremium =await premSchema.findOne({memberId: userId})

      if (userMbs) {
        const {date} = userMbs
        const msg = await interaction.reply(`Membership của bạn hết hạn ngày ${date} (Tháng/Ngày/Năm)`)
      } else if (userPremium) {
        const {date} = userPremium
        const msg = await interaction.reply(`Membership của bạn hết hạn ngày ${date} (Tháng/Ngày/Năm)`)
      } else {
        const msg = await interaction.reply(`Bạn hiện chưa có hoặc chưa xác minh membership`)
      }
}
}

module.exports = {
  MbsInfoCommand
};