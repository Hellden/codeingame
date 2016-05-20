var toPt = function (x) { return parseFloat(x.replace(',','.')); }

var LON = toPt(readline());
var LAT = toPt(readline());
var s = {lg: LON, lt: LAT};

var N = parseInt(readline());

var distance = function(da, db) {
  var x1 = (db.lt + da.lt)/2;
  var x = (db.lg - da.lg) * Math.cos(x1);
  var y = db.lt - da.lt;
  return Math.sqrt(x*x + y*y) * 6371;
};

var DEFIBS = [];
for (var i = 0; i < N; i++) {
  var parts = readline().split(';');
  DEFIBS[i] = {
    id: parts[0],
    name: parts[1],
    addr: parts[2],
    phone: parts[3],
    lg: toPt(parts[4]),
    lt: toPt(parts[5])
  };
}

var minDist = null, neartsDef = null;
for(var i=0;i<DEFIBS.length;i++){
  var d = distance(DEFIBS[i], s);
  if (null == minDist || d < minDist) {
    minDist = d;
    neartsDef = i;
  }
}

print(DEFIBS[neartsDef].name);
