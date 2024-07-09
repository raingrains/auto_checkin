/**
 * 无锡锡东八佰伴签到脚本  微信小程序-八佰伴智慧购
 */
const axios = require('axios')
const { initInstance, getEnv } = require('./qlApi.js')
const notify = require('../sendNotify')





let resetNum = 0
let  Authorization = ''
let instance = null
 let notifyContent= {
          title: '八佰伴小程序签到',
          content:'',
        }

/**
 * 更新环境变量
 * @param {*} instance
 * @param {*} ck
 * @returns
 */
function updateBaBaiBanEnv(instance, ck = {}) {
  return new Promise(resolve => {
    instance
      .put(`/open/envs?t=${+new Date()}`, ck)
      .then(res => {
        resolve(res.data)
      })
      .catch(error => {
        console.log(error.response.data)
      })
  })
}


/**
 * 登录获取token
 */
function login(){
  return axios.post('https://mp-gp.springland.com.cn/login/registerByInlet',{"name":"811982809878","gender":0,"mobile":"15895332950","encryptedData":"Mfudxjr1c3f5XbziyfceY47rdA6HArsTqKuWBsARP52K+ACoBrAuKpYx42h36CuJJjotTpk5dBO6im+XMabGvYpyNUTqGiPSuejwD7M5OTsKZYncDsiBStMbhhq5/MNH3HyHo5/Wkih9P6kOghT2VXWs14enH+pr8EnncIDQWEYDZcZ9aTr8R9DSYBG999bTYsD0mWS7rx10ikKS6b/CCg==","iv":"KZpvl9CfJs5WQNz2rEL2zg==","id":"1629378338940481536","openId":"obI3l5W421VwUsiXVmKlEK-qK8d4","mdid":"6031","tgrmdid":-1,"tgrhyid":-1}).then(async res=>{
    console.log(res.data,'重新登录获取了新token' )
    notifyContent.content+= `重新登录获取了新token
    `
    await updateBaBaiBanEnv(instance,{"name":"baBaiBanToken","value": res.data.result.token,"remarks":"八佰伴小程序token","id":8})
    return res.data.result.token
  })
}



// 获取env里的baBaiBanToken
async function getBaBaiBanToken(){
    let token = ''
     instance = await initInstance()
   
    if(instance){
        token = await getEnv(instance, 'baBaiBanToken')
    }

    return {
        instance,
        token:token[0]
    }

}


/**
 * 签到
 */
function sign(){
  const params = new URLSearchParams()
  params.append('hyid', 817286503)
  params.append('mdid', 6031)

  axios
    .post('https://mp-gp.springland.com.cn/sign/sign', params, {
      headers: {
        Authorization,
        ContentType: 'application/x-www-form-urlencoded',
      },
    })
    .then(async res => {
      console.log(res.data)
      if(res.data.result){
        notifyMessage(`今日结果：${res.data.result}`)
        return 
      }
    //   else if(res.data.errMsg==='请先登录！'){
    //     Authorization =  await login()
    //     sign()
    //   }else if(res.data.errMsg==='请重新登录！'){
    //     Authorization =  await login()
    //     sign()
    //   }
       notifyMessage(`今日结果：${res.data.errMsg}`)
      
    })
    .catch(() => {
      resetNum++
      if(resetNum<5){
        sign()
      }else{
        console.log('axios error')
        notifyMessage('重试5次失败')
      }
      
    })
}


/**
 * 获取用户的所有积分
 */
function  getAllRecord(){
  const params = new URLSearchParams()
  params.append('userId', 817286503)
  return axios
    .post('https://xcx.springland.com.cn/integral/selectjf', params, {
      headers: {
        Authorization,
        ContentType: 'application/x-www-form-urlencoded',
      },
    }).then(res=>{
      return res.data.result?.jf
    })
 
}

async function notifyMessage(content){
    notifyContent.content+= `${content}
      当前积分：${await getAllRecord()}`
    notify.sendNotify(notifyContent.title, notifyContent.content)
}

(async ()=>{
  let {token} = await getBaBaiBanToken()
  Authorization = token.value

  sign()
})()

