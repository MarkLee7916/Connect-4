export function contiguousNumberList(limit: number): number[] {
    const nums = [];

    for (let num = 0; num < limit; num++) {
        nums.push(num);
    }

    return nums;
}

export function randomItemFromList<T>(list: T[]) {
    return list[randomIntBetween(0, list.length)];
}

function randomIntBetween(lower: number, upper: number) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}