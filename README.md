# My Web Weekly

### 简介

基于NodeJs的一段爬虫程序，用于收集最新前端资讯。

![Web Weekly邮件内容截图](https://cloud.githubusercontent.com/assets/11499979/24580179/38a2daa0-1736-11e7-9a21-2a2baa82d221.png)

### 功能

* 实时抓取 Weekly 页面数据。

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
