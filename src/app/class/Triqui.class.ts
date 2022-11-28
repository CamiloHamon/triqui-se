import { MinMax } from './MinMax.class';

export class Triqui {
  public jugadorActual: string = '';
  public estadoJuego: string = '';
  public modo: string = '';
  public name: string = '';
  public marcar: any;
  public procesarMovida: any;
  public minMax = new MinMax();
  public campos: any;
  public validarGanador: any;
  public hayCeldasVacias: any;

  juego() {
    this.jugadorActual = 'user';
    this.estadoJuego = 'Jugando';
    this.modo = 'facil';
  }

  jugador(name: string) {
    this.name = name;

    this.marcar = function (campos: any, posicion: number, name: string) {
      if (campos[posicion] != 0) {
        return campos;
      }
      campos[posicion] = name;
      return campos;
    };
  }

  computador(name: string) {
    this.jugador.call(this, name);

    this.procesarMovida = function (campos: any, modo: any) {
      var posicion =
        modo == 'facil'
          ? Math.ceil(Math.random() * 8)
          : this.minMax.getPos(campos);

      if (campos[posicion] == 0) return posicion;
      else {
        return this.procesarMovida(campos);
      }
    };
  }

  tablero() {
    this.campos = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    var combinacionesGanadoras = [
      [0, 4, 8],
      [2, 4, 6],
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];

    var validarTresEnRaya = function (ar: any, user: any) {
      var ganador = false;
      for (var i in combinacionesGanadoras) {
        for (var j in combinacionesGanadoras[i]) {
          var pos = combinacionesGanadoras[i][j];
          if (user != ar[pos]) {
            ganador = false;
            break;
          } else {
            ganador = true;
          }
        }
        if (ganador) {
          return combinacionesGanadoras[i];
        }
      }
      return false;
    };

    this.validarGanador = function (campos: any, jugador: any) {
      var hayGanador = validarTresEnRaya(campos, jugador);
      if (hayGanador) return hayGanador;
      else {
        return false;
      }
    };

    this.hayCeldasVacias = function (campos: any) {
      for (var i in campos) {
        if (campos[i] == 0) return true;
      }
      return false;
    };
  }
}
