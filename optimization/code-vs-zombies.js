var DEBUG = true;
//------------------------------------------------------------------------------
var DECISIONS = ['NOT_MOVE', 'SURVIVE', 'PROTECT', 'KILL'];
//------------------------------------------------------------------------------
var AREA_WIDTH = 16 * 1000;
var AREA_HEIGHT = 9 * 1000;
//------------------------------------------------------------------------------
var ASH_MOVE = 1 * 1000;
var ASH_FIRE_RANGE = 2 * 1000;
//------------------------------------------------------------------------------
var ZOMBIE_MOVE = ZOMBIE_RANGE = 400;
//------------------------------------------------------------------------------
var toString = function () {
  var args = Object.keys(arguments).map(i => arguments[i])
    , nbArgs = args.length;
  for (var i = 0; i < nbArgs; i++) {
    if (typeof args[i] === 'object')
      args[i] = JSON.stringify(args[i], null, 2);
    else
      args[i] = String(args[i]);
  }
  return args.join(' ');
};
//------------------------------------------------------------------------------
var debugLog = function () {
  if (DEBUG) printErr('debug: ' + toString.apply(null, arguments));
};
//------------------------------------------------------------------------------
var fibonacci = function (max) {
  var acc = arguments[1] || [];
  var value = arguments[2] || 0;
  if (acc.length === max) return acc;
  var previousValue = acc.length ? acc[acc.length - 1] : 1;
  acc.push(previousValue + value);
  return fibonacci(max, acc, previousValue);
};
//------------------------------------------------------------------------------
var Position = function(x, y) { this.x = x; this.y =y; };
//------------------------------------------------------------------------------
Position.prototype.distanceTo = function (position) {
  var deltaX = Math.abs(position.x - this.x);
  var deltaY = Math.abs(position.y - this.y);
  return Math.ceil(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
};
//------------------------------------------------------------------------------
Position.prototype.nbStepsTo = function (position, move) {
  var distanceTo = this.distanceTo(position);
  //TODO check that
  return Math.ceil(distanceTo / move);
};
//------------------------------------------------------------------------------
var Humain = function (id, position) {
  this.id = id;
  this.position = position;
};
//------------------------------------------------------------------------------
var Zombie = function (id, position, nextPosition) {
  this.id = id;
  this.position = position;
  this.nextPosition = nextPosition;
};
// Frame------------------------------------------------------------------------
var Frame = function(args) {
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
  if (save) this.decision = decision;
  return decision;
};
Frame.prototype.calculateNbHumainsDead = function () {
  if (!initialFrame) return 0;
  return initialFrame.nbHumainsLeft - this.nbHumainsLeft;
};
Frame.prototype.calculateNbZombiesDead = function () {
  if (!initialFrame) return 0;
  return initialFrame.nbZombiesLeft - this.nbZombiesLeft;
};
Frame.prototype.calculateRelativeScore = function () {
  var score = 0;
  var baseScore = Math.sqrt(this.nbHumainsLeft) * 10;
  var fib = fibonacci(this.nbZombiesDead + 2);
  for (var i = 1; i <= this.nbZombiesDead; i++) {
    var zombieScore = baseScore * fib[i + 2];
    score += zombieScore;
  }
  return score;
};
Frame.prototype.zombiesPositionsFrom = function (curPosition) {
  var zombiesDistances = [];
  for (var i = 0; i < this.nbZombiesLeft; i++) {
    var zombieDistance = this.zombies[i].position.distanceTo(curPosition);
    zombiesDistances.push(zombieDistance);
  }
  return zombiesDistances;
};
Frame.prototype.distancesInRange = function (distances, range) {
  var inRange = [], nbDistances = distances.length;
  for (var i = 0; i < nbDistances; i++) {
    if (distances[i] <= range)
      inRange.push(distances[i]);
  }
  return distances;
};
Frame.prototype.ashInDanger = function (range) {
  var zombiesDistances = this.zombiesPositionsFrom(this.ashPosition);
  var dangerousZombies = this.distancesInRange(zombiesDistances, range);
  //TODO could be improved
  return dangerousZombies.length > 0;
};
Frame.prototype.humainInDanger = function (humain, range) {
  var zombiesDistances = this.zombiesPositionsFrom(humain.position);
  var dangerousZombies = this.distancesInRange(zombiesDistances, range);
  debugLog(zombiesDistances);
  var nbZombies = dangerousZombies.length;
  var humainSituation = {
    canBeSaved: true,
    stepsBeforeDeath: 0
  };
  for (var i = 0; i < nbZombies; i++) {
    var zombie = dangerousZombies[i];
    var zombieStepsToHumain = zombie.nbStepsTo(humain.position, ZOMBIE_MOVE);
    var ashStepsToZombie = this.ashPosition.nbStepsTo(zombie, ASH_MOVE);
    humainSituation.stepsBeforeDeath = zombieStepsToHumain - ashStepsToZombie;
    if (humainSituation.stepsBeforeDeath <= 0) {
      debugLog('humain', humain.id, 'can not be saved');
      humainSituation.canBeSaved = false;
      break;
    }
  }
  //TODO improve
  return humainSituation;
};
Frame.prototype.humainsInDanger = function (range) {
  var humainsSituations = [];
  for (var i = 0; i < this.nbHumainsLeft; i++) {
    var humain = this.humains[i];
    humainsSituations.push(this.humainInDanger(humain, range));
  }
  //TODO
  return {};
};
Frame.prototype.analyze = function () {
  var situation = {};
  situation.ashInDanger = this.ashInDanger(ZOMBIE_RANGE);
  situation.humainsVsZombies = this.humainsInDanger(ZOMBIE_RANGE * 5);
  return situation;
};
Frame.prototype.compute = function () {
  var frames = [this];
  var situation = this.analyze();
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
  var inputs = readline().split(' ');
  var ashX = Number(inputs[0]);
  var ashY = Number(inputs[1]);
  this.ashPosition = new Position(ashX, ashY);
};
InputArgs.prototype.getHumains = function () {
  this.nbHumains = Number(readline());
  for (var i = 0; i < this.nbHumains; i++) {
    var inputs = readline().split(' ');
    var id = Number(inputs[0]);
    var x = Number(inputs[1]);
    var y = Number(inputs[2]);
    var humainPosition = new Position(x, y);
    var humain = new Humain(id, humainPosition);
    this.humains.push(humain);
  }
};
InputArgs.prototype.getZombies = function () {
  this.nbZombies = Number(readline());
  for (var i = 0; i < this.nbZombies; i++) {
    var inputs = readline().split(' ');
    var id = Number(inputs[0]);
    var x = Number(inputs[1]);
    var y = Number(inputs[2]);
    var nextX = Number(inputs[3]);
    var nextY = Number(inputs[4]);
    var position = new Position(x, y);
    var nextPosition = new Position(nextX, nextY);
    var zombie = new Zombie(id, position, nextPosition);
    this.zombies.push(zombie);
  }
};
//------------------------------------------------------------------------------
var createInitialFrame = function (args) {
  var frameArgs = {};
  frameArgs.parentIndex = -1;
  frameArgs.ashPosition = args.ashPosition;
  frameArgs.humains = args.humains;
  frameArgs.zombies = args.zombies;
  return new Frame(frameArgs);
};
//------------------------------------------------------------------------------
var extractBestPositionsPath = function (frames) {
  var positions = [];
  return positions;
};
//------------------------------------------------------------------------------
var firstIteration = true;
var initialFrame = null;
var ashPositions = null;
while (true) {

  if (firstIteration) {
    firstIteration = false;
    initialFrame = createInitialFrame(new InputArgs());
    var frames = initialFrame.compute();
    ashPositions = extractBestPositionsPath(frames);
  }

  //var nextAshPosition = ashPositions.shift();
  //print(nextAshPosition.toString());
  print('0 0');
}
