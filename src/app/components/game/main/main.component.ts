import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Celda } from 'src/app/class/Celda.class';
import { Tablero } from 'src/app/class/Tablero.class';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public players = [
    {
      name: 'Jugador',
      selected: true,
      currentTurn: true,
    },
    {
      name: 'IA',
      selected: false,
      currentTurn: false,
    },
  ];
  private playersAux = this.players.slice(0, this.players.length);
  public isChecked: boolean = false;
  public tablero: Tablero = new Tablero();
  private combinacionesGanadoras = [
    [0, 4, 8],
    [2, 4, 6],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  public playerWin: any;
  constructor(private _snackBar: MatSnackBar) {
    this.fillTablero();
  }

  fillTablero() {
    const styles = [
      'col-1 border-top border-start p-5',
      'col-1 border-top border-start p-5',
      'col-1 border-top border-start border-end p-5',
      'col-1 border-top border-start p-5',
      'col-1 border-top border-start p-5',
      'col-1 border-top border-start border-end p-5',
      'col-1 border-top border-start border-bottom p-5',
      'col-1 border-top border-start border-bottom p-5',
      'col-1 border-top border-start border-bottom border-end p-5',
    ];

    for (let i = 0; i < this.tablero.campos.length; i++) {
      const celda = new Celda(styles[i], i);
      this.tablero.campos[i] = celda;
    }
  }

  ngOnInit(): void {}

  getValueChecked(state: any) {
    this.isChecked = state;
    this.changePlayer();
  }

  changePlayer() {
    this.emptyTable();
    if (this.isChecked) {
      this.players = [
        {
          name: 'Jugador 1',
          selected: true,
          currentTurn: true,
        },
        {
          name: 'Jugador 2',
          selected: false,
          currentTurn: false,
        },
      ];
    } else {
      this.players = this.playersAux.slice(0, this.playersAux.length);
    }
  }

  emptyTable() {
    this.players[0].currentTurn = !this.players[0].currentTurn;
    this.players[1].currentTurn = !this.players[1].currentTurn;
    this.tablero.campos.forEach((campo) => {
      campo.marcado = false;
      campo.valor = '';
      const styles = campo.styles;
      campo.styles = styles.replace('cross', '').replace('circle', '');
    });
  }

  tresEnRaya(user: string) {
    const array = Array<any>(9);
    this.tablero.campos.forEach((c) => {
      const pos = c.pos ? c.pos : 0;
      array[pos] = c.valor;
    });

    let ganador = false;
    for (var i in this.combinacionesGanadoras) {
      for (var j in this.combinacionesGanadoras[i]) {
        var pos = this.combinacionesGanadoras[i][j];
        if (user != array[pos]) {
          ganador = false;
          break;
        } else {
          ganador = true;
        }
      }
      if (ganador) {
        if (!this.players[0].currentTurn) {
          this.playerWin = this.players[1];
        } else {
          this.playerWin = this.players[0];
        }

        let message = '';
        if (this.playerWin.name == 'IA') message = '¡Haz perdido contra la IA!';
        else message = `¡El ${this.playerWin.name} ha ganado!`;
        this.openSnackBar(message, 'Ok');
      }
    }
  }

  sendPos(pos: number) {
    if (!this.tablero.campos[pos].marcado && !this.playerWin) {
      this.tablero.campos[pos].marcado = true;
      if (this.players[0].currentTurn) {
        this.tablero.campos[pos].styles += ' cross';
        this.tablero.campos[pos].valor = 'x';
        this.tresEnRaya('x');
      } else {
        this.tablero.campos[pos].styles += ' circle';
        this.tablero.campos[pos].valor = 'o';
        this.tresEnRaya('o');
      }
      this.players[0].currentTurn = !this.players[0].currentTurn;
      this.players[1].currentTurn = !this.players[1].currentTurn;
      if (!this.playerWin) {
        this.players[0].selected = !this.players[0].selected;
        this.players[1].selected = !this.players[1].selected;
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar
      .open(message, action, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
      .onAction()
      .subscribe((a) => {
        this.playerWin = null;
        this.emptyTable();
        if (this.players[1].selected) {
          this.players[0].selected = !this.players[0].selected;
          this.players[1].selected = !this.players[1].selected;
        }
      });
  }
}
