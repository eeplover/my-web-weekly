const cheerio = require('cheerio')
const now = new Date(),
  date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`

module.exports = {
  date: date,
  targets: [
    {
      id: 'github_trending',
      tag: 'Github Trending Js-Top-5',
      url: 'https://github.com/trending/javascript?since=weekly',
      filter: function(data) {
        const $ = cheerio.load(data.raw),
          regExp = /<\s*(\S+)(\s[^>]*)?>([\s\S]*)<\s*\/\1\s*>/gi,
          $repoList = $('.repo-list > li')

        data.list = [].slice.call($repoList, 0, 5).map(repo => {
          const $repo = $(repo)
          return {
            title: $repo.find('h3 > a').html().replace(regExp, '$3').replace(/\s/g, ''),
            desc: $repo.find('.py-1 > p').html(),
            link: `https://github.com${$repo.find('h3 > a').attr('href')}`,
            stars: $repo.find('.mt-2 > .float-right').html()
          }
        })
        return data
      }
    },
    {
      id: 'javascript_weekly',
      tag: 'JavaScript Weekly',
      url: 'http://javascriptweekly.com/latest',
      filter: function(data) {
        const $ = cheerio.load(data.raw),
          $table = $('.issue-html').find('.container').eq(1),
          $trs = $table.children()

        $trs.eq(1).children().children('p, ul').remove()
        $trs.eq(0).remove()
        $trs.eq(2).remove()
        data.list = $trs.eq(1).toString()
        return data
      }
    },
    {
      id: 'fe_focus',
      tag: 'FrontEnd Focus',
      url: 'http://frontendfocus.co/latest',
      filter: function(data) {
        const $ = cheerio.load(data.raw),
          $table = $('.issue-html').find('.container').eq(1),
          $trs = $table.children()

        $trs.eq(1).children().children('p, ul').remove()
        $trs.eq(0).remove()
        $trs.eq(2).remove()
        data.list = $trs.eq(1).toString()
        return data
      }
    },
    {
      id: 'node_weekly',
      tag: 'Node Weekly',
      url: 'http://nodeweekly.com/latest',
      filter: function(data) {
        const $ = cheerio.load(data.raw),
          $table = $('.issue-html').find('.container').eq(1),
          $trs = $table.children()

        $trs.eq(1).children().children('p, ul').remove()
        $trs.eq(0).remove()
        $trs.eq(2).remove()
        data.list = $trs.eq(1).toString()
        return data
      }
    }
  ]
}
