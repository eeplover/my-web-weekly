const http = require('http')
const cheerio = require('cheerio')

var $ = cheerio.load('<div><p class="p1"></p><p class="p2"></p></div>')
console.log($('div').find('.p1,.p2').remove().toString());

http.get('http://javascriptweekly.com/latest', res => {
  let chunks = ''
  res.on('data', chunk => {
    chunks += chunk
  })
  res.on('end', () => {
    console.log(chunks.toString());
  })
})
