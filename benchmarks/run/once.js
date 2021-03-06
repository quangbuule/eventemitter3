'use strict';

/**
 * Benchmark related modules.
 */
var benchmark = require('benchmark');

/**
 * Logger.
 */
var logger = new(require('devnull'))({ timestamp: false, namespacing: 0 });

/**
 * Preparation code.
 */
var EventEmitter2 = require('eventemitter2').EventEmitter2
  , EventEmitter3 = require('eventemitter3').EventEmitter
  , EventEmitter1 = require('events').EventEmitter
  , Master = require('../../').EventEmitter
  , Drip = require('drip').EventEmitter
  , EE = require('event-emitter')
  , FE = require('fastemitter');

function handle() {
  if (arguments.length > 100) console.log('damn');
}

/**
 * Instances.
 */
var ee2 = new EventEmitter2()
  , ee3 = new EventEmitter3()
  , ee1 = new EventEmitter1()
  , master = new Master()
  , drip = new Drip()
  , fe = new FE()
  , ee = EE({});

(
  new benchmark.Suite()
).add('EventEmitter 1', function test1() {
  ee1.once('foo', handle).emit('foo');
}).add('EventEmitter 2', function test2() {
  ee2.once('foo', handle).emit('foo');
}).add('EventEmitter 3', function test2() {
  ee3.once('foo', handle).emit('foo');
}).add('EventEmitter 3 (master)', function test2() {
  master.once('foo', handle).emit('foo');
}).add('Drip', function test2() {
  drip.once('foo', handle).emit('foo');
}).add('fastemitter', function test2() {
  fe.once('foo', handle).emit('foo');
}).add('event-emitter', function test2() {
  ee.once('foo', handle).emit('foo');
}).on('cycle', function cycle(e) {
  var details = e.target;

  logger.log('Finished benchmarking: "%s"', details.name);
  logger.metric('Count (%d), Cycles (%d), Elapsed (%d), Hz (%d)'
    , details.count
    , details.cycles
    , details.times.elapsed
    , details.hz
  );
}).on('complete', function completed() {
  logger.info('Benchmark: "%s" is the fastest.'
    , this.filter('fastest').pluck('name')
  );
}).run();
