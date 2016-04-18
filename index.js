'use strict'

//you should import this before you import mqtt
let mqttConnection = require('mqtt-connection')
let co = require('co')

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

mqttConnection.prototype.onx = function (ev, gen, onDone, onError) {
  if(!gen || !(isGeneratorFunction(gen) || isGenerator(gen))) {
    if (!!onError && typeof onError === 'function') {
      onError(new Error('onx function should accept generator function'))
    }
    return
  }
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
