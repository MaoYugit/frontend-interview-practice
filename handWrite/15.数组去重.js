function unique(arr) {
    return [...new Set(arr)];
}

arr1 = [1, 1, 1, 2, 2, 2];
console.log(unique(arr1));

function unique2(arr) {
    const result = [];
    const arrMap = new Map();

    for (let item of arr) {
        if(!arrMap.has(item)) {
            arrMap.set(item, true);
            result.push(item);
        }
    }
    return result;
}