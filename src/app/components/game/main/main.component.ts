import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  public players = [
    {
      name: 'Jugador',
      selected: true,
    },
    {
      name: 'IA',
      selected: false,
    },
  ];
  private playersAux = this.players.slice(0, this.players.length);
  public isChecked: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  getValueChecked(state: any) {
    this.isChecked = state;
    this.changePlayer();
  }

  changePlayer() {
    console.log('hola');

    if (this.isChecked) {

      this.players = [
        {
          name: 'Jugador 1',
          selected: true,
        },
        {
          name: 'Jugador 2',
          selected: false,
        },
      ];
    } else {
      this.players = this.playersAux.slice(0, this.playersAux.length);
    }
  }
}
