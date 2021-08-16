const config = require('./config')
const task = require('./task')
const message = require('./message')

async function index(){
  const data = {
    jueJin:{
      checkIn:null,
      draw:null
    },
    freeV2ray:{
      checkIn:null
    }
  }
  if(config.jueJin_cookie.length>0){
    data.jueJin.checkIn = await task.jueJin.check_in(config.jueJin_cookie)
    // data.jueJin.draw = await task.jueJin.draw(config.jueJin_cookie)
  }

  if(config.freeV2ray_cookie.length>0){
    // data.freeV2ray.checkIn = await task.freeV2ray.check_in(config.freeV2ray_cookie)
  }
  message.sendMail(`
    自动签到:
  1.掘金签到：${JSON.stringify(data.jueJin.checkIn)},
  2.掘金抽奖：${JSON.stringify(data.jueJin.draw)},
  3.freeV2ray签到：${JSON.stringify(data.freeV2ray.checkIn)}
  `)
}

index()