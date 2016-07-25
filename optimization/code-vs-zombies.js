'use strict';
const DEBUG = true;
//------------------------------------------------------------------------------
const DECISIONS = [ 'NOT_MOVE', 'SURVIVE', 'PROTECT', 'KILL' ];
//------------------------------------------------------------------------------
const AREA_WIDTH = 16 * 1000;
const AREA_HEIGHT = 9 * 1000;
//------------------------------------------------------------------------------
const ASH_MOVE = 1 * 1000;
const ASH_FIRE_RANGE = 2 * 1000;
//------------------------------------------------------------------------------
const ZOMBIE_MOVE = 400;
const ZOMBIE_RANGE = ZOMBIE_MOVE;
//------------------------------------------------------------------------------
const toString = function () {
  const args = Object.keys(arguments).map(i => arguments[i])
    , nbArgs = args.length;
  for (var i = 0; i < nbArgs; i++) {
    if (typeof args[i] === 'object')
      args[i] = JSON.stringify(args[i], null, 2);
    else
      args[i] = String(args[i]);
  }
  return args.join(' ');
};
const debugLog = function () {
  if (!DEBUG) return;
  printErr('debug: ' + toString.apply(null, arguments));
};
//------------------------------------------------------------------------------
const fibonacci = function (max) {
  const acc = arguments[1] || [];
  const value = arguments[2] || 0;
  if (acc.length === max)
    return acc;
  const previousValue = acc.length ? acc[acc.length - 1] : 1;
  acc.push(previousValue + value);
  return fibonacci(max, acc, previousValue);
};
//------------------------------------------------------------------------------
const Position = function (x, y) { 
  this.x = x;
  this.y =y;
};
//------------------------------------------------------------------------------
Position.prototype.distanceTo = function (position) {
  const deltaX = Math.abs(position.x - this.x);
  const deltaY = Math.abs(position.y - this.y);
  return Math.ceil(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
};
//------------------------------------------------------------------------------
Position.prototype.nbStepsTo = function (position, move) {
  const distanceTo = this.distanceTo(position);
  return Math.ceil(distanceTo / move);
};
//------------------------------------------------------------------------------
const Humain = function (id, position) {
  this.id = id;
  this.position = position;
};
//------------------------------------------------------------------------------
const Zombie = function (id, position, nextPosition) {
  this.id = id;
  this.position = position;
  this.nextPosition = nextPosition;
};
// Frame------------------------------------------------------------------------
const Frame = function(args) {
  this.parentIndex = args.parentIndex;
  this.ashPosition = args.ashPosition;
  this.humains = args.humains;
  this.zombies = args.zombies;
  this.nbHumainsLeft = this.humains.length;
  this.nbZombiesLeft = this.zombies.length;
  this.nbHumainsDead = this.calculateNbHumainsDead();
  this.nbZombiesDead = this.calculateNbZombiesDead();
  this.relativeScore = this.calculateRelativeScore();
  this.score = args.parentScore + this.relativeScore;
  this.decision = null;
};
Frame.prototype.takeDecision = function (save) {
  var decision = null; //TODO
  if (save)
    this.decision = decision;
  return decision;
};
Frame.prototype.calculateNbHumainsDead = function () {
  return !initialFrame ? 0 : initialFrame.nbHumainsLeft - this.nbHumainsLeft;
};
Frame.prototype.calculateNbZombiesDead = function () {
  return !initialFrame ? 0 : initialFrame.nbZombiesLeft - this.nbZombiesLeft;
};
Frame.prototype.calculateRelativeScore = function () {
  const baseScore = Math.sqrt(this.nbHumainsLeft) * 10;
  const fib = fibonacci(this.nbZombiesDead + 2);
  let score = 0
    , i = 1;
  for (i; i <= this.nbZombiesDead; i++) {
    const zombieScore = baseScore * fib[i + 2];
    score += zombieScore;
  }
  return score;
};
Frame.prototype.zombiesPositionsFrom = function (curPosition) {
  const zombiesDistances = [];
  let i = 0;
  for (i; i < this.nbZombiesLeft; i++) {
    const zombieDistance = this.zombies[i].position.distanceTo(curPosition);
    zombiesDistances.push(zombieDistance);
  }
  return zombiesDistances;
};
Frame.prototype.distancesInRange = function (distances, range) {
  const inRange = []
    , nbDistances = distances.length;
  let i = 0;
  for (i; i < nbDistances; i++) {
    if (distances[i] > range) continue;
    inRange.push(distances[i]);
  }
  return inRange;
};
Frame.prototype.ashInDanger = function (range) {
  const zombiesDistances = this.zombiesPositionsFrom(this.ashPosition);
  const dangerousZombies = this.distancesInRange(zombiesDistances, range);
  debugLog('ashInDanger', dangerousZombies);
  return dangerousZombies.length > 0;
};
Frame.prototype.humainInDanger = function (humain, range) {
  const situation = {
    canBeSaved: true,
    stepsBeforeDeath: -1
  };
  let i = 0;
  for (i; i < this.nbZombiesLeft; i++) {
    const zombie = this.zombies[i];
    if (zombie.position.distanceTo(humain.position) > range) continue;
    const zombieStepsToHumain = zombie.position.nbStepsTo(humain.position, ZOMBIE_MOVE);
    const ashStepsToZombie = this.ashPosition.nbStepsTo(zombie, ASH_MOVE);
    situation.stepsBeforeDeath = zombieStepsToHumain - ashStepsToZombie;
    if (situation.stepsBeforeDeath <= 0) {
      debugLog('humain', humain.id, 'can not be saved!');
      situation.canBeSaved = false;
      break;
    }
  }
  debugLog('humainSituation', humain.id, situation);
  return situation;
};
Frame.prototype.humainsInDanger = function (range) {
  const situations = [];
  let i = 0;
  for (i; i < this.nbHumainsLeft; i++) {
    const humain = this.humains[i];
    situations.push(this.humainInDanger(humain, range));
  }
  const inDanger = situations.filter(situation => situation.canBeSaved);
  return inDanger;
};
Frame.prototype.analyze = function () {
  const situation = {};
  situation.ashInDanger = this.ashInDanger(ZOMBIE_RANGE);
  situation.humainsVsZombies = this.humainsInDanger(ZOMBIE_RANGE * 5);
  debugLog('situation', situation);
  return situation;
};
Frame.prototype.compute = function () {
  const frames = [ this ];
  const situation = this.analyze();
  //var childFrames = childFrame.compute();
  //frames = frames.concat(childFrames);
  return frames;
};
// InputArgs -------------------------------------------------------------------
var InputArgs = function () {
  this.ashPosition = null;
  this.nbHumains = 0;
  this.nbZombies = 0;
  this.humains = [];
  this.zombies = [];
  this.getAshPosition();
  this.getHumains();
  this.getZombies();
};
InputArgs.prototype.getAshPosition = function () {
  const inputs = readline().split(' ');
  const ashX = Number(inputs[0]);
  const ashY = Number(inputs[1]);
  this.ashPosition = new Position(ashX, ashY);
};
InputArgs.prototype.getHumains = function () {
  this.nbHumains = Number(readline());
  let i = 0;
  for (i; i < this.nbHumains; i++) {
    const inputs = readline().split(' ');
    const id = Number(inputs[0]);
    const x = Number(inputs[1]);
    const y = Number(inputs[2]);
    const humainPosition = new Position(x, y);
    const humain = new Humain(id, humainPosition);
    this.humains.push(humain);
  }
};
InputArgs.prototype.getZombies = function () {
  this.nbZombies = Number(readline());
  let i = 0;
  for (i; i < this.nbZombies; i++) {
    const inputs = readline().split(' ');
    const id = Number(inputs[0]);
    const x = Number(inputs[1]);
    const y = Number(inputs[2]);
    const nextX = Number(inputs[3]);
    const nextY = Number(inputs[4]);
    const position = new Position(x, y);
    const nextPosition = new Position(nextX, nextY);
    const zombie = new Zombie(id, position, nextPosition);
    this.zombies.push(zombie);
  }
};
//------------------------------------------------------------------------------
const createInitialFrame = function (args) {
  const frameArgs = {};
  frameArgs.parentIndex = -1;
  frameArgs.ashPosition = args.ashPosition;
  frameArgs.humains = args.humains;
  frameArgs.zombies = args.zombies;
  return new Frame(frameArgs);
};
//------------------------------------------------------------------------------
const extractBestPositionsPath = function (frames) {
  const positions = [];
  return positions;
};
//------------------------------------------------------------------------------
let firstIteration = true
  , initialFrame = null
  , ashPositions = null;
while (true) {

  if (firstIteration) {
    firstIteration = false;
    initialFrame = createInitialFrame(new InputArgs);
    const frames = initialFrame.compute();
    ashPositions = extractBestPositionsPath(frames);
  }

  //var nextAshPosition = ashPositions.shift();
  //print(nextAshPosition.toString());
  print('0 0');
}
