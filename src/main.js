const { SapphireClient } = require('@sapphire/framework');
const { Discord, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose')

dotenv.config();

const client = new SapphireClient({
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
    loadMessageCommandListeners: true
});



(async () => {
  await mongoose.connect(process.env.MONGOKEY).catch(console.error)
})();

client.login(process.env.TOKEN);

const checkTime = async () => {
  console.log('checkin!')
  const mbsSchema = require('./schema/membership-schema')
  const premiumSchema = require('./schema/premium-schema')


  var machineOutput = new Date();
  var machineDate = machineOutput.toLocaleDateString();
  const userMbs = await mbsSchema.find({date: machineDate})
  const userPremium =await premiumSchema.find({date: machineDate})

  const guild = client.guilds.fetch('607838723115319297')
  const membershipRole = '1208953626811433011'
  const premiumRole = '1226895268256153651'

  for (const result of userMbs) {
    const { memberId } = result
    const memberCheck = await client.users.fetch(memberId)
    const mbsMember = (await (await guild).members.fetch(memberId))
    if (memberCheck) {
      mbsMember.roles.remove(membershipRole)
      await mbsSchema.deleteOne(result);
      console.log(`removing ${memberId} mbs role`)
      
      memberCheck.send(`<@${memberId}>, gói hội viên của bạn trong server Ami Tenshi đã hết hạn, vui lòng cập nhật gói hội viên tại <#1208952939654156308>. Bạn có thể xem hướng dẫn xác minh tại <#1208953027554443294>`)
      const mbsRemoveEmbed = new EmbedBuilder().setTitle(`Đã xoá tiểu thiên sứ của  <@${memberId}>`).setImage(`${(memberCheck).avatarURL()}`);
        (await (await guild).channels.fetch('1270328191243915265')).send({embeds: [mbsRemoveEmbed]});
    }
  }
  for (const result of userPremium) {
    const { memberId } = result
    const memberCheck = await client.users.fetch(memberId)
    const mbsMember = (await (await guild).members.fetch(memberId))
    if (memberCheck) {
      if (mbsMember.roles.cache.has(premiumRole)) {
        mbsMember.roles.remove(membershipRole)
        mbsMember.roles.remove(premiumRole)
        await premiumSchema.deleteOne({memberId: memberId});
        console.log(`removing ${memberId} premium role`)

        memberCheck.send(`<@${memberId}>, gói hội viên của bạn trong server Ami Tenshi đã hết hạn, vui lòng cập nhật gói hội viên tại <#1208952939654156308>. Bạn có thể xem hướng dẫn xác minh tại <#1208953027554443294>`)
        const premiumRemoveEmbed = new EmbedBuilder().setTitle(`Đã xoá thiên sứ cao cấp của  <@${memberId}>`).setImage(`${(memberCheck).avatarURL()}`);
        (await (await guild).channels.fetch('1270328191243915265')).send({embeds: [premiumRemoveEmbed]});
      }
    }
  }
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  (await (await guild).channels.fetch('1270328191243915265')).send({content: `Đã check [${machineOutput.toLocaleDateString('en-US', options)}]`});
  console.log('Check Done!')
  setTimeout(checkTime, 86400000)
}

checkTime();