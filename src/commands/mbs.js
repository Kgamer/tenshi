const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const schedule = require("node-schedule");

class MbsCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
      .setName('mbs')
      .setDescription('Cho role membership')
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
      .addStringOption(option => 
        option.setName('type').setDescription('Cấp membership').setRequired(true).addChoices(
          {name: 'Tiểu thiên sứ - Thiên sứ trung cấp', value: 'membership'},
          {name: 'Thiên sứ cao cấp', value: 'premium'}
        )
      )
    );
  }



  async chatInputRun(interaction) {
    // Check if user is a moderator or has the Tenshi role
    if (interaction.member.roles.cache.has('1070625539435532368') || interaction.member.roles.cache.has('940274217193201704')) { 
      //import mongoose
      const mongoose = require('mongoose')

      //import mongo schemas
      const mbsSchema = require('../schema/premium-schema')    
      const premiumSchema = require('../schema/membership-schema')
  
      //parsing command options
      let member = interaction.options.getMember('member')
      let expireDate = interaction.options.getString('date').split('/')
      let mbsOption = interaction.options.getString('type')

      //Check the type of membership
      if (mbsOption === 'membership') {
        const userMbs = await mbsSchema.findOne({memberId: member.id,})
        // Check if mention user already has the membership from DB
         if (!userMbs) { 
          //add role and write to DB
            member.roles.add('1208953626811433011')
            await new mbsSchema({
                memberId: `${member.id}`,
                date: `${expireDate[1]}/${expireDate[0]}/${expireDate[2]}`
            }).save()
            //checkout
            return interaction.reply({content: `Cá nhân này chưa có role ***Membership*** nên tao add cho r đấy, biết ơn đi mày. Hết hạn ngày ${expireDate[0]}/${expireDate[1]}/${expireDate[2]}`})
        } else {
            let { date } = userMbs
            //checkout
            return interaction.reply({content: `Cá nhân này có sẵn ***Membership*** rồi, đợi nó hết rồi dùng lại nhé (${date})`})
        }
      } else if (mbsOption === 'premium') {
        const userMbs = await premiumSchema.findOne({memberId: member.id,})
        // Check if mention user already has the membership from DB
        if (!userMbs) {
          //add role and write to DB
          member.roles.add('1208953626811433011')
          member.roles.add('1226895268256153651')
          await new premiumSchema({
              memberId: `${member.id}`,
              date: `${expireDate[1]}/${expireDate[0]}/${expireDate[2]}`
          }).save()
          //checkout
          return interaction.reply({content: `Cá nhân này chưa có role ***Thiên sứ cao cấp*** nên tao add cho r đấy, biết ơn đi mày. Hết hạn ngày ${expireDate[0]}/${expireDate[1]}/${expireDate[2]}`})
      } else {
          let { date } = userMbs
          //checkout
          return interaction.reply({content: `Cá nhân này có sẵn ***Thiên sứ cao cấp*** rồi, đợi họ hết rồi dùng lại nhé (${date})`})
      }
      }
      
  } else {interaction.reply('cậu chưa có role mod á, nên không dùng đc cái lệnh này đâu á, vậy nên đừng dùng nha, lag lắm :3')}


  }
}

module.exports = {
  MbsCommand
};