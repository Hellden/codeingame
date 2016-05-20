
var N = parseInt(readline());
var C = parseInt(readline());

var budgets = [];
for (var i = 0; i < N; i++) {
  budgets[i] = parseInt(readline());
}

var bestRepartition = function (v, budgets) {
  var rep = budgets.slice();
  var br = Math.round(v/budgets.length);
  var isPossible = true;
  for(var i=0; i<budgets.length; i++) {
    rep[i] += br;
    if (budgets[i]<br) {
      isPossible = false;
      break;
    }
  }
  if(isPossible) return rep;

};

var sum = budgets.reduce(function(a,b){return a+b;});
if (sum < C) print('IMPOSSIBLE');
else {

}
