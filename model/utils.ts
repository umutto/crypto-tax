export const compareArrays = <T>(
  a: T[],
  b: T[],
  opts?: { partial: boolean; strict: boolean }
): boolean => {
  const _opts = opts || { partial: false, strict: false };
  const _a = _opts?.strict ? a : [...a].sort().filter((e) => e);
  const _b = _opts?.strict ? b : [...b].sort().filter((e) => e);

  return (
    (_opts?.partial ? true : _a.length === _b.length) &&
    _b.every((value, index) =>
      _opts?.strict && !_opts?.partial ? value === _a[index] : _a.includes(value)
    )
  );
};

export const closestIdx = (array: number[], value: number): number => {
  return array.reduce((prev, curr, idx) => {
    return Math.abs(curr - value) < Math.abs(array[prev] - value) ? idx : prev;
  }, 0);
};

export const groupBy = <T>(array: T[], key: (keyof T)[]): { [key: string]: T[] } => {
  return array.reduce((c, a) => {
    const g = key.map((k) => `${a[k]}`).join(":");

    (c[g] = c[g] || []).push(a);
    return c;
  }, {} as { [key: string]: T[] });
};

export const humanReadable = (str: string): string => {
  // const result = str.replace(/((?<!\()[A-Z](?![\w\s]*[\)]))/gm, " $1"); // replace all capital letters except those in parenthesis
  const result = str
    .split("")
    .map((letter, idx) => {
      return /^[A-Z]*$/.test(letter)
        ? `${idx !== 0 ? " " : ""}${letter.toUpperCase()}`
        : letter.toLowerCase();
    })
    .join("");

  return result[0].toUpperCase() + result.slice(1);
};

export const readableToCamel = (str: string): string => {
  const result = str.replaceAll(" ", "");
  return result[0].toLowerCase() + result.slice(1);
};

// export const binanceUniqueOpList = (csv: ParseResult<csvWithHeader>) => {
//   Object.values(groupBy(csv.data, ["UTC_Time"]))
//     .map((transactions) => Array.from(new Set(transactions.map((t) => t.Operation))))
//     .filter(((t = {}), (a) => !(t[a] = a.sort() in t)));
// };
