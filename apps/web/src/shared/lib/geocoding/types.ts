export type Coordinates = [number, number];

export type ReverseGeocodeResult = {
  display_name?: string;
};

export type GeocodeResult = {
  name: string;
  coordinates: Coordinates;
};
