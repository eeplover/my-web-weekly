const fs = require('fs')
const path = require('path')
const mailer = require('nodemailer')

// 追踪重定向请求
const http = require('follow-redirects').http
const https = require('follow-redirects').https

const EmailTemplate = require('email-templates').EmailTemplate
const CONFIG = require('./config'),
  PRIVATE_INFO = require('./private-info.json'),
  mailOptions = {
    from: PRIVATE_INFO.sender,
    to: PRIVATE_INFO.receivers, // 邮件接收者，多个需用逗号分隔
    subject: 'Web Weekly',
    text: '',
    html: ''
  },
  transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: PRIVATE_INFO.user, // 用来发送邮件的邮箱
      pass: PRIVATE_INFO.pass  // 邮箱密码
    }
  }),
  templateDir = path.join(__dirname, 'src/templates'),
  eT = new EmailTemplate(templateDir)

console.log('Crawler start ...');
console.time('Request Cost')
Promise.all(CONFIG.targets.map(item => createAReqPromise(item)))
  .then(dataList => {
    console.timeEnd('Request Cost')
    console.time('Render Cost')
    let renderData = {}
    dataList.forEach((item, index) => {
      let target = CONFIG.targets[index]
      renderData[target.id] = target.filter(item)
    })
    fs.writeFile(`src/models/${CONFIG.date}.json`, JSON.stringify(renderData), err => {
      err ? console.error(err) : console.log(`The data was write to src/models/${CONFIG.date}.json`)
    })
    // 渲染数据并返回结果
    return eT.render(renderData)
  })
  .then(result => {
    mailOptions.html = result.html
    mailOptions.text = result.text

    // 发送邮件
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.error(err)
      console.timeEnd('Render Cost')
      console.log(`Massage %s send: %s`, info.messageId, info.response)
    })

    fs.writeFile(`email/${CONFIG.date}.html`, result.html, err => {
      err ? console.error(err) : console.log(`The data was write to email/${CONFIG.date}.html`)
    })
    // fs.writeFile(`email/${CONFIG.date}.txt`, result.txt, err => {
    //   err ? console.error(err) : console.log(`The data was write to email/${CONFIG.date}.txt`)
    // })
  })
  .catch(err => { console.error(err) })

function createAReqPromise(target = {}) {
  return new Promise((resolve, reject) => {
    const serve = target.url.indexOf('https') !== -1 ? https : http

    // @TODO 规避重定向页面
    serve.get(target.url, res => {
      let chunks = ''
      res.on('data', chunk => {
        chunks += chunk
      })
      res.on('end', () => {
        resolve({
          id: target.id,
          tag: target.tag,
          date: CONFIG.date,
          raw: chunks.toString()
        })
      })
    }).on('error', err => {
      reject(err.message)
    })
  })
}
