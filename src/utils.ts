export function find<T>(some: Partial<T>, list: Array<T>) {
    const keys = Object.keys(some);
    //@ts-ignore
    const isEqual = (a) => keys.every(n => a[n] === some[n]);
    for (let i = 0; i < list.length; i++) {
        if (isEqual(list[i])) {
            return list[i];
        }
    }
    return null;
}

export function isEmpty(some: unknown): some is undefined {
    return some == null;
}

export function last<T>(list: Array<T>): T {
    return list[list.length - 1];
}
