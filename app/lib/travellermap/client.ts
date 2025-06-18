import {
  jumpWorldsResponseSchema,
  sectorWorldsResponseSchema,
  type TravellerWorld,
  travellerWorldSchema,
} from 'app/lib/domain/types/travellermap';

const TRAVELLERMAP_API_URL = 'https://travellermap.com/api';

export class TravellerMapClient {
  private async fetch(endpoint: string, params: URLSearchParams): Promise<string> {
    const url = `${TRAVELLERMAP_API_URL}/${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`Traveller Map API request failed: ${response.statusText}`);
    }

    return response.text();
  }

  async getRandomSector(): Promise<{ Name: string } | null> {
    const response = await fetch('https://travellermap.com/api/sectors');
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const sectors = data.Sectors.filter((s: { Tags: string[] }) => s.Tags.includes('Official'));
    return sectors[Math.floor(Math.random() * sectors.length)];
  }

  async getSectorWorlds(sector: string): Promise<TravellerWorld[]> {
    const params = new URLSearchParams({
      sector,
      type: 'TabDelimited',
    });
    const data = await this.fetch('sec', params);
    const lines = data.trim().split('\n').filter(Boolean);
    if (lines.length < 2) {
      return [];
    }

    const headerLine = lines.shift() as string;
    const headers = headerLine.split('\t').map(h => h.trim());

    const headerMapping: { [key: string]: string } = {
      Stars: 'Stellar',
      '{Ix}': 'Ix',
      '(Ex)': 'Ex',
      '[Cx]': 'Cx',
      W: 'Worlds',
    };

    const worlds = lines.map(line => {
      const values = line.split('\t');
      const worldData: { [key: string]: string | number } = {};
      headers.forEach((header, index) => {
        const key = headerMapping[header] || header;
        const value = values[index]?.trim();

        if (value) {
          if (key === 'Worlds') {
            worldData[key] = parseInt(value, 10);
          } else {
            worldData[key] = value;
          }
        }
      });
      return worldData;
    });

    const parsed = sectorWorldsResponseSchema.safeParse({ Worlds: worlds });

    if (!parsed.success) {
      console.error(
        'Failed to parse Traveller Map API response:',
        JSON.stringify(parsed.error.flatten(), null, 2)
      );
      const sample = worlds.find(w => !travellerWorldSchema.safeParse(w).success);
      if (sample) {
        console.error(
          'Failed to parse Traveller Map API response for world:',
          travellerWorldSchema.safeParse(sample).error?.flatten()
        );
        console.error('World data:', JSON.stringify(sample, null, 2));
      }
      return [];
    }
    return parsed.data.Worlds;
  }

  async getWorldDetails(sector: string, hex: string): Promise<TravellerWorld | null> {
    const params = new URLSearchParams({
      sector,
      hex,
      jump: '0',
    });

    const jsonString = await this.fetch('jumpworlds', params);
    try {
      const data = JSON.parse(jsonString);
      const parsed = jumpWorldsResponseSchema.safeParse(data);

      if (!parsed.success) {
        console.error(
          'Failed to parse Traveller Map API response for world:',
          parsed.error.flatten()
        );
        return null;
      }

      return parsed.data.Worlds[0] ?? null;
    } catch (e) {
      console.error('Failed to parse JSON from Traveller Map API response:', jsonString, e);
      return null;
    }
  }
}

export const travellerMapClient = new TravellerMapClient();
