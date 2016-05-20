
var N = parseInt(readline());

var coords = [];
for (var i = 0; i < N; i++) {
  var inputs = readline().split(' ');
  var X = parseInt(inputs[0]);
  var Y = parseInt(inputs[1]);
  coords.push([X,Y]);
}

var positionFinder = function (coords, fn) {
  if (!coords.length) { return null; }
  if (coords.length == 1) { return coords.slice().shift(); }
  return coords.slice().sort(fn).shift();
};
var lefter = function (coords) {
  return positionFinder(coords, function (c1, c2) { return c1[0] - c2[0]; });
};
var upper = function (coords) {
  return positionFinder(coords, function (c1, c2) { return c1[1] - c2[1]; });
};
var righter = function (coords) {
  return positionFinder(coords, function (c1, c2) { return c2[0] - c1[0]; });
};
var downer = function (coords) {
  return positionFinder(coords, function (c1, c2) { return c2[1] - c1[1]; });
};

var minLg = function(coords){
  if (coords.length == 1) { return 0; }
  var L = lefter(coords);
  var U = upper(coords);
  var R = righter(coords);
  var D = downer(coords);
  printErr('left='+L);
  printErr('up='+U);
  printErr('right='+R);
  printErr('down='+D);

  var lgForHeight = function (h) {
    var lg = R[0] - L[0];
    for (var i=0; i<coords.length; i++) {
      if (lg >= minLg) { break; }
      lg += Math.abs(coords[i][1] - h);
    }
    return lg;
  };

  var orderedByH = coords.slice().sort(function(c1, c2){return c1[1] - c2[1];});
  var middleHIndex = Math.round((coords.length-1) / 2);
  var middleH = orderedByH[middleHIndex][1];
  printErr('middleH='+middleH);

  return lgForHeight(middleH);

  /*var minLg = Math.pow(2, 30) + 1;
   for (var h=U[1]; h<=D[1]; h++) {
   var lg = lgForHeight(h);
   if (lg < minLg) { minLg = lg; }
   }

   return minLg;*/
};

print(minLg(coords));
