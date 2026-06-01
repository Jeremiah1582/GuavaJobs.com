export type GeoMarket = "gb" | "de";

export type GeoLocation = {
  city: string;
  countryCode: string;
  market: GeoMarket;
};
