import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LocationsService {
  constructor(private configService: ConfigService) {}

  async geocodeLocation(
    location: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location,
    )}&key=${apiKey}`;

    const res = await axios.get(url);

    if (res.data.status === 'OK') {
      const { lat, lng } = res.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
    return null;
  }
}
