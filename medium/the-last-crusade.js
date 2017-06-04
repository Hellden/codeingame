
const TOP = 'TOP'
const LEFT = 'LEFT'
const RIGHT = 'RIGHT'
const BOTTOM = 'BOTTOM'

//------------------------------------------------------------------------------

const roomsMap = [
  {}, // 0
  { // 1
    TOP: BOTTOM,
    LEFT: BOTTOM,
    RIGHT: BOTTOM
  },
  { // 2
    LEFT: RIGHT,
    RIGHT: LEFT
  },
  { // 3
    TOP: BOTTOM
  },
  { // 4
    TOP: LEFT,
    RIGHT: BOTTOM
  },
  { // 5
    LEFT: BOTTOM,
    BOTTOM: RIGHT
  },
  { // 6
    LEFT: RIGHT,
    RIGHT: LEFT
  },
  { // 7
    TOP: BOTTOM,
    RIGHT: BOTTOM
  },
  { // 8
    LEFT: BOTTOM,
    RIGHT: BOTTOM
  },
  { // 9
    TOP: BOTTOM,
    LEFT: BOTTOM
  },
  { // 10
    TOP: LEFT
  },
  { // 11
    TOP: RIGHT
  },
  { // 12
    RIGHT: BOTTOM
  },
  { // 13
    LEFT: BOTTOM
  }
]

//------------------------------------------------------------------------------

const nextPosition = (x, y, direction) => {
  switch (direction) {
    case BOTTOM:
      return [ x, y + 1 ]
    case RIGHT:
      return [ x + 1, y ]
    case LEFT:
      return [ x - 1, y ]
  }
}

// -----------------------------------------------------------------------------

const inputs = readline().split(' ')
const nbColumns = Number(inputs[0])
const nbRows = Number(inputs[1])

printErr('nbColumns=', nbColumns)
printErr('nbRows=', nbRows)

let i = 0
const lines = []
for (i; i < nbRows; i += 1) {
  const line = readline().split(' ').map(Number)
  printErr('line'+i, line)
  lines.push(line)
}

const exitCoord = Number(readline())
printErr('exitCoord=', exitCoord)

//------------------------------------------------------------------------------

while (true) {
  const inputs = readline().split(' ')
  const currentPosition = inputs.map(Number).slice(0, 2)
  const [ xi, yi ] = currentPosition
  const from = inputs[inputs.length - 1]
  printErr('['+xi+','+yi+'] '+from)
  const currentLine = lines[yi]
  const currentRoomType = currentLine[xi]
  const availableDirection = roomsMap[currentRoomType][from]
  // printErr('currentLine='+currentLine)
  // printErr('currentRoom='+currentRoom)
  // printErr('availableDirection='+availableDirection)
  print(nextPosition(xi, yi, availableDirection).join(' '))
}
