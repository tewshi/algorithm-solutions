function runLength(inp: string): string {
  if (!inp) return "";

  const options = inp.split("");

  if (options.length === 1) {
    return `1${options[0]}`;
  }

  let result = "";
  const mapped: Record<string, number> = {};

  options.reduce((acc, curr, i) => {
    if (!acc[curr]) {
      acc[curr] = 0;
    }

    acc[curr]++;

    if (i > 0) {
      const prev = options[i - 1];
      if (curr !== prev) {
        result += `${acc[prev]}${prev}`;
        acc[prev] = 0;
      } else if (i === options.length - 1) {
        result += `${acc[curr]}${curr}`;
      }
    }

    return acc;
  }, mapped);

  return result;
}

function runLength2(inp: string): string {
  if (!inp) return "";

  const options = inp.split("");

  if (options.length === 1) {
    return `1${options[0]}`;
  }

  const buffer: (string | number)[] = [];

  options.reduce((acc, curr, i) => {
    if (acc.length < 2) {
      acc.push(1, curr);
    }

    if (i > 0) {
      const prev = acc[acc.length - 1];
      if (curr !== prev) {
        acc.push(1, curr);
      } else {
        acc[acc.length - 2] = Number(acc[acc.length - 2]) + 1;
      }
    }

    return acc;
  }, buffer);

  return buffer.join("");
}

function runLength3(inp: string): string {
  if (!inp) return "";

  const options = inp.split("");

  let current = options[0];

  if (options.length === 1) {
    return `1${current}`;
  }
  let count = 0;
  let result = "";

  options.forEach((curr, i) => {
    count++;
    if (i < options.length - 2) {
      const next = options[i + 1];
      if (current !== next) {
        result += `${count}${current}`;
        count = 0;
        current = next;
      }
    } else if (i === options.length - 1) {
      result += `${count}${current}`;
    }
  });

  return result;
}

console.log(runLength("abcdeee"), runLength2("abcdeee"), runLength3("abcdeee"));
console.log(runLength("a"), runLength2("a"), runLength3("a"));
console.log(runLength("aaaaaaaa"), runLength2("aaaaaaaa"), runLength3("aaaaaaaa"));
console.log(runLength("abbaaccc"), runLength2("abbaaccc"), runLength3("abbaaccc"));
