
var pounds_ = {
  1: 'eaionrtlsu',
  2: 'dg',
  3: 'bcmp',
  4: 'fhvwy',
  5: 'k',
  8: 'jx',
  10: 'qz'
}, pounds = {};
for (var p in pounds_) {
  var letters = pounds_[p];
  for (var l in letters) { pounds[letters[l]] = parseInt(p); }
}

var N = parseInt(readline());

var startups = {};
/*startups.str = function () {
 return Object.keys(this).slice(1);
 };*/

var wordPounds = {};
var graph = {};

var words = [];
for (var i=0; i<N; i++) {
  var word = readline()
    , len = word.length
    , wPound = 0;
  for (var j=0; j<len; j++) { wPound += pounds[word[j]]; }
  words.push(word);
  wordPounds[word] = wPound;
  //printErr(word+'=>'+wPound);
}

var createLetter = function (word, i) {
  var letter = {
    value: word[i],
    next: {},
    pound: pounds[word[i]],
    words: [word]
  };
  /*letter.addNext = function (l, word) {
   if (!this.next[l.value]) { this.next[l.value] = l; }
   else if (this.next[l.value].words.indexOf(word) == -1) {
   this.next[l.value].words.push(word);
   }
   };*/
  graph[word[i]] = letter;
  //printErr(letter.value+' added to the graph');
  return letter;
};

var insertWord = function (word) {
  //printErr('insert word '+word);
  if (!word.length) { return; }
  var firstLetter = word[0];
  var previousLetter = graph[firstLetter];
  //printErr('firstLetter='+firstLetter);
  if (!previousLetter) {
    //printErr(firstLetter+' not in startups');
    previousLetter = createLetter(word, 0);
  }
  if (!startups[firstLetter]) { startups[firstLetter] = []; }
  startups[firstLetter].push(previousLetter);
  if (previousLetter.words.indexOf(word) == -1) {
    previousLetter.words.push(word);
  }
  if (word.length == 1) { return; }
  /*var letter = null, len=word.length;
   for (var i=1; i<len; i++) {
   letter = graph[word[i]];
   if (!letter) { letter = createLetter(word, i); }
   previousLetter.addNext(letter, word);
   }*/
};

words.forEach(function (word) { if (word.length < 8) { insertWord(word); } });

var LETTERS = readline().split('');
var possibleWords = [];
LETTERS.forEach(function (L) {
  var stLetter = startups[L];
  if (!stLetter) { return; }
  stLetter.forEach(function (letter) {
    letter.words.forEach(function (word) {
      var allLettersContained=true, lettersLeft = LETTERS.slice().join('');
      for (var i=0; i<word.length; i++) {
        if (lettersLeft.indexOf(word[i])==-1
          ||LETTERS.indexOf(word[i])===-1) {
          allLettersContained = false;
          break;
        }
        lettersLeft=lettersLeft.replace(word[i],'');
      }
      if (allLettersContained &&
        possibleWords.indexOf(word)===-1) {
        possibleWords.push(word);
      }
    });
  });
});

if (possibleWords.length == 1) { print(possibleWords[0]); }
else {
  possibleWords = possibleWords.sort(function(w1, w2) {
    return wordPounds[w2] - wordPounds[w1];
  });
  var maxPound=wordPounds[possibleWords[0]];
  /*printErr(
   wordPounds['satire'],
   maxPound,
   possibleWords,
   wordPounds[possibleWords[0]],
   wordPounds[possibleWords[1]]
   );*/
  possibleWords = possibleWords.filter(function(w){return wordPounds[w]==maxPound;});
  possibleWords = possibleWords.slice(0,4);
  //printErr(possibleWords, possibleWords.length);
  if (wordPounds[possibleWords[0]] >= wordPounds[possibleWords[1]]) {
    print(possibleWords[0]);
  } else {
    print(possibleWords.sort(function(w1, w2) { return w1 < w2; })[0]);
  }
}

