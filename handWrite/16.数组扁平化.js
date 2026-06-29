function flater(arr) {
    return arr.flat(Infinity);
}

console.log(flater([1, 2, [3, 4], [5, 6, [7, 8]]]))


function flatten(arr) {
    let result = [];

    for (const item of arr) {
        if (Array.isArray(item)) {
            result = result.concat(flatten(item));
        } else {
            result.push(item)
        }
    }

    return result;
}

console.log(flatten([1, 2, [3, 4], [5, 6, [7, 8]]]))