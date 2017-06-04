
var inputs = readline().split(' ');
var L = parseInt(inputs[0]);
var C = parseInt(inputs[1]);

var lines = [];

var startPos, endPos;
var teleporter1, teleporter2;
var nbEmptyCases = 0;
for (var i = 0; i < L; i++) {
    var row = readline();
    var cols = row.split('');
    printErr(cols.join(' '));
    nbEmptyCases += cols.reduce((acc, v) => v === ' ' ? acc + 1 : acc, 0)
    lines[i] = cols;
    if (!startPos) {
        var x = cols.indexOf('@');
        if (x > -1) { startPos = [x, i]; }
    }
    if (!endPos) {
        var x = cols.indexOf('$');
        if (x > -1) { endPos = [x, i]; }
    }
    if (!teleporter1 || !teleporter2) {
        var x = cols.indexOf('T');
        if (x > -1) {
            !teleporter1 ? teleporter1 = [x, i] : teleporter2 = [x, i];
        }
    }
}
//printErr(lines);
//printErr('startPos='+startPos);
//printErr('endPos='+endPos);
printErr('nbEmptyCases='+nbEmptyCases);

var printMap = function() {
    for (var i=0 ; i < lines.length; i++) {
        printErr(lines[i].join(' '));
    }
};

var getItem = function () {
    var x, y;
    if (arguments.length === 1) {
        x = arguments[0][0];
        y = arguments[0][1];
    } else if (arguments.length === 2) {
        x = arguments[0];
        y = arguments[1];
    }
    var c = lines[y][x];
    //printErr(x+','+y+'=>'+c);
    return c;
};
//printErr(getItem(1, 1));

var setItem = function () {
    var x, y, item;
    if (arguments.length === 2) {
        x = arguments[0][0];
        y = arguments[0][1];
        item = arguments[1];
    } else if (arguments.length === 3) {
        x = arguments[0];
        y = arguments[1];
        item = arguments[2];
    }
    lines[y][x] = item;
    //printErr(x+','+y+':='+item);
};

var eqPos = function (p1, p2) {
    var id1 = p1.join(','), id2 = p2.join(',');
    //printErr('id1 === id2 '+id1+' === '+id2);
    return id1 === id2;
};

var moveTo = function (curPos, dir) {
    var x = curPos[0], y = curPos[1];
    if (dir === 'NORTH') {
        return [x, y - 1];
    } else if (dir === 'SOUTH') {
        return [x, y + 1];
    } else if (dir === 'EAST') {
        return [x + 1, y];
    } else if (dir === 'WEST') {
        return [x - 1, y];
    }
    throw 'Error moveTo '+dir;
};

var canGoTo = function (nextPos, destroyer) {
    var item = getItem(nextPos);
    //printErr(item);
    if (item === '#') {
        printErr('hit #');
        return false;
    }
    if (item === 'X') {
        if (!destroyer) {
            printErr('hit X');
            return false;
        }
    }
    return true;
};

var whereToMoveFirst = function (dirPriority, curPos) {
    var pr = dirPriority.slice();
    while (pr.length) {
        var dir = pr.shift();
        var nextPos = moveTo(curPos, dir);
        if (canGoTo(nextPos)) {
            return dir;
        }
    }
    throw 'Error whereToMoveFirst';
};

var dirPriority = ['SOUTH', 'EAST', 'NORTH', 'WEST'];
var curPos = startPos;
var curDir;
var gameStarted = false;
var destroyer = false;
var teleported = false;

/*const now = () => (new Date).getTime();*/
/*const startedAt = now();*/

let nbMoves = 0
while (true) {

/*    printErr('nbmoves', nbMoves);
    if (nbMoves === nbEmptyCases) {
        print('LOOP');
        break;
    }*/

    if (eqPos(curPos, endPos)) {
        printErr('end of game');
        break;
    }

    if (!gameStarted && eqPos(curPos, startPos)) {
        printErr('game started');
        gameStarted = true;
        curDir = 'SOUTH';
    }

    var curItem = getItem(curPos);
    printErr('curItem='+curItem+',curDir='+curDir);

    if (teleporter1) {
        var onTeleporter1 = eqPos(curPos, teleporter1)
            , onTeleporter2 = eqPos(curPos, teleporter2);
        if (!teleported && (onTeleporter1 || onTeleporter2)) {
            curPos = onTeleporter1 ? teleporter2 : teleporter1;
            printErr('teleport to '+curPos);
            teleported = true;
            continue;
        }
    }
    if (teleported) { teleported = false; }

    if (curItem === 'S') {
        curDir = 'SOUTH';
    } else if (curItem === 'N') {
        curDir = 'NORTH';
    } else if (curItem === 'E') {
        curDir = 'EAST';
    } else if (curItem === 'W') {
        curDir = 'WEST';
    } else if (curItem === 'I') {
        dirPriority.reverse();
    } else  if (curItem === 'X' && destroyer) {
        printErr('destroy wall');
        setItem(curPos, ' ');
    } else if (curItem === 'B') {
        destroyer = !destroyer;
        printErr('take a beer, destroyer mode='+destroyer);
    }

    var nextPos = moveTo(curPos, curDir);
    //printErr('nextPos='+nextPos);
    if (!canGoTo(nextPos, destroyer)) {
        printErr('shit... we can not');
        curDir = whereToMoveFirst(dirPriority, curPos);
        printErr('change dir to '+curDir);
        curPos = moveTo(curPos, curDir);
        printErr('move to '+curPos);
        print(curDir);
        nbMoves += 1
        continue;
    }

    curPos = moveTo(curPos, curDir);
/*    if (curItem === ' ') {
        setItem(curPos, '-');
    }*/
    printErr('move to '+curPos);
    print(curDir);
    nbMoves += 1

    printMap();
}
