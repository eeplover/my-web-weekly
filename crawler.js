const fs = require('fs')
const http = require('http')
const https = require('https')
const juice = require('juice')
const mailer = require('nodemailer')

const CONFIG = require('./config'),
  PRIVATE_INFO = require('./private-info.json'),

  // setup email data width unicode symbols
  mailOptions = {
    from: PRIVATE_INFO.sender,
    to: PRIVATE_INFO.receivers, // list of receivers
    subject: 'Web Weekly',
    text: '',
    html: ''
  },

  // create reusable transporter object using the default SMTP transport
  transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: PRIVATE_INFO.user,
      pass: PRIVATE_INFO.pass
    }
  }),
  templateStr = juice(fs.readFileSync(`${__dirname}/src/views/index.template.html`, 'utf-8')),
  PORT = 8080

Promise.all(CONFIG.targets.map(item => createAReqPromise(item)))
  .then(dataList => {
    dataList.map((data, index) => CONFIG.targets[index].filter(data))
    // 渲染数据
    mailOptions.html = render(templateStr, { dataList: dataList })
    // 发送邮件
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.error(err)
      console.log(`Massage %s send: %s`, info.messageId, info.response)
    })
    fs.writeFileSync(`src/models/${CONFIG.date}.json`, JSON.stringify(dataList))
    console.log(`The data was append to ${CONFIG.date}.json`)
  }).catch(err => { console.error(err) })

function createAReqPromise(target = {}) {
  return new Promise((resolve, reject) => {
    https.get(target.url, res => {
      let rawData = ''
      res.on('data', chunk => {
        rawData += chunk
      })
      res.on('end', () => {
        resolve({
          tag: target.tag,
          content: rawData.toString()
        })
      })
    }).on('error', err => {
      reject(err.message)
    })
  })
}

// 模板引擎
function render(str, data) {
  const fn = new Function("obj",
    "var p=[],print=function(){p.push.apply(p,arguments);};" +
    "with(obj){p.push('" +
    str
      .replace(/[\r\t\n]/g, " ")
      .split("<%").join("\t")
      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)%>/g, "',$1,'")
      .split("\t").join("');")
      .split("%>").join("p.push('")
      .split("\r").join("\\'")
    + "');}return p.join('');")
  return data ? fn( data ) : fn
}
