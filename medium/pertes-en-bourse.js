
const n = Number(readline())
const vs = readline().split(' ').map(Number)
const nbNums = vs.length

const diffs = []

let i = 0
for (i; i < nbNums; i += 1) {
  let s = i + 1
  while (vs[s] <= vs[i] && s < nbNums) {
    s += 1
  }
  diffs.push(vs[i] - vs[s - 1])
  i = s - 1
}
// printErr(diffs.sort((a, b) => b - a))
const diffMax = Math.max(...diffs)
print(- diffMax)
