const cheerio = require('cheerio')
const now = new Date(),
  date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`

module.exports = {
  date: date,
  targets: [
    {
      tag: "github-trending-js-top-5",
      url: "https://github.com/trending/javascript?since=weekly",
      filter: function(rawData) {
        const $ = cheerio.load(rawData.content)
        const regExp = /<\s*(\S+)(\s[^>]*)?>([\s\S]*)<\s*\/\1\s*>/gi
        let $a = $('.d-inline-block h3 > a')
        rawData.content = [].slice.call($a).map(a => {
          return { title: $(a).html().replace(regExp, '$3').replace(/\s/g, ''), link: $(a).attr('href') }
        })
        return rawData
      }
    }
  ]
}
