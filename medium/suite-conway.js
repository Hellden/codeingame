
var R = parseInt(readline());
var L = parseInt(readline());

var conway = function (firstNum, d) {
  var lines = [[firstNum]];
  if (d == 1) { return lines.shift(); }
  for (var i=1; i<d; i++) {
    var prevLine = lines[i-1].slice();
    //printErr(i+'|prevLine='+prevLine.join(','));
    var newLine = [];
    var curNum = prevLine.shift();
    var numCpt = 1;
    while (prevLine.length >= 0) {
      if (prevLine.length == 0) {
        //printErr(i+'|break');
        newLine.push(numCpt);
        newLine.push(curNum);
        break;
      }
      var nextNum = prevLine.shift();
      if (nextNum == curNum) {
        numCpt++;
        //printErr(i+'|nextNum=curNum='+nextNum+', cpt='+numCpt);
      } else {
        //printErr(i+'|nextNum!=curNum, nextNum='+nextNum);
        newLine.push(numCpt);
        newLine.push(curNum);
        curNum = nextNum;
        numCpt = 1;
      }
    }
    //printErr(i+'|newLine='+newLine.join(','));
    lines.push(newLine);
    for (var k=0; k<lines.length-2; k++) { lines[k] = null; }
  }
  return lines[d-1];
};

var line = conway(R, L);
print(line.join(' '));
