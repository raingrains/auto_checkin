const axios = require('axios')

module.exports = {
  // freeV2ray的自动签到
  check_in: (cookie) => {
    return axios.post('https://by.jxdy.top/user/checkin','', {
      headers: {
        cookie
      }
    }).then(res=>res.data)
  }
}