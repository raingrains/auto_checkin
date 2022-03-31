const config = require('./config')
const task = require('./task')
const message = require('./message')
const { autoGame } =require('./task/autoGame')

async function index(){
  const data = {
    jueJin:{
      checkIn:null,
      draw:null,
      lucky:null
    },
    freeV2ray:{
      checkIn:null
    }
  }
  if(config.jueJin_cookie.length>0){
    data.jueJin.checkIn = await task.jueJin.check_in(config.jueJin_cookie)
    data.jueJin.draw = await task.jueJin.draw(config.jueJin_cookie)
    data.jueJin.lucky = await task.jueJin.lucky(config.jueJin_cookie)
  }
  // v2ray取消签到规则了
//   if(config.freeV2ray_cookie.length>0){
//     data.freeV2ray.checkIn = await task.freeV2ray.check_in(config.freeV2ray_cookie)
//   }
  autoGame()
  
//   1.freeV2ray签到：${JSON.stringify(data.freeV2ray.checkIn)}
  message.sendMail(`
  ####自动签到:
  
  2.掘金签到：${JSON.stringify(data.jueJin.checkIn)},
  3.掘金抽奖：${JSON.stringify(data.jueJin.draw)},
  4.掘金沾喜气：${JSON.stringify(data.jueJin.lucky)}
  `)
}

index()
