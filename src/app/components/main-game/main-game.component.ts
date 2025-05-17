import { Component, OnInit } from '@angular/core';
import { DeezerService } from 'src/app/services/deezer.service';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css'],
})
export class MainGameComponent implements OnInit {
  track: any = null;

  constructor(private deezerService: DeezerService) {}

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
}
