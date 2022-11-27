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
    },
    {
      name: 'IA',
      selected: false,
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
  public emplate: boolean = false;
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

  emptyTable() {
    this.playerWin = null;
    this.emplate = false;
    this.players[0].selected = true;
    this.players[1].selected = false;
    this.tablero.campos.forEach((campo) => {
      campo.marcado = false;
      campo.valor = '';
      const styles = campo.styles;
      campo.styles = styles.replace('cross', '').replace('circle', '');
    });
  }

  getArrayPositions() {
    const array = Array<any>(9);
    this.tablero.campos.forEach((c) => {
      const pos = c.pos ? c.pos : 0;
      array[pos] = c.valor;
    });
    return array;
  }

  tresEnRaya(user: string) {
    const array = this.getArrayPositions();
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
        console.log(this.players[0]);
        console.log(this.players[1]);

        if (this.players[0].selected) {
          this.playerWin = this.players[0];
        } else {
          this.playerWin = this.players[1];
        }

        let message = '';
        if (this.playerWin.name == 'IA') message = '¡Haz perdido contra la IA!';
        else message = `¡El ${this.playerWin.name} ha ganado!`;
        this.openSnackBar(message, 'Ok');
      }
    }
  }

  validMark() {
    let contador = 0;
    this.tablero.campos.forEach((c) => {
      if (c.marcado) contador++;
    });
    if (contador == 9) {
      this.emplate = true;
      this.openSnackBar('¡Ha sido un empate!', '😢');
    }
  }

  sendPos(pos: number) {
    if (!this.tablero.campos[pos].marcado && !this.playerWin) {
      this.tablero.campos[pos].marcado = true;
      if (this.players[0].selected) {
        this.tablero.campos[pos].styles += ' cross';
        this.tablero.campos[pos].valor = 'x';
        this.tresEnRaya('x');
      } else {
        this.tablero.campos[pos].styles += ' circle';
        this.tablero.campos[pos].valor = 'o';
        this.tresEnRaya('o');
      }
      this.validMark();
      if (!this.playerWin) {
        this.players[0].selected = !this.players[0].selected;
        this.players[1].selected = !this.players[1].selected;
      }

      if (this.players[1].name == 'IA' && this.players[1].selected) {
        const pos = this.getPos();
        this.sendPos(pos);
      }
    }
  }

  tableroMarcable(posicion: number) {
    const array = this.getArrayPositions();
    if (array[posicion] == 0) return true;
    else return false;
  }

  tableroCeldasVacias() {
    var n = 9;
    const array = this.getArrayPositions();
    for (var i = 0; i < n; i++) {
      if (array[i] == 0) return true;
    }
    return false;
  }

  min() {
    this.tresEnRaya('o');
    if (this.playerWin) return 1;
    if (!this.tableroCeldasVacias()) return 0;
    var n = 9;
    var aux = 0,
      mejor = 9999;
    for (var i = 0; i < n; i++)
      if (this.tableroMarcable(i)) {
        if (aux < mejor) mejor = aux;
      }
    return mejor;
  }

  getPos(): number {
    const ar_triqui = this.getArrayPositions();
    var posicion = 0;
    var n = 9;
    var aux,
      mejor = -9999;
    for (var i = 0; i < n; i++) {
      if (this.tableroMarcable(i)) {
        aux = this.min();
        if (aux > mejor) {
          mejor = aux;
          posicion = i;
        }
      }
    }
    return posicion;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar
      .open(message, action, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
      .onAction()
      .subscribe((a) => {
        this.emptyTable();
      });
  }
}
