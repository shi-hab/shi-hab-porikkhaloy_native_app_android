const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return "";
  return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
}

export function fromBn(str: string): number {
  if (!str) return 0;
  const en = str.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
  return Number(en) || 0;
}

export function formatTaka(amount: number | string): string {
  return `৳${toBn(amount)}`;
}

export function formatDurationBn(minutes: number): string {
  if (minutes < 60) {
    return `${toBn(minutes)} মিনিট`;
  }
  const hrs = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${toBn(hrs)} ঘণ্টা`;
  }
  return `${toBn(hrs)} ঘণ্টা ${toBn(remainingMins)} মিনিট`;
}
