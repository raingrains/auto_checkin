// 引入nodemailer
const nodeMailer = require('nodemailer')
const config = require('../config')
// 详细用法请参照nodemailer官方网站： https://nodemailer.com/usage/



exports.sendMail = (msg)=>{
// 创建SMTP客户端配置
const emailConfig = {
  // 如果是163邮箱则为： smtp.163.com
  host: 'smtp.qq.com', // 这代表的是QQ邮箱
  port: 465, // 端口 详情请参照邮箱的设置中 POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务的说明
  secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
  // 发件人的配置
  auth:{
    // 发件人的邮箱
    user: config.email_account,
    // 发件人的授权码，开通 POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务中的一个即可获取授权码
    pass: config.email_pass
  }
}
// 创建一个SMTP客户端配置对象
const transporter = nodeMailer.createTransport(emailConfig)
// 创建一个收件人对象
const mail = {
  // 发件人 邮箱  '昵称<发件人邮箱>' 注意： 发件人的邮箱必须和授权配置的邮箱相同，昵称可以随便填
  from: `auto_checkIn<${config.email_account}>`,
  // 主题
  subject: '自动签到',
  // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
  to: config.email_address,
  // 内容
  text: msg ,
  //这里可以添加html标签
  html: '',
  // 上传的附件：
  attachments:[
    // {filename:'index1.html',path:'./index.html'},
    // {filename:'image.png',path:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3489150134,2737835973&fm=26&gp=0.jpg'}
  ]
}
// 发送邮件
/**
 * @param { object } mail 收件人配置对象
 * @param { Function } callback 回调函数
 */
  transporter.sendMail(mail,(err,res)=>{
    if(err){
      return console.log(err);
    }
    transporter.close()
    console.log('mail send:' + res.response);
  })
}
