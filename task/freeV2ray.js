const axios = require('axios')



module.exports = {
  // freeV2ray的自动签到
  check_in: (cookie) => {
    return axios.post('https://www.mfv2ray.top/user/checkin','', {
      headers: {
        cookie
      }
    }).then(res=res.data)
  }
}