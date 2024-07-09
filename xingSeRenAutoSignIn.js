const axios  = require('axios')
const { initInstance, getEnv } = require('./qlApi.js')
let instance = null

// https://xingseren.org/
const host = 'https://xingseren.com.cn'

/**
 * 更新形色人环境变量
 * @param {*} instance
 * @param {*} ck
 * @returns
 */
function updateXingSeRenEnv(instance, ck = {}) {
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

// 获取env里的chatmossToken
async function getXingSeRenToken(){
    let token = ''
    let instance = await initInstance()
   
    if(instance){
        token = await getEnv(instance, 'xingSeRenToken')
    }

    return {
        instanceCopy:instance,
        token:token[0]
    }

}

async function getUserMisson(token){
  const data = new URLSearchParams()
  data.append('paged',1)
  data.append('count',10)
  
  return await axios.post(host+ '/wp-json/b2/v1/getUserMission',data,{
    headers:{
      Authorization:"Bearer " + token.value
    }
  }).then(res=>{
    console.log('获取当日签到信息成功：',res.data?.mission)
  })
}


async function signIn(){

  const {instanceCopy,token} = await getXingSeRenToken()

  instance = instanceCopy

  await getUserMisson(token)


  await axios.post(host+ '/wp-json/b2/v1/userMission',{},{
    headers:{
      Authorization:"Bearer " + token.value
    }
  }).then(res=>{
    console.log('签到成功：',res.data)
  }).catch(err=>{
    console.log('err',err.response.data)
    if(err.response.data.message === '请先登录'){
      login().then(()=>{
        signIn()
      })
    }
    
  })
}

signIn()

async function login(){
  const data = new URLSearchParams()
  data.append('username','2423674938@qq.com')
  data.append('password','zzy19980520')

  // console.log(data)
  return axios.post(host+ '/wp-json/jwt-auth/v1/token',data).then(async res=>{
    const params = new URLSearchParams(res.headers['set-cookie'][0].split(';').join('&'))

    await updateXingSeRenEnv(instance,{"name":"xingSeRenToken","value": params.get('b2_token'),"remarks":"形色人token（https://xingseren.org/）","id":10})
  
    return params.get('b2_token')
  }).catch(err=>{
    console.log('err',err)
  })
}

// login()