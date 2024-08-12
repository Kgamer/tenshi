const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const schedule = require("node-schedule");

class PremiumCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
      .setName('premium')
      .setDescription('Cho role Thiên sứ cao cấp (không cần sử dụng /mbs)')
      .addUserOption((option) =>
        option
        .setName('member')
        .setDescription('Member')
        .setRequired(true)
    )
      .addStringOption((option) => option
        .setName('date')
        .setDescription('Ngày hết hạn DD/MM/YYYY Ngày và tháng lẻ viết 1 số (vd: ngày 6 tháng 8 năm 2024 = 6/8/2024)')
        .setRequired(true)
    )
    );
  }
  
async chatInputRun(interaction) {

    const mongoose = require('mongoose')
    const mbsSchema = require('../schema/premium-schema')

    let member = interaction.options.getMember('member')
    let expireDate = interaction.options.getString('date').split('/')

    if (interaction.member.roles.cache.has('1070625539435532368') || interaction.member.roles.cache.has('940274217193201704')) {
        if (!member.roles.cache.has('1226895268256153651')) {
            member.roles.add('1208953626811433011')
            member.roles.add('1226895268256153651')
            await new mbsSchema({
                memberId: `${member.id}`,
                date: `${expireDate[1]}/${expireDate[0]}/${expireDate[2]}`
            }).save()
            return interaction.reply({content: `Cá nhân này chưa có role ***Thiên sứ cao cấp*** nên tao add cho r đấy, biết ơn đi mày. Hết hạn ngày ${expireDate[0]}/${expireDate[1]}/${expireDate[2]}`})
        } else {
            const userMbs = await mbsSchema.findOne({memberId: member.id,})
            let { date } = userMbs
            return interaction.reply({content: `Cá nhân này có sẵn ***Thiên sứ cao cấp*** rồi, đợi họ hết rồi dùng lại nhé (${date})`})
        }
    } else {interaction.reply('cậu chưa có role mod á, nên không dùng đc cái lệnh này đâu á, vậy nên đừng dùng nha, lag lắm :3')}
}
}

module.exports = {
    PremiumCommand
};