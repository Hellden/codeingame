
const N = parseInt(readline())
const C = parseInt(readline())

const budgets = []

let i = 0
let total = 0
for (i; i < N; i++) {
    const b = Number(readline())
    budgets[i] = b
    total += b
}

if (total < C) {
    print('IMPOSSIBLE')
} else {
    const budgetsSorted = budgets.sort((a, b) => a - b)
    const repartition = []
    let total = 0
    while (total < C) {
        i = 0
        for (i; i < N && total < C; i++) {
            if (budgetsSorted[i] === 0) {
                if (repartition[i] === undefined) {
                    repartition[i] = 0
                }
                continue;
            }
            total += 1
            repartition[i] = (repartition[i] || 0) + 1;
            budgetsSorted[i] -= 1;
        }
    }
    printErr(repartition.length, N)
    repartition
        .sort((a, b) => a - b)
        .forEach(v => print(v))
}
