export function find<T>(some: Partial<T>, list: Array<T>) {
    const keys = Object.keys(some);
    const isEqual = (a) => keys.every(n => a[n] === some[n]);
    for (let i = 0; i < list.length; i++) {
        if (isEqual(list[i])) {
            return list[i];
        }
    }
    return null;
}
