const fs = require('fs')
const path = require('path')
const Spider = require('./spider')
const pigeon = require('./pigeon')
const cheerio = require('cheerio')
const EmailTemplate = require('email-templates').EmailTemplate
const spider001 = new Spider(),
  now = new Date(),
  date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
  templateDir = path.join(__dirname, 'src/templates'),
  eT = new EmailTemplate(templateDir)

// 配置待抓取页面链接及相应的数据处理方法
let opts = [
    {
      url: 'http://nodeweekly.com/latest',
      digest: digest2
    },
    {
      url: 'http://frontendfocus.co/latest',
      digest: digest2
    },
    {
      url: 'http://javascriptweekly.com/latest',
      digest: digest2
    },
    {
      url: 'https://github.com/trending/javascript?since=weekly',
      digest: function(raw) {
        const $ = cheerio.load(raw),
          regExp = /<\s*(\S+)(\s[^>]*)?>([\s\S]*)<\s*\/\1\s*>/gi,
          $repoList = $('.repo-list > li')
        let food = [].slice.call($repoList, 0, 5)
        return food.map(repo => {
          return {
            desc: $(repo).find('.py-1 > p').html(),
            link: `https://github.com${$(repo).find('h3 > a').attr('href')}`,
            stars: $(repo).find('.mt-2 > .float-right').html(),
            title: $(repo).find('h3 > a').html().replace(regExp, '$3').replace(/\s/g, '')
          }
        })
      }
    }
  ]

function digest2(raw) {
  const $ = cheerio.load(raw),
    $table = $('.issue-html').find('.container').eq(1),
    $trs = $table.children()

  $trs.eq(1).children().children('p, ul').remove()
  $trs.eq(0).remove()
  $trs.eq(2).remove()
  return $trs.eq(1).toString()
}


console.log('Go!! my super spider ...')
console.time('Spider spend')
spider001.queue(opts).go()
  .then(data => {
    console.log('Haha ... Spider full!')
    console.timeEnd('Spider spend')
    console.log('Go!! my super pigeon ...')
    console.time('Pigeon spend')
    fs.writeFile(`src/models/${date}.json`, JSON.stringify(data), err => {
      if (err) console.error(err)
    })
    return eT.render({ data: data })
  })
  .then(ctn => {
    pigeon(ctn, (err, info) => {
      if (err) {
        console.log('Pigeon was shot')
        console.error(err)
      } else {
        console.log('Pigeon Success!')
        console.timeEnd('Pigeon spend')
      }
    })
    fs.writeFile(`email/${date}.html`, ctn.html, err => {
      if (err) console.error(err)
    })
  })
