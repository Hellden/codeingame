
var road = parseInt(readline()); // the length of the road before the gap.
var gap = parseInt(readline()); // the length of the gap.
var platform = parseInt(readline()); // the length of the landing platform.

var minSpeed = gap + 1;
var jumpDone = false;

// game loop
while (true) {

  var speed = parseInt(readline()); // the motorbike's speed.
  var coordX = parseInt(readline()); // the position on the road of the motorbike.

  if (jumpDone) {
    print('SLOW');
    continue;
  }
  if (speed < minSpeed) {
    print('SPEED');
    continue;
  }
  if (speed > minSpeed) {
    print('SLOW');
    continue;
  }
  if ((coordX+speed) < road) {
    print('WAIT');
    continue;
  }

  print('JUMP');
  jumpDone = true;

}
