/**
 * 星空内网frpc 内网穿透 https://frp.starryfrp.com/
 */
const axios = require('axios')
const cheerio = require('cheerio')
const notify = require('../sendNotify')


let resetNum  = 0

/**
 * 获取用户数据
 */
 function starryFrpInfo(cookie) {
  return axios
    .get('https://frp.starryfrp.com/console/Profile', {
      headers: {
        Cookie:cookie,
      },
      proxy: {
        protocol: 'http',
        host: '192.168.3.24',
        port: 7890,
      },
    })
    .then(res => {
      const Jqery = cheerio.load(res.data)
      const msg = `
                    用户名：${Jqery(
                      '.list-group li:nth-child(2) .text-secondary'
                    ).text()}
                    可用隧道数/拥有隧道数:${Jqery(
                      '.list-group li:nth-child(4) .text-secondary'
                    ).text()}
                    剩余流量:${Jqery(
                      '.list-group li:nth-child(5) .text-secondary'
                    ).text()}
                `

      return msg
    }).catch(async ()=>{
        resetNum++
        console.log(`重试${resetNum}~`)
        if(resetNum<=20){
            return await starryFrpInfo(cookie)
        }else{
            return ''
        }
    })
   
}

/**
 * 签到
 */
function signInStarryFrp(cookie){
    return axios.get('https://frp.starryfrp.com/console/Signc/Sign?csrf=f8884032fb5dd6e2b5287b5abfb13516',{
        headers:{
            Cookie:cookie
        }
    }).then(async response=>{
        if(response.data.msg==='未登录'){
            return '未登录'
        }

      return {
          msg:`签到：${response.data.msg}`+ await starryFrpInfo(cookie)
      }

    })
}


/**
 * 登录
 */
function login(){
    const data = new FormData()
    data.username = 'raingrains'
    data.password = 'zzy19980520'
    return axios.post('https://frp.starryfrp.com/auth/login/login?r_u=http%3A%2F%2Ffrp.starryfrp.com%2Fconsole%3F',data).then(res=>{
        console.log(res)
        return true
    },(err)=>{return false})
}

async function init(){

    const isLogin = await login()
    if(!isLogin){
        return {
             title: '星空内网签到',
            content: '登录失败',
        }
    }
    const cookie = 'PHPSESSID=vnak2m1rt7lh6su6mfvr8uo58g; Hm_lvt_b0484d537cf505eb114b28a53d0859b1=1689315030,1690036480,1690959135; Hm_lpvt_b0484d537cf505eb114b28a53d0859b1='+((Date.now()-300)/1000).toFixed()

    const content = await signInStarryFrp(cookie)
        return  {
            title: '星空内网签到',
            content: content.msg,
        }
}



(async function (){
    try {
    const message = await init()
    console.log(message)
    await notify.sendNotify(message.title, message.title+':'+message.content)
  } catch (error) {
    console.log(error)
    await notify.sendNotify('星空内网签到错误', error)
  }
})()