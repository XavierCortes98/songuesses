import { Component, OnInit } from '@angular/core';
import { debounce, debounceTime, Subject } from 'rxjs';
import { Song } from 'src/app/models/song.model';
import { DeezerService } from 'src/app/services/deezer.service';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css'],
})
export class MainGameComponent implements OnInit {
  guesses: string[] = ['', '', '', '', '', ''];
  currentattempt = 0;
  searchTerm: string = '';
  track: any = null;
  results: Song[] = [];

  private searchSubject = new Subject<string>();

  constructor(private deezerService: DeezerService) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((query) => {
      if (query.length > 3) {
        this.deezerService.searchSong(query).subscribe((res) => {
          this.results = res;
          console.log('Resultados de búsqueda:', this.results);
        });
      } else {
        this.results = [];
        console.log('Resultados de búsqueda vacios:');
      }
    });
  }

  ngOnInit() {
    this.deezerService.getSongToGuess('Bad Bunny').subscribe({
      next: (track) => {
        this.track = track;
        console.log('Canción aleatoria popular:', this.track);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  onSearchTermChange(value: string) {
    this.searchSubject.next(value);
  }

  skipAttempt() {
    if (this.currentattempt === this.guesses.length) {
      //Resolver
      return;
    }
    this.guesses[this.currentattempt] = 'Skipped';
  }

  highlight(text: string): string {
    if (!this.searchTerm) return text;
    const term = this.searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // escapar regex
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<strong class="highlight">$1</strong>');
  }
}
