const request = require('request')

function Spider(opts) {
  this.init(opts)
}

Spider.prototype.init = function(opts = {}) {
  let _opts = {
      tasks: [], // [{ url: string, digest: function }]
      digest: raw => raw
    }

  if (opts.tasks) {
    this.queue(opts.tasks)
    delete opts.tasks
  }
  this.options = Object.assign({}, _opts, opts)
  return this
}

Spider.prototype.queue = function(task) {
  task = Array.isArray(task) ? task : [task]
  for (let i = 0; i < task.length; i++) {
    this._pushQueue(task[i])
  }
  return this
}

Spider.prototype._pushQueue = function(task) {
  if (task) {
    if (typeof task !== 'object') {
      task = { url: task }
    }
    this.options.tasks.push(task)
  }
  return this
}

Spider.prototype._onHttpRequest = function(task) {
  const executor = (resolve, reject) => {
    request(task.url, (e, r, body) => {
      if (!e && r.statusCode === 200) {
        resolve(body)
      } else {
        reject(e)
      }
    })
  }
  return new Promise(executor)
}

Spider.prototype.go = function() {
  return Promise.all(this.options.tasks.map(task => this._onHttpRequest(task)))
    .then(dataset => {
      dataset = dataset.map((data, index) => {
        let opts = this.options,
          _digest = opts.tasks[index].digest
        data = opts.digest(data)
        data = _digest ? _digest(data) : data
        return data
      })
      return Promise.resolve(dataset)
    })
    .catch(reason => {
      console.error(reason)
    })
}

module.exports = Spider
