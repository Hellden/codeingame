
var L = parseInt(readline());
var H = parseInt(readline());
var T = readline().toUpperCase();

var ROWS = [];
for (var i = 0; i < H; i++) ROWS[i] = readline();

var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ?', asciiLetters = {}, asciiWord = [];
for (var i=0;i<letters.length;i++){
  var letterTab = [];
  for (var j=0;j<H;j++){
    letterTab[j] = [];
    var baseIndex = i * L;
    for(var k=0;k<L;k++)
      letterTab[j][k] = ROWS[j][baseIndex + k];
  }
  asciiLetters[letters[i]] = letterTab;
}

for (var i=0;i<T.length;i++)
  asciiWord[i] = asciiLetters[letters.indexOf(T[i]) > -1 ? T[i] : '?'];

var r = '';
for (var h=0;h<H;h++) {
  for (var w=0;w<asciiWord.length;w++)
    for (var c=0;c<asciiWord[w][h].length;c++)
      r += asciiWord[w][h][c];
  r += '\n';
}

print(r);
