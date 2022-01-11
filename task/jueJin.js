const axios = require('axios')

const aid = '2608'
const uuid = '6953843768190289439'
const luckUrl = `https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky?aid=${aid}&uuid=${uuid}`
const checkInUrl = `https://api.juejin.cn/growth_api/v1/check_in?aid=${aid}&uuid=${uuid}`
const drawUrl = `https://api.juejin.cn/growth_api/v1/lottery/draw?aid=${aid}&uuid=${uuid}`
const isFreeUrl = `https://api.juejin.cn/growth_api/v1/lottery_config/get?aid=${aid}&uuid=${uuid}`

module.exports = {
  // 掘金的自动签到
  check_in: (cookie) => {
    return axios.post(checkInUrl,'',{
      headers: {
        cookie,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67'
      }
    }).then(res=>res.data)
  },
  // 掘金的自动抽奖
  draw: (cookie) => {
    axios.get(isFreeUrl,'',{
      headers: {
        cookie,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67'
      }
    }).then(res=>{
      if(res.data.data.free_count>0){
        return axios.post(drawUrl,'', {
          headers: {
            cookie,
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67'
          }
        }).then(res=>res.data) 
      }else{
        return '今天已经免费抽奖过了'
      }
    })
    
  },
  // 沾喜气
  lucky:(cookie)=>{
    return axios.post(luckUrl,{
      lottery_history_id: "7020267603864059917",
    },{
      headers: {
        cookie,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67'
      }
    }).then(res=>res.data)
  }
}