
while (true) {

  var heights = [];
  for (var i = 0; i < 8; i++)
    heights.push(parseInt(readline())); // represents the height of one mountain, from 9 to 0.

  print(heights.indexOf(Math.max(...heights))); // The number of the mountain to fire on.
}
