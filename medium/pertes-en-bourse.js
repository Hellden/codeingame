
var n = parseInt(readline());
var vs = readline()
  .split(' ')
  .map(function(v){ return parseInt(v,10); });

var max=Math.pow(2,31)+1;
var diffs=[];
for (var i=0; i<vs.length; i++) {
  var s=i+1;
  while (vs[s]<vs[i]&&s<vs.length) {s++;}
  diffs.push(Math.abs(vs[i]-vs[s-1]));
  i+=(s-i-1);
}
printErr(diffs.sort(function(a,b){return b-a;}));
var max=Math.max(...diffs);
print(-max);
//print(Math.abs(maxDiff)==max?0:-maxDiff);


//printErr('vs='+vs.join(','));

/*var maxPt = Math.max(...vs);
 if (vs.indexOf(maxPt)===vs.length-1) {
 maxPt = Math.max(...vs.slice(0,vs.length-1));
 }
 printErr('maxPt='+maxPt);

 var startIndex = vs.indexOf(maxPt);
 var i = startIndex + 1;
 for (i; i<vs.length; i++) {
 if (vs[i]>=maxPt) { break; }
 }
 print(vs[i-1]-maxPt);*/

//var s = new Date().getTime();

//var orderFn = function(x, y) { return x - y; };
//var ordered = vs.slice().sort(orderFn);
//printErr('ordered='+ordered.join(','));

//var isOrdered = ordered.join('-') === vs.join('-');
//printErr('isOrdered='+isOrdered);

//printErr('t='+(new Date().getTime()-s));

/*if (isOrdered) { print(0); }
 else {

 var pow = Math.pow(2, 31) + 1;

 var gDiffs = [], gmaxDiff = -pow;
 var len = vs.length;
 //var diff, maxIndex, maxDiff;
 for (var i=0; i<len; i++) {
 //diffs = [];
 //maxIndex -1;
 //maxDiff = -pow;
 var maxDiff = -pow;
 for (var j=i+1; j<len; j++) {
 var d = vs[i]-vs[j];
 if (d > maxDiff) { maxDiff = d; }
 //iDiff.push();
 //diffs[j] = vs[i]-vs[j];
 //if (diffs[j] && diffs[j] > maxDiff) {
 //    maxIndex = j;
 //    maxDiff = diffs[j];
 //}
 }
 //var maxIDiff = Math.max(...iDiff);

 //printErr(diffs.join(','));
 if (maxDiff > gmaxDiff) { gmaxDiff = maxDiff; }
 //printErr('i='+i+'/'+len+', t='+(new Date().getTime()-s));
 }
 print(-gmaxDiff);
 }*/
