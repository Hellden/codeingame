
var inputs = readline().split(' ');
var L = parseInt(inputs[0]);
var H = parseInt(inputs[1]);
var S = L * H;

var numbersAlphabet = [];
for (var i = 0; i < H; i++) {
  var line = readline().split('');
  for (var j=0; j<line.length; j+=L) {
    var k = Math.floor(j/L);
    if (!numbersAlphabet[k]) numbersAlphabet[k] = '';
    numbersAlphabet[k] += line.slice(j, j+L).join('')
  }
}
var toRadix = (N, radix) => {
  var hexAlpha = '0123456789abcdefghijklmnopqrstuvwxyz';
  var hex = '';
  var Q = Math.floor(Math.abs(N)), R;
  while (true) {
    R = Q % radix;
    hex = hexAlpha.charAt(R) + hex;
    Q = (Q-R) / radix;
    if (Q === 0) break;
  }
  return hex;
};
var printNumber = function (n) {
  for (var i = 0; i < S; i+=L)
    print(numbersAlphabet[n].slice(i, i+L));
};
var nextNumber = function() {
  var h = parseInt(readline());
  var numbers = [];
  for (var i=0; i < h; i++) {
    var k = Math.floor(i/H);
    if (!numbers[k]) numbers[k] = '';
    numbers[k] += readline();
  }
  numbers = numbers.map(line => numbersAlphabet.indexOf(line));
  var total = 0;
  while (numbers.length) {
    var n = numbers.shift();
    total += (n * Math.pow(20, numbers.length));
  }
  return total;
};
var n1 = nextNumber();
var n2 = nextNumber();
var res;
switch(readline()) {
  case '+': res=n1+n2; break;
  case '-': res=n1-n2; break;
  case '*': res=n1*n2; break;
  case '/': res=n1/n2; break;
}
toRadix(res, 20)
  .split('')
  .forEach(n => {
    switch (n) {
      case 'a': printNumber(10); break;
      case 'b': printNumber(11); break;
      case 'c': printNumber(12); break;
      case 'd': printNumber(13); break;
      case 'e': printNumber(14); break;
      case 'f': printNumber(15); break;
      case 'g': printNumber(16); break;
      case 'h': printNumber(17); break;
      case 'i': printNumber(18); break;
      case 'j': printNumber(19); break;
      default: printNumber(n);
    }
  });
