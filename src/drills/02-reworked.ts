function rung2(s: string) {
    const window = new Set<string>();
    let best = 0;
    let left = 0;

    for (let right = 0; right < s.length; right++) {
        const e = s[right];
        while (window.has(e)) {
            window.delete(s[left])
            left++;
        }
        
        window.add(e);
        best = Math.max(best, right - left + 1);
    }

    return best;
}

function rung3(s: string) {
    const lastSeen = new Map<string, number>();
    let best = 0;
    let left = 0;

    for (let right = 0; right < s.length; right++) {
        const e = s[right];
        const p = lastSeen.get(e);
        if (p != undefined && p >= left) {
            left = p + 1;
        }
        
        lastSeen.set(e, right);
        best = Math.max(best, right - left + 1);
    }

    return best;
}

console.log(rung2('abba'))
console.log(rung3('abba'))