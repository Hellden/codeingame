
var N = parseInt(readline());

var powers = [];
for (var i = 0; i < N; i++)
  powers[i] = parseInt(readline());

powers = powers.sort(function(a, b){return a -b;});

var min = powers[0];
var stop = powers.length;
for(var i=0;i<stop;i++){
  var d = powers[i+1]-powers[i];
  if(d<min) min=d;
}

print(min);
