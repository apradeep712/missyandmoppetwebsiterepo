// lib/ageSizing.ts  
export type AgeGroup = 'baby' | 'toddler' | 'kid';
  
/**  
 * Boundary rules you specified:  
 * - Baby: < 12 months (0..11)  
 * - Toddler: 12..47 months (12 months is toddler, 3 years is toddler)  
 * - Kid: >= 48 months (4 years+)  
 */  
export function getAgeGroupFromMonths(m: number): AgeGroup {  
  if (m < 12) return 'baby';  
  if (m < 48) return 'toddler';  
  return 'kid';  
}
  
export function formatAgeFromMonths(m: number): string {  
  if (m < 12) return `${m} month${m === 1 ? '' : 's'}`;  
  if (m % 12 === 0) {  
    const y = m / 12;  
    return `${y} year${y === 1 ? '' : 's'}`;  
  }  
  // If you never want "1 year 6 months", don't store such values.  
  const y = Math.floor(m / 12);  
  const rem = m % 12;  
  return `${y} year${y === 1 ? '' : 's'} ${rem} month${rem === 1 ? '' : 's'}`;  
}
  
export function normalizeAgeMonths(arr: (number | null | undefined)[]) {  
  return Array.from(new Set(arr.filter((x): x is number => typeof x === 'number')))  
    .filter((x) => x >= 0 && x <= 240)  
    .sort((a, b) => a - b);  
}
  
/**  
 * TEMP fallback while admin still writes age_buckets.  
 * Converts your legacy ranges into single sizes.  
 */  
export function ageMonthsFromLegacyBuckets(buckets: string[] | null | undefined): number[] {  
  if (!buckets || buckets.length === 0) return [];
  
  const out: number[] = [];
  
  for (const id of buckets) {  
    const m = id.match(/^(\d+)-(\d+)m$/);  
    if (m) {  
      const a = Number(m[1]);  
      const b = Number(m[2]);  
      for (let x = a; x <= b; x++) {  
        // rule: 12 months is toddler; exclude it from "baby-ish" ranges  
        if (x === 12 && a < 12) continue;  
        out.push(x);  
      }  
      continue;  
    }
  
    const y = id.match(/^(\d+)-(\d+)y$/);  
    if (y) {  
      const a = Number(y[1]);  
      const b = Number(y[2]);  
      // single ages for years -> boundary points  
      out.push(a * 12, b * 12);  
      continue;  
    }  
  }
  
  return normalizeAgeMonths(out);  
}
  
export function groupAgesForUI(ageMonths: number[]) {  
  const groups: Record<AgeGroup, number[]> = { baby: [], toddler: [], kid: [] };  
  for (const m of normalizeAgeMonths(ageMonths)) {  
    groups[getAgeGroupFromMonths(m)].push(m);  
  }  
  return groups;  
}  