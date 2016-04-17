'use strict'

//you should import this before you import mqtt
let mqttConnection = require('mqtt-connection')
let co = require('co')

mqttConnection.prototype.onx = function (ev, gen, onDone, onError) {
  this.on(ev, () => {
    co(gen).then((data) => {
      if (!!onDone && typeof onDone === 'function')
        onDone(data)
    }).catch((err) => {
      if (!!onError && typeof onError === 'function')
        onError(err)
    })
  })
}
