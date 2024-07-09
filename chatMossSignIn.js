const { initInstance, getEnv, updateCkEnv } = require('./qlApi.js')
const axios = require('axios')
const https = require('https')
const notify = require('../sendNotify')
const cheerio = require('cheerio');

const agent = new https.Agent({
  rejectUnauthorized:false
})

const baseUrl = 'https://apicn.aihao123.cn'

// 获取env里的chatmossToken
async function getChatMossToken(){
    let token = ''
    let instance = await initInstance()
   
    if(instance){
        token = await getEnv(instance, 'chatMossToken')
    }

    return {
        instance,
        token:token[0]
    }

}

// chatMoss登录获取token
function chatMossLogin() {
  return axios
    .post(baseUrl+'/luomacode-api/user/login', {
      email: '1125089452@qq.com',
      password: 'zzy19980520',
    },{
       httpsAgent:agent
    })
    .then(res => {
      return res.data.loginToken
    })
}


// chatMoss签到
async function chatMossSignIn() {

    const {instance,token} = await getChatMossToken()

  let hostname = null

  return axios.post(
        baseUrl+'/luomacode-api/activity/signin',
        {},
        {
          headers: {
            Token: token.value
          },
          httpsAgent:agent
        }
      ).then(async res => {
        if(res.data.code===204){
            const newToken = await chatMossLogin()

            let params = {
                name: token.name,
                value: newToken,
                remarks: token.remarks || 'chatMoss的鉴权token', // 优先存储原有备注信息
            }

            // 新版青龙api
            if (token.id) {
                params.id = token.id
            }
            // 旧版青龙api
            if (token._id) {
                params._id = token._id
            }
            
            updateCkEnv(instance,params)

            return await chatMossSignIn()
          
        }

        console.log(hostname)
        const chatMossResidueCountFree = await  axios.get(
                baseUrl+'/luomacode-api/user/getBalanceInfo',
                { 
                  headers: {
                    Token: token.value
                  },
                  httpsAgent:agent
                }
            ).then(res=>{
              return res.data.data.residueCountFree
            })

      
      return {
        title: 'chatmoss签到',
        content: `
          chatmoss签到：${JSON.stringify(res.data)}
          剩余免费字符数：${chatMossResidueCountFree}
          `,
      }
    })
   
}



(async function (){
    try {
    const chatMossMessage = await chatMossSignIn()
    console.log(chatMossMessage)
    await notify.sendNotify(chatMossMessage.title, chatMossMessage.title+':'+chatMossMessage.content)
  } catch (error) {
    console.log(error)
    await notify.sendNotify('chatMoss签到错误', error)
  }
})()