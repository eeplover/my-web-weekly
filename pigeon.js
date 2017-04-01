const mailer = require('nodemailer')
const PRIVATE_INFO = require('./private-info.json')

let mailOptions = {
    from: PRIVATE_INFO.sender,
    to: PRIVATE_INFO.receivers, // 邮件接收者，多个需用逗号分隔
    subject: 'Web Weekly'
  },
  transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: PRIVATE_INFO.user, // 用来发送邮件的邮箱
      pass: PRIVATE_INFO.pass  // 邮箱密码
    }
  })

// 发送邮件
function pigeon(content = {}, cbk) {
  mailOptions.text = content.text
  mailOptions.html = content.html
  transporter.sendMail(mailOptions, cbk)
}

module.exports = pigeon
