const axios = require('axios')

module.exports = {
  // 掘金的自动签到
  check_in: (cookie) => {
    return axios.post('https://api.juejin.cn/growth_api/v1/check_in','',{
      headers: {
        cookie
      }
    }).then(res=>res.data)
  },
  // 掘金的自动抽奖
  draw: (cookie) => {
    return axios.post('https://api.juejin.cn/growth_api/v1/lottery/draw','', {
      headers: {
        cookie
      }
    }).then(res=>res.data)
  },
  account:(cookie)=>{
    return axios.post('https://api.juejin.cn/growth_api/v1/get_cur_point','', {
      headers: {
        cookie
      }
    }).then(res=>res.data)
  }
}