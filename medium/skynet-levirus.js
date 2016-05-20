/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var inputs = readline().split(' ');
var N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
var L = parseInt(inputs[1]); // the number of links
var E = parseInt(inputs[2]); // the number of exit gateways

// Arc stuf *****************************************************************

/*var Arc = function (id, from, to, pound) {
 this.name = 'arc-'+id;
 this.id = parseInt(id, 10);
 this.from = parseInt(from, 10);
 this.to = parseInt(to, 10);
 this.marked = false;
 };
 Arc.prototype.toString = function () { return '('+this.name+' ['+this.from+'->'+this.to+'])'; };*/

// Path stuff *****************************************************************

/*var Path = function () { this.arcs = []; };
 Path.prototype.addArc = function (arc) { this.arcs.push(arc); };
 Path.prototype.length = function () { return this.arcs.length; };
 Path.prototype.clone = function () {
 var clone = new Path();
 for (var i=0; i<this.arcs.length; i++) { clone.addArc(this.arcs[i]); }
 return clone;
 };
 Path.prototype.toString = function () {
 var arcStr = [];
 for (var i=0; i<this.arcs.length; i++) { arcStr.push(this.arcs[i].toString()); }
 return '[Path: ' + arcStr.join(' -> ') + ']';
 };*/

// Graph stuff *****************************************************************

/*var Graph = function (links, gateways) {
 var self = this;
 this.arcs = [];
 this.gateways = gateways;
 var initArcs = function () {
 for (var i=0; i<links.length; i++) {
 var arc = new Arc(i, links[i][0], links[i][1]);
 self.arcs.push(arc);
 }
 };
 initArcs();
 };
 Graph.prototype.resetArcsMarks = function (from, to) {
 this.arcs.forEach(function(arc) { arc.marked = false; });
 };
 Graph.prototype.getArc = function (from, to) {
 return this.arcs.filter(function(arc) {
 return arc.from === from && arc.to === to;
 })[0];
 };
 Graph.prototype.removeArc = function (arc) {
 this.arcs = this.arcs.filter(function(a) {
 return a.id !== arc.id;
 });
 };
 Graph.prototype.findNearestArcs = function (p) {
 var nearest = [];
 for (var i=0; i<this.arcs.length; i++) {
 var isNear = p === this.arcs[i].from || p === this.arcs[i].to;
 if (isNear && !this.arcs[i].marked) {
 this.arcs[i].marked = true;
 nearest.push(this.arcs[i]);
 }
 }
 //printErr('nearest\n', nearest.join('\n'));
 return nearest;
 };
 Graph.prototype.findPaths = function (from, to, paths, path) {
 path = path || new Path();
 for (var i=0; i<path.arcs; i++) {
 for (var j=0; j<path.arcs; j++) {
 if (path.arcs[i].to === path.arcs[j].from) { return; }
 }
 }
 if (from === to) {
 //printErr('from==to', path.length(), path.toString());
 if (path.length()) { paths.push(path); }
 return;
 }
 var nearestArcs = this.findNearestArcs(from);
 //printErr('nearest\n', from, nearestArcs.join('\n'));

 for (var i=0; i<nearestArcs.length; i++) {
 var childPath = path.clone();
 childPath.addArc(nearestArcs[i]);
 //printErr('add arc', nearestArcs[i].toString());
 this.findPaths(nearestArcs[i].to, to, paths, childPath);
 }
 };*/

// Game simulation starts here *****************************************************************
//  ********************************************************************************************

// entry variables
var links = [], gateways = [];
for (var i = 0; i < L; i++) {
  var inputs = readline().split(' ');
  links[i] = [parseInt(inputs[0]), parseInt(inputs[1])];
  //printErr(links[i][0]+'->'+links[i][1]);
}
for (var i = 0; i < E; i++) { gateways[i] = parseInt(readline()); }
//printErr(gateways.join(' '));

var nearestPoints = function (si) {
  var pts = [];
  for(var i=0; i<links.length;i++) {
    if (!links[i]) { continue; }
    var f = links[i][0], t = links[i][1];
    if (!(f == si || t == si)) { continue; }
    var nearGtw = (gateways.indexOf(links[i][0])
      + gateways.indexOf(links[i][1])) > -2;
    links[i].push(nearGtw);
    //printErr('near',f,t, nearGtw);
    pts.push(links[i]);
  }
  return pts;
};

/*var linkId = function (from, to) {
 if (from > to) {
 var tmp = from;
 from = to;
 to = tmp;
 }
 from = String(from);
 to = String(to);
 return from + to;
 };*/

var pointToCut = function (pts) {
  var len = pts.length;
  for(var i=0; i<len; i++) {
    var nearGtw = pts[i].pop();
    //printErr(pts[i][0],pts[i][1], 'nearGtw', nearGtw);
    if (nearGtw) {
      //var lid = linkId(pts[i][0], pts[i][1]);
      //cutted.push(lid);
      //printErr('cutted', lid);
      return pts[i];
    }
  }

  var ri = null;

  var neartGtw = function (gtwPts) {
    printErr('gtwPts.length', gtwPts.length);
    if (!gtwPts.length) { return null; }
    var n = [];
    for (var j=0; j<gtwPts.length; j++) {
      printErr('gtwPts[i]', gtwPts[i]);
      n[j] = 0;
      if (!gtwPts[j]) { continue; }
      for (var k=0; k<gateways.length; k++) {
        if (!gateways[k]) { continue; }
        if (gtwPts[j][0]==gateways[k] || gtwPts[j][1]==gateways[k]) {
          n[j]++;
        }
      }

    }
    var max = n.sort(function(a, b){return b-a;})[0];
    printErr('neartGtw max',n.join('-'),n.indexOf(max),max);
    return [max, n.indexOf(max)];
  };

  var maximums = [];
  for(var i=0; i<pts.length;i++) {

    var maxt = neartGtw(nearestPoints(pts[i][0]));
    if (maxt) { maximums.push(maxt); }

    //var maxf = neartGtw(nearestPoints(pts[i][1]));

    //if (maxt) printErr('maxt.length',maxt.length);
    //if (maxf) printErr('maxf.length',maxf.length);

    //if (maxt && maxf) { max = maxt[0]>maxf[0]?maxt[1]:maxf[1]; }
    //else if (maxt) { max = maxt; }
    //else max = maxf;
  }

  for(var i=0; i<maximums.length; i++) {
    printErr('maximums',i,maximums[i]);
  }

  return pts[0];
};

// our awesome graph
//var g = new Graph(links, gateways);

while (true) {
  var si = parseInt(readline(), 10);
  var pts = nearestPoints(si);
  //printErr(pts.join(' '));
  var ptc = pointToCut(pts);
  //printErr(ptc);

  print(ptc.join(' '));

  // remove cutted link
  for(var i=0; i<links.length; i++) {
    if (!links[i]) { continue; }
    var f = ptc[0], t = ptc[1];
    if ((f==links[i][0] && t==links[i][1])
      || (t==links[i][0] && f==links[i][1])) {
      links[i] = null;
      break;
    }
  }

  // remove protected gateways
  for(var i=0; i<gateways.length; i++) {
    var n = nearestPoints(gateways[i]);
    if (!n.length) { gateways[i] = null; }
  }

  /*var nearestGateway = null, nearestGatewayPath = null;
   for (var i=0; i<gateways.length; i++) {
   var gtwPaths = [];
   g.resetArcsMarks();
   g.findPaths(si, gateways[i], gtwPaths);
   if (!gtwPaths.length) { continue; }
   var gtwShortestPath = gtwPaths.sort(function (p1, p2) {
   return p1.length() - p2.length();
   })[0];
   if (!nearestGatewayPath || nearestGatewayPath.length() > gtwShortestPath.length()) {
   nearestGateway = gateways[i];
   nearestGatewayPath = gtwShortestPath;
   }
   }
   if (nearestGatewayPath && nearestGatewayPath.length) {
   var firstPathArc = nearestGatewayPath.arcs[0];
   print(firstPathArc.from+' '+firstPathArc.to);
   }*/
}
