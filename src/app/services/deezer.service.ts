import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root',
})
export class DeezerService {
  private readonly baseDeezerUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  searchSong(query: string): Observable<Song[]> {
    return this.http.get<Song[]>(
      this.baseDeezerUrl + `api/deezer/search?q=${encodeURIComponent(query)}`
    );
  }

  getSongToGuess(query: string): Observable<any> {
    return this.http.get<any>(
      this.baseDeezerUrl +
        `api/deezer/random-popular?q=${encodeURIComponent(query)}`
    );
  }
}
