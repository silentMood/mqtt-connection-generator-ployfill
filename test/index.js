'use strict'

//lib deps
let chai = require('chai')
chai.should()
let sinon = require('sinon')
let sinonChai = require('sinon-chai')
chai.should()
chai.use(sinonChai)

//module deps
let mqttConnection = require('mqtt-connection')
require('../index')

let testStream = require('mqtt-connection/test/util').testStream

function getPromise(val, err) {
  return new Promise(function (resolve, reject) {
    if (err) reject(err)
    else resolve(val)
  });
}

describe('connect the mqtt-connection and the co', () => {
	let mqttConn

	beforeEach(() => {
		mqttConn = new mqttConnection(testStream())
	})

  it('mqttConn should has a method name is onx', () => {
    mqttConn.onx.should.be.a('function')
  })

  it('mqttConn should accept a generator with the correct behavior #success', (done) => {
  	let a, b, c
    mqttConn.onx('heheda', function *() {
    	a = yield getPromise(1)
    	b = yield getPromise(2)
    	c = yield getPromise(3)
    }, () => {
    	//done
    	a.should.equal(1)
    	b.should.equal(2)
    	c.should.equal(3)

    	done()
    })

    mqttConn.emit('heheda')
  })

  it('mqttConn should accept a generator with the correct behavior #error', (done) => {
  	let a, b, c
    mqttConn.onx('heheda', function *() {
    	a = yield getPromise(1)
    	b = yield getPromise(2)
    	c = yield getPromise(3)

    	throw new Error('heheda')
    }, () => {},
    (err) => {
    	err.message.should.equal('heheda')
    	done()
    })

    mqttConn.emit('heheda')
  })

})