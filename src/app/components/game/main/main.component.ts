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
      name: 'Jugador 🎮',
      selected: true,
    },
    {
      name: 'IA 🤖',
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
  private calculos: number = 0;
  private cloneTablero: any = [];
  public playerWin: any;
  public emplate: boolean = false;
  private difficulty: number = 0;

  constructor(private _snackBar: MatSnackBar) {
    this.fillTablero();
  }

  fillTablero() {
    const styles = [
      'col-1 p-5',
      'col-1 border-start border-end p-5',
      'col-1 p-5',
      'col-1 border-top p-5',
      'col-1 border-top border-start boder-end p-5',
      'col-1 border-start border-top p-5',
      'col-1 border-top p-5',
      'col-1 border-top border-start p-5',
      'col-1 border-top border-start p-5',
    ];

    for (let i = 0; i < this.tablero.campos.length; i++) {
      const celda = new Celda(styles[i], i);
      this.tablero.campos[i] = celda;
    }
  }

  ngOnInit(): void {}

  refresh(action: any) {
    this.emptyTable();
  }

  getValueChecked(state: any) {
    this.isChecked = state;
    this.changePlayer();
  }

  getValueDifficulty(difficulty: any) {
    this.difficulty = difficulty;
  }

  changePlayer() {
    this.emptyTable();
    if (this.isChecked) {
      this.players = [
        {
          name: 'Jugador 1 🎮',
          selected: true,
        },
        {
          name: 'Jugador 2 🕹',
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
        if (this.players[0].selected) {
          this.playerWin = this.players[0];
        } else {
          this.playerWin = this.players[1];
        }

        let message = '';
        if (this.playerWin.name == 'IA 🤖')
          message = '¡Haz perdido contra la IA! 🤖';
        else message = `¡El ${this.playerWin.name} ha ganado! 🥇`;
        this.openSnackBar(message, 'Ok');
      }
    }
  }

  validMark() {
    let contador = 0;
    this.tablero.campos.forEach((c) => {
      if (c.marcado) contador++;
    });
    if (contador == 9 && !this.playerWin) {
      this.emplate = true;
      this.openSnackBar('¡Ha sido un empate! 👏', 'Ok');
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
    }

    if (
      !this.playerWin &&
      this.players[1].name == 'IA 🤖' &&
      this.players[1].selected &&
      !this.emplate
    ) {
      const pos =
        this.difficulty == 0 ? Math.ceil(Math.random() * 8) : this.getPos();
      this.sendPos(pos);
    }
  }

  tableroMarcable(posicion: number) {
    if (this.cloneTablero[posicion] == '') return true;
    else return false;
  }

  tableroMarcar(turno: string, posicion: number) {
    this.cloneTablero[posicion] = turno;
    this.calculos++;
  }

  tableroCeldasVacias() {
    for (var i = 0; i < 9; i++) {
      if (this.cloneTablero[i] == 0) return true;
    }
    return false;
  }

  validarGanador(jugador: string) {
    if (
      this.cloneTablero[0] == jugador &&
      this.cloneTablero[4] == jugador &&
      this.cloneTablero[8] == jugador
    )
      return true;
    else if (
      this.cloneTablero[2] == jugador &&
      this.cloneTablero[4] == jugador &&
      this.cloneTablero[6] == jugador
    )
      return true;
    else if (
      this.cloneTablero[0] == jugador &&
      this.cloneTablero[1] == jugador &&
      this.cloneTablero[2] == jugador
    )
      return true;
    else if (
      this.cloneTablero[3] == jugador &&
      this.cloneTablero[4] == jugador &&
      this.cloneTablero[5] == jugador
    )
      return true;
    else if (
      this.cloneTablero[6] == jugador &&
      this.cloneTablero[7] == jugador &&
      this.cloneTablero[8] == jugador
    )
      return true;
    else if (
      this.cloneTablero[0] == jugador &&
      this.cloneTablero[3] == jugador &&
      this.cloneTablero[6] == jugador
    )
      return true;
    else if (
      this.cloneTablero[1] == jugador &&
      this.cloneTablero[4] == jugador &&
      this.cloneTablero[7] == jugador
    )
      return true;
    else if (
      this.cloneTablero[2] == jugador &&
      this.cloneTablero[5] == jugador &&
      this.cloneTablero[8] == jugador
    )
      return true;
    else return false;
  }

  max() {
    if (this.validarGanador('x')) return -1;
    if (!this.tableroCeldasVacias()) return 0;
    var n = 9;
    var aux,
      mejor = -9999;
    for (var i = 0; i < n; i++)
      if (this.tableroMarcable(i)) {
        this.tableroMarcar('o', i);
        aux = this.min();
        if (aux > mejor) mejor = aux;
        this.tableroMarcar('', i);
      }
    return mejor;
  }

  min() {
    if (this.validarGanador('o')) return 1;
    if (!this.tableroCeldasVacias()) return 0;
    var aux = 0,
      mejor = 9999;
    for (var i = 0; i < 9; i++) {
      if (this.tableroMarcable(i)) {
        this.tableroMarcar('x', i);
        aux = this.max();
        if (aux < mejor) mejor = aux;
        this.tableroMarcar('', i);
      }
    }
    return mejor;
  }

  clonar() {
    const temp = Array<any>(9);
    for (let i = 0; i < temp.length; i++)
      temp[i] = this.tablero.campos[i].valor;
    return temp;
  }

  getPos(): number {
    this.calculos = 0;
    this.cloneTablero = this.clonar();
    let posicion = 0;
    let aux = 0;
    let mejor = -9999;
    for (let i = 0; i < 9; i++) {
      if (this.tableroMarcable(i)) {
        this.tableroMarcar('o', i);
        aux = this.min();
        if (aux > mejor) {
          mejor = aux;
          posicion = i;
        }
        this.tableroMarcar('', i);
      }
    }
    this.tableroMarcar('o', posicion);
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
