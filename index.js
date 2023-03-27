const config = require('./config')
const task = require('./task')
const message = require('./message')

async function index() {
  const data = {
    jueJin: {
      checkIn: null,
      draw: null,
      lucky: null
    },
  }
  if (config.jueJin_cookie.length > 0) {
    data.jueJin.checkIn = await task.jueJin.check_in(config.jueJin_cookie)
    data.jueJin.draw = await task.jueJin.draw(config.jueJin_cookie)
    data.jueJin.lucky = await task.jueJin.lucky(config.jueJin_cookie)
  }


  // message.sendMail(`
  // ####自动签到:

  // 2.掘金签到：${JSON.stringify(data.jueJin.checkIn)},
  // 3.掘金抽奖：${JSON.stringify(data.jueJin.draw)},
  // 4.掘金沾喜气：${JSON.stringify(data.jueJin.lucky)}
  // `)

  if (Object.keys(data.jueJin).map(item => data.jueJin[item].successful).includes(false)) {
    message.sendMail(` ####自动签到:
  
    2.掘金签到：${JSON.stringify(data.jueJin.checkIn)},
    3.掘金抽奖：${JSON.stringify(data.jueJin.draw)},
    4.掘金沾喜气：${JSON.stringify(data.jueJin.lucky)}`)
  }
}

index()
