/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var Node = function (v) {
  this.v = v;
  this.children = [];
};

var nodeFilter = function (v) {
  return function (n) {
    return n.v === v;
  };
};

var strepeat = function (c, n) {
  var acc = '';
  for (var i = 0; i < n; i++) { acc += c; }
  return acc;
};

var countNodes = function (head) {
  var nbNodes = 1;
  for (var i = 0; i < head.children.length; i++) {
    nbNodes += countNodes(head.children[i]);
  }
  return nbNodes;
};

var printNodes = function (head, depth) {
  printErr(strepeat('\t', depth) + head.v);
  depth = depth || 0;
  for (var i = 0; i < head.children.length; i++) {
    printNodes(head.children[i], depth + 1);
  }
};

var addToParent = function (head, num) {
  //printErr('add '+num+' to parent '+head.v);
  var node = head.children.filter(nodeFilter(num))[0];
  if (!node) {
    node = new Node(num);
    head.children.push(node);
  }
  return node;
};

var addPhoneNumber = function (head, pNum) {
  for (var i = 0; i < pNum.length; i++) {
    head = addToParent(head, pNum[i]);
  }
};

var list = [{v:null, children: []}];
var head = list[0];
var N = parseInt(readline());
for (var i = 0; i < N; i++) {
  var pNum = readline();
  printErr(pNum);
  addPhoneNumber(head, pNum);
}
//printNodes(list[0]);
print(countNodes(list[0]) - 1);
