export type Region = "HK Island" | "Kowloon" | "New Territories";

export const HK_REGIONS: Region[] = ["HK Island", "Kowloon", "New Territories"];

export const HK_DISTRICTS: Record<Region, string[]> = {
  "HK Island": [
    "Central",
    "Admiralty",
    "Wan Chai",
    "Causeway Bay",
    "North Point",
    "Quarry Bay",
    "Shau Kei Wan",
    "Chai Wan",
    "Sheung Wan",
    "Sai Ying Pun",
    "Kennedy Town",
    "Pok Fu Lam",
    "Aberdeen",
    "Wong Chuk Hang",
    "Stanley",
    "Repulse Bay",
    "Happy Valley",
    "Tai Hang",
    "Tin Hau",
    "Fortress Hill",
    "Sai Wan Ho",
  ],
  Kowloon: [
    "Tsim Sha Tsui",
    "Jordan",
    "Yau Ma Tei",
    "Mong Kok",
    "Prince Edward",
    "Sham Shui Po",
    "Cheung Sha Wan",
    "Lai Chi Kok",
    "Mei Foo",
    "Kowloon Tong",
    "Wong Tai Sin",
    "Diamond Hill",
    "Kowloon Bay",
    "Kwun Tong",
    "Ngau Tau Kok",
    "Yau Tong",
    "Hung Hom",
    "To Kwa Wan",
    "Kowloon City",
    "Lok Fu",
    "Shek Kip Mei",
    "Tai Kok Tsui",
    "Olympic",
    "Nam Cheong",
  ],
  "New Territories": [
    "Yuen Long",
    "Tin Shui Wai",
    "Tuen Mun",
    "Tsuen Wan",
    "Kwai Chung",
    "Tsing Yi",
    "Sha Tin",
    "Tai Po",
    "Fanling",
    "Sheung Shui",
    "Sai Kung",
    "Tseung Kwan O",
    "Ma On Shan",
    "Tai Wai",
    "Fo Tan",
    "Science Park",
    "Tai Wo",
    "Kam Tin",
    "Lau Fau Shan",
    "Discovery Bay",
    "Tung Chung",
    "Lantau Island",
    "Cheung Chau",
    "Peng Chau",
    "Lamma Island",
  ],
};

/** Match a city value against our district list (case-insensitive) */
export function matchDistrict(city: string): string | null {
  const normalized = city.trim();
  for (const [region, districts] of Object.entries(HK_DISTRICTS)) {
    for (const d of districts) {
      if (normalized.toLowerCase() === d.toLowerCase()) return d;
    }
  }
  return null;
}

/** Get all districts flattened */
export function getAllDistricts(): string[] {
  return Object.values(HK_DISTRICTS).flat();
}
