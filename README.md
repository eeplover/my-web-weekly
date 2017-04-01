# My Web Weekly

### 简介

基于NodeJs的一段爬虫程序，用于收集最新前端资讯。


![screencapture-file-users-eplover-note-my-web-weekly-email-2017-4-1-html-1491017146395](https://cloud.githubusercontent.com/assets/11499979/24575148/83dc45b2-16d0-11e7-8ed9-c5d6c336d146.png)

### 功能

* 实时抓取 Weekly 页面数据。

* 数据处理汇总，生成邮件并发送给指定📮。


### 说明

* npm install 安装依赖包
* 需要在项目根目录新建private-info.json，用于配置邮件的发送。数据格式如下  

```json
{
  "user": "your-email",
  "pass": "password-of-your-email",
  "sender": "sender's-email",
  "receivers": "receiver's-email"
}

```
* 在 config.js 里头设置需要扒取的页面，与数据过滤方法（filter）
* 在 src/templates 下新增邮件模板和相应样式
