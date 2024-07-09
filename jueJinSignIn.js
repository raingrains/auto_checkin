/**
 * 掘金自动签到和抽奖脚本
 */
const axios = require('axios')
const { initInstance, getEnv } = require('./qlApi.js')
const notify = require('../sendNotify')


const aid = '2608'
const uuid = '7174652376522966568'

const fetchDataArr = [
    // {
    //     url:`https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky?aid=${aid}&uuid=${uuid}`,
    //     data:{
    //         lottery_history_id: '7020267603864059917',
    //     },
    //     title:'沾喜气'
    // },
    {
        url:`https://api.juejin.cn/growth_api/v1/check_in?aid=${aid}&uuid=${uuid}`,
        data:{
           
        },
        title:'签到'
    }
    ,{
        url:`https://api.juejin.cn/growth_api/v1/lottery/draw?aid=${aid}&uuid=${uuid}`,
        data:{
            
        },
        title:'抽奖'
    }
]

// 获取env里的jueJinCookie
async function getJueJinCookie(){
    let token = ''
     instance = await initInstance()
   
    if(instance){
        token = await getEnv(instance, 'jueJinCookie')
    }

    return {
        instance,
        token:token[0]
    }

}

async function play(){
    const {token} = await getJueJinCookie()
    const cookie = token.value
    console.log('获取cookie成功',cookie)
    Promise.all(fetchDataArr.map(item=>new Promise((resolve,reject)=>{
        axios.post(item.url,item.data,{
             headers: {
                Cookie:cookie,
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67',
            },
        }).then(res=>{
            console.log(item.title,res.data)
          resolve({
            title:item.title,
            data:res.data
        })}).catch(err=>{reject(err)})
    }))).then(res=>{
         notify.sendNotify('掘金自动签到', `掘金签到结果：
            ${res.map(item=>`${item.title}：${JSON.stringify(item.data)}
            `).join(' ')}
         `)
    })
}


play()