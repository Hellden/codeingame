var depthOf = function (object) {
  var level = 1;
  var key;
  for (key in object) {
    if (!object.hasOwnProperty(key)) continue;
    if (typeof object[key] == 'object') {
      var depth = depthOf(object[key]) + 1;
      level = Math.max(depth, level);
    }
  }
  return level;
};

var nodes = {};
var n = parseInt(readline());
for (var i = 0; i < n; i++) {
  var inputs = readline().split(' ');
  var a = parseInt(inputs[0]);
  var b = parseInt(inputs[1]);
  if (!nodes[a]) {
    nodes[a] = {};
  }
  if (!nodes[b]) {
    nodes[b] = {};
  }
  nodes[a][b] = nodes[b];
}

print(depthOf(nodes) - 1);
