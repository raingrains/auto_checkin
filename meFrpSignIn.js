const axios= require('axios')
const FormData = require('form-data')
const notify = require('../sendNotify')

let resetNum = 0

/**
 * 签到
 */
function signIn(token,type='post'){
   
    axios({
        method:type,
        url:'https://api.mefrp.com/api/v4/auth/user/sign',
        headers:{
             Authorization: 'Bearer '+ token
        }
    }).then((res)=>{
        console.log(res)
        getUserInfo(token)
    }).catch(async err=>{
        resetNum++
        // console.log(err)
        console.log('ererr',err.response?.status)
        if(err.response?.status===401){
            console.log(111)
            const token = await login()
            console.log('token',token)
            signIn(token)
        } else if(err.response?.status===400 || err.response?.status===403){
            getUserInfo(token)
        }else{
            console.log(222)

            if(resetNum<10){
                signIn(token,type)
            }
          
        }
        
    })
}
//8c36612a41038f87f9e1597f9bd73a71




/**
 * 登录获取token
 */
 function login(){
    const formData = new FormData()
    formData.append('username','raingrains')
    formData.append('password','zzy19980520')

        console.log('login start:')
   
    return  axios.post('https://api.mefrp.com/api/v4/auth/login',formData,{
        'Content-Type': 'application/x-www-form-urlencoded'
    }).then(res=>{
        console.log(res.data)
        return res.data.access_token
    }).catch(async err=>{
        console.log('login err:',err)
       return await login()
    })
}


/**
 * 获取用户信息
 */
function getUserInfo(token){
    axios.get('https://api.mefrp.com/api/v4/auth/user',{
        headers:{
            Authorization: 'Bearer '+ token
        }
    }).then(async res=>{

        console.log(res.data)

        const proxiesList = await getUsedProxies(token)
        console.log('已创建隧道：',proxiesList)
        
        const content = `
            用户名： ${res.data.username}
            邮箱： ${res.data.email}
            隧道数： ${proxiesList.length} / ${res.data.proxies}
            剩余流量： ${(res.data.traffic/1024).toFixed(2)}GB
        `
        await notify.sendNotify('ME Frp内网穿透','ME Frp内网穿透:'+content)

    })
}



/**
 * 获取已使用的用户隧道
 */
 function getUsedProxies(token){
    return axios.get('https://api.mefrp.com/api/v4/auth/tunnel/list',{
        headers:{
            Authorization: 'Bearer '+ token
        }
    }).then(res=>{
       return res.data
    }).catch(async ()=>{
        return await getUsedProxies(token)
    })
}




signIn('8c36612a41038f87f9e1597f9bd73a71')