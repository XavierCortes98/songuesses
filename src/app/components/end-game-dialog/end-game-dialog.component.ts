import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-end-game-dialog',
  templateUrl: './end-game-dialog.component.html',
  styleUrls: ['./end-game-dialog.component.css'],
})
export class EndGameDialogComponent implements OnInit {
  audio!: HTMLAudioElement;
  isAudioPlaying = false;
  constructor(
    public dialogRef: MatDialogRef<EndGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.audioInit();
  }

  audioInit() {
    this.audio = new Audio(this.data.song.preview);
    this.audio.volume = 0.2;
    this.audio.load();

    this.audio.addEventListener('play', () => {
      this.isAudioPlaying = true;
    });

    this.audio.addEventListener('pause', () => {
      this.isAudioPlaying = false;
    });

    this.audio.addEventListener('ended', () => {
      this.isAudioPlaying = false;
    });
  }

  playAudio(): void {
    if (!this.audio) return;

    if (this.isAudioPlaying) {
      this.audio.pause();
    } else {
      this.audio.currentTime = 0;
      this.audio.play().catch((err) => {
        console.error('Error al reproducir audio:', err);
      });

      setTimeout(() => {
        this.audio.pause();
        this.audio.currentTime = 0;
      }, 30000);
    }
  }

  playAgain() {
    this.audio.pause();
    this.dialogRef.close('playAgain');
  }
}
