import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeezerService {
  private readonly baseItunesUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getSongToGuess(query: string): Observable<any> {
    return this.http.get<any>(
      this.baseItunesUrl +
        `api/deezer/random-popular?q=${encodeURIComponent(query)}`
    );
  }
}
