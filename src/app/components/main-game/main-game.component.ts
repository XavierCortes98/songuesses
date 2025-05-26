import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounce, debounceTime } from 'rxjs';
import { Guess } from 'src/app/models/guess.model';
import { Song } from 'src/app/models/song.model';
import { DeezerService } from 'src/app/services/deezer.service';
import { EndGameDialogComponent } from '../end-game-dialog/end-game-dialog.component';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css'],
})
export class MainGameComponent implements OnInit {
  guesses: Guess[] = [
    {
      isCorrect: null,
      songName: '',
      skipped: false,
    },
    {
      isCorrect: null,
      songName: '',
      skipped: false,
    },
    {
      isCorrect: null,
      songName: '',
      skipped: false,
    },
    {
      isCorrect: null,
      songName: '',
      skipped: false,
    },
    {
      isCorrect: null,
      songName: '',
      skipped: false,
    },
  ];

  genres = [
    'Pop',
    'Rock',
    'Hip Hop',
    'Rap',
    'R&B',
    'Electronic',
    'Reggae',
    'Latin',
    'Metal',
    'Funk',
    'Dance',
    'Indie',
    'Punk',
    'Trap',
    'K-Pop',
  ];

  searchTimeout!: ReturnType<typeof setTimeout>;

  isValidSelection = false;
  selectedSong: Song | null = null;
  audio!: HTMLAudioElement;

  form!: FormGroup;
  currentAttempt = 0;
  readonly attemptDurations = [0.2, 0.5, 1, 4, 10];
  song!: Song;
  results: Song[] = [];

  didPlayerWin = false;

  constructor(private deezerService: DeezerService, public dialog: MatDialog) {}

  ngOnInit() {
    this.form = new FormGroup({
      song: new FormControl(''),
      genre: new FormControl(''),
      artist: new FormControl(''),
    });

    this.deezerService.getSongToGuess('Bad Bunny').subscribe({
      next: (track) => {
        console.log(track.title);
        this.song = track;
        this.audio = new Audio(this.song.preview);
        this.audio.load();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSearchTermChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    if (
      this.selectedSong &&
      this.getSongLabel(this.selectedSong) !== inputValue
    ) {
      this.isValidSelection = false;
      this.selectedSong = null;
    }

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if (inputValue.length > 3) {
        this.deezerService.searchSong(inputValue).subscribe((res) => {
          this.results = res;
          console.log(this.results);
        });
      } else {
        this.results = [];
      }
    }, 300);
  }

  get songControl() {
    return this.form.get('song') as FormControl;
  }

  setSongGuess(song: Song) {
    this.songControl?.setValue(`${song.title} - ${song.artist.name}`);
    this.selectedSong = song;
    this.isValidSelection = true;
    this.results = [];
  }

  playAudio(): void {
    if (!this.audio) return;

    this.audio.currentTime = 0;

    const duration = this.attemptDurations[this.currentAttempt] ?? 0;
    this.audio
      .play()
      .then(() => {
        setTimeout(() => {
          console.log('play');
          this.audio.pause();
          this.audio.currentTime = 0;
        }, duration * 1000); // convierte a milisegundos
      })
      .catch((err) => {
        console.error('Error al reproducir audio:', err);
      });
  }

  skipAttempt() {
    if (this.currentAttempt === this.guesses.length - 1) {
      this.openDialog();
      return;
    }
    this.guesses[this.currentAttempt].skipped = true;
    this.currentAttempt++;
  }

  onSubmit() {
    this.deezerService
      .checkSongGuess(this.selectedSong!.id.toString())
      .subscribe((response) => {
        this.checkGuessValidity(response);
      });
  }

  checkGuessValidity(validity: boolean) {
    if (!validity) {
      this.guesses[this.currentAttempt].isCorrect = false;

      this.guesses[this.currentAttempt].songName = `${
        this.selectedSong!.title
      } - ${this.selectedSong!.artist.name}`;
      this.currentAttempt++;
      this.selectedSong = null;
      this.songControl?.setValue('');
    } else if (validity) {
      this.guesses[this.currentAttempt].isCorrect = true;
      this.didPlayerWin = true;
      this.openDialog();
      this.songControl?.setValue('');
      this.guesses[this.currentAttempt].songName = `${
        this.selectedSong!.title
      } - ${this.selectedSong!.artist.name}`;
      this.currentAttempt++;
    }
  }

  getSongLabel(song: Song): string {
    return `${song.title} - ${song.artist.name}`;
  }

  highlight(text: string): string {
    const searchTerm = this.songControl?.value || '';
    if (!text || !searchTerm) return text;

    // Escapamos caracteres especiales para que no rompa el regex
    const escapeRegExp = (str: string) =>
      str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Separamos los términos del input por espacios (o podrías usar todo junto)
    const terms = searchTerm.split(' ').filter(Boolean).map(escapeRegExp);

    if (terms.length === 0) return text;

    const regex = new RegExp(`(${terms.join('|')})`, 'gi');

    // Reemplazamos las coincidencias por strong con clase highlight
    return text.replace(
      regex,
      (match) => `<strong class="highlight">${match}</strong>`
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(EndGameDialogComponent, {
      width: '400px',
      height: '600px',
      disableClose: true,
      data: { didPlayerWin: this.didPlayerWin, song: this.song },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'playAgain') {
        this.resetGame(); // Tu función para reiniciar el juego
      }
    });
  }

  resetGame() {
    this.guesses = [
      {
        isCorrect: null,
        songName: '',
        skipped: false,
      },
      {
        isCorrect: null,
        songName: '',
        skipped: false,
      },
      {
        isCorrect: null,
        songName: '',
        skipped: false,
      },
      {
        isCorrect: null,
        songName: '',
        skipped: false,
      },
      {
        isCorrect: null,
        songName: '',
        skipped: false,
      },
    ];
    this.currentAttempt = 0;
    this.didPlayerWin = false;
    this.selectedSong = null;
    this.results = [];
    this.songControl?.setValue('');
    this.deezerService.getSongToGuess('Bad Bunny').subscribe({
      next: (track) => {
        console.log(track.title);
        this.song = track;
        this.audio = new Audio(this.song.preview);
        this.audio.load();
      },
      error: (err) => {
        console.error(err);
      },
    });
    this.isValidSelection = false;
    this.form.reset();
  }
}
