export const compareArrays = <T>(a: T[], b: T[], strict = false): boolean => {
  const _a = strict ? a : [...a].sort().filter((e) => e);
  const _b = strict ? b : [...b].sort().filter((e) => e);

  return _a.length === _b.length && _a.every((value, index) => value === _b[index]);
};

export const groupBy = <T>(array: T[], key: (keyof T)[]): { [key: string]: T[] } => {
  return array.reduce((c, a) => {
    const g = key.map((k) => `${a[k]}`).join(":");

    (c[g] = c[g] || []).push(a);
    return c;
  }, {} as { [key: string]: T[] });
};

// export const binanceUniqueOpList = (csv: ParseResult<csvWithHeader>) => {
//   Object.values(groupBy(csv.data, ["UTC_Time"]))
//     .map((transactions) => Array.from(new Set(transactions.map((t) => t.Operation))))
//     .filter(((t = {}), (a) => !(t[a] = a.sort() in t)));
// };
