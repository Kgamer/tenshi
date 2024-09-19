const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js')

class MbsCheckCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
      .setName('mbscheck')
      .setDescription('Check membership status for all')
    );
  }

  async chatInputRun(interaction) {
    if (interaction.member.roles.cache.has('1070625539435532368') || interaction.member.roles.cache.has('940274217193201704')) {
      const msg = await interaction.reply('Checkin!')
      console.log('Check initialized')

      const machineOutput = new Date();
      const machineDate = machineOutput.toLocaleDateString();
  
      const mbsSchema = require('../schema/membership-schema')
      const premSchema = require('../schema/premium-schema')
      const userMbs = await mbsSchema.find({date: machineDate})
      const userPremium =await premSchema.find({date: machineDate})
    
      const guild = this.container.client.guilds.fetch('607838723115319297')
      const membershipRole = '1208953626811433011'
      const premiumRole = '1226895268256153651'
  
      for (const result of userMbs) {
        const { memberId } = result
        const memberCheck = await this.container.client.users.fetch(memberId)
        const mbsMember = (await (await guild).members.fetch(memberId))
        if (memberCheck) {
          mbsMember.roles.remove(membershipRole)
          await mbsSchema.deleteOne(result);
          
          memberCheck.send(`<@${memberId}>, gói hội viên của bạn trong server Ami Tenshi đã hết hạn, vui lòng cập nhật gói hội viên tại <#1208952939654156308>. Bạn có thể xem hướng dẫn xác minh tại <#1208953027554443294>`)
          console.log(`removed ${memberId} mbs role`)
          const mbsRemoveEmbed = new EmbedBuilder().setTitle(`Đã xoá tiểu thiên sứ của ${(await memberCheck).username}`).setImage(`${(await memberCheck).avatarURL()}`).setFooter({ text: `@<${memberId}>`});

          return (await (await guild).channels.fetch('1270328191243915265')).send({embeds: [mbsRemoveEmbed]});
        }
      }
      for (const result of userPremium) {
        const { memberId } = result
        const memberCheck = this.container.client.users.fetch(memberId)
        const mbsMember = (await (await guild).members.fetch(memberId))
        if (memberCheck) {
          if (mbsMember.roles.cache.has(premiumRole)) {
            mbsMember.roles.remove(membershipRole)
            mbsMember.roles.remove(premiumRole)
            await premSchema.deleteOne({memberId: memberId});
    
            memberCheck.send(`<@${memberId}>, gói hội viên của bạn trong server Ami Tenshi đã hết hạn, vui lòng cập nhật gói hội viên tại <#1208952939654156308>. Bạn có thể xem hướng dẫn xác minh tại <#1208953027554443294>`)
            console.log(`removed ${memberId} premium role`)
            const premiumRemoveEmbed = new EmbedBuilder().setTitle(`Đã xoá tiểu thiên sứ của ${(await memberCheck).username}`).setImage(`${(await memberCheck).avatarURL()}`).setFooter({ text: `@<${memberId}>`});
            return await ((await guild).channels.fetch('1270328191243915265')).send({embeds: [premiumRemoveEmbed]});
          }
        }
      }
      console.log('Manual check done')
      return interaction.editReply('Check Done!')
    } else {
      return interaction.reply('Bạn không có quyền dùng lệnh này.')
     
  }
}
}

module.exports = {
  MbsCheckCommand
};