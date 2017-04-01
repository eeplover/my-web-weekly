# My Web Weekly

### 简介

基于NodeJs的一段爬虫程序，用于收集最新前端资讯。

![web weekly 邮件内内容截图](https://cloud.githubusercontent.com/assets/11499979/24581025/0aa20648-1746-11e7-9fc9-4f2d8b711abc.png)


### 功能

* 实时抓取指定页面数据。

* 数据处理汇总，生成邮件并发送给指定📮。


### 说明

* npm install 安装依赖包
* 需要在项目根目录新建private-info.json，用于配置邮件的发送。数据格式如下  

```json
{
  "user": "user.name@gmail.com",
  "pass": "xxx",
  "sender": "sender.name",
  "receivers": "receiver.name@gmail.com"
}

```

* 在 src/templates 下新增邮件模板和相应样式
* 可在 index.js 里头配置需要抓取的页面链接以及相应的处理抓取数据的方法
