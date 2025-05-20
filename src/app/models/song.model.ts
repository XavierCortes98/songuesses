import { Artist } from './artist.model';

export interface Song {
  id: number;
  title: string;
  title_short: string;
  link: string;
  preview: string;
  artist: Artist;
}
