// Country code to flag emoji mapping
export const countryFlags: Record<string, string> = {
  TR: "🇹🇷", US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", ES: "🇪🇸", IT: "🇮🇹",
  RU: "🇷🇺", SA: "🇸🇦", BR: "🇧🇷", CN: "🇨🇳", JP: "🇯🇵", KR: "🇰🇷", IN: "🇮🇳",
  NL: "🇳🇱", SE: "🇸🇪", PL: "🇵🇱", CA: "🇨🇦", AU: "🇦🇺", MX: "🇲🇽", AR: "🇦🇷",
  ZA: "🇿🇦", EG: "🇪🇬", AE: "🇦🇪", SG: "🇸🇬", TH: "🇹🇭", ID: "🇮🇩", PH: "🇵🇭",
  VN: "🇻🇳", MY: "🇲🇾", NZ: "🇳🇿", IE: "🇮🇪", PT: "🇵🇹", GR: "🇬🇷", CH: "🇨🇭",
  AT: "🇦🇹", BE: "🇧🇪", DK: "🇩🇰", NO: "🇳🇴", FI: "🇫🇮", IS: "🇮🇸", LU: "🇱🇺",
  // Add more as needed
};

export function getCountryFlag(countryCode: string | null | undefined): string {
  if (!countryCode) return "🌍";
  return countryFlags[countryCode.toUpperCase()] || "🌍";
}

export function getCountryName(countryCode: string | null | undefined): string {
  if (!countryCode) return "Unknown";
  const names: Record<string, string> = {
    TR: "Turkey", US: "United States", GB: "United Kingdom", DE: "Germany",
    FR: "France", ES: "Spain", IT: "Italy", RU: "Russia", SA: "Saudi Arabia",
    BR: "Brazil", CN: "China", JP: "Japan", KR: "South Korea", IN: "India",
    NL: "Netherlands", SE: "Sweden", PL: "Poland", CA: "Canada", AU: "Australia",
    MX: "Mexico", AR: "Argentina", ZA: "South Africa", EG: "Egypt", AE: "UAE",
    SG: "Singapore", TH: "Thailand", ID: "Indonesia", PH: "Philippines",
    VN: "Vietnam", MY: "Malaysia",
  };
  return names[countryCode.toUpperCase()] || countryCode;
}

