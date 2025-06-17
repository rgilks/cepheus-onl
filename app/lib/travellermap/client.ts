import {
  jumpWorldsResponseSchema,
  sectorWorldsResponseSchema,
  type TravellerWorld,
} from 'app/lib/domain/types/travellermap';

const TRAVELLERMAP_API_URL = 'https://travellermap.com/api';

export class TravellerMapClient {
  private async fetch<T>(endpoint: string, params: URLSearchParams): Promise<T> {
    const url = `${TRAVELLERMAP_API_URL}/${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Traveller Map API request failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async getSectorWorlds(sector: string): Promise<TravellerWorld[]> {
    const params = new URLSearchParams({
      sector,
      type: 'SecondSurvey',
    });
    const data = await this.fetch<unknown>('sector', params);
    const parsed = sectorWorldsResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.error('Failed to parse Traveller Map API response:', parsed.error);
      return [];
    }

    return parsed.data.Worlds;
  }

  async getWorld(sector: string, hex: string): Promise<TravellerWorld | null> {
    const params = new URLSearchParams({
      sector,
      hex,
      jump: '0',
    });

    const data = await this.fetch<unknown>('jumpworlds', params);
    const parsed = jumpWorldsResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.error('Failed to parse Traveller Map API response:', parsed.error);
      return null;
    }

    return parsed.data.Worlds[0] ?? null;
  }
}

export const travellerMapClient = new TravellerMapClient();
