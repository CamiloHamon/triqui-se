export class MinMax {
  public ar_triqui: any;
  public calculos: number = 0;
  public JUGADOR = { HUMANO: 'user', CPU: 'pc' };

  tableroMarcable(posicion: number) {
    return this.ar_triqui[posicion] == 0;
  }

  tableroMarcar(turno: any, posicion: number) {
    this.ar_triqui[posicion] = turno;
    this.calculos++;
  }

  max() {
    if (this.validarGanador(this.JUGADOR.HUMANO)) return -1;
    if (!this.tableroCeldasVacias()) return 0;
    var n = 9;
    var aux,
      mejor = -9999;
    for (var i = 0; i < n; i++)
      if (this.tableroMarcable(i)) {
        this.tableroMarcar(this.JUGADOR.CPU, i);
        aux = this.min();
        if (aux > mejor) mejor = aux;
        this.tableroMarcar(0, i);
      }
    return mejor;
  }

  min() {
    if (this.validarGanador(this.JUGADOR.CPU)) return 1;
    if (!this.tableroCeldasVacias()) return 0;
    var n = 9;
    var aux,
      mejor = 9999;
    for (var i = 0; i < n; i++)
      if (this.tableroMarcable(i)) {
        this.tableroMarcar(this.JUGADOR.HUMANO, i);
        aux = this.max();
        if (aux < mejor) mejor = aux;
        this.tableroMarcar(0, i);
      }
    return mejor;
  }

  validarGanador(jugador: any) {
    if (
      this.ar_triqui[0] == jugador &&
      this.ar_triqui[4] == jugador &&
      this.ar_triqui[8] == jugador
    )
      return true;
    else if (
      this.ar_triqui[2] == jugador &&
      this.ar_triqui[4] == jugador &&
      this.ar_triqui[6] == jugador
    )
      return true;
    else if (
      this.ar_triqui[0] == jugador &&
      this.ar_triqui[1] == jugador &&
      this.ar_triqui[2] == jugador
    )
      return true;
    else if (
      this.ar_triqui[3] == jugador &&
      this.ar_triqui[4] == jugador &&
      this.ar_triqui[5] == jugador
    )
      return true;
    else if (
      this.ar_triqui[6] == jugador &&
      this.ar_triqui[7] == jugador &&
      this.ar_triqui[8] == jugador
    )
      return true;
    else if (
      this.ar_triqui[0] == jugador &&
      this.ar_triqui[3] == jugador &&
      this.ar_triqui[6] == jugador
    )
      return true;
    else if (
      this.ar_triqui[1] == jugador &&
      this.ar_triqui[4] == jugador &&
      this.ar_triqui[7] == jugador
    )
      return true;
    else if (
      this.ar_triqui[2] == jugador &&
      this.ar_triqui[5] == jugador &&
      this.ar_triqui[8] == jugador
    )
      return true;
    else return false;
  }

  tableroCeldasVacias() {
    var n = 9;
    for (var i = 0; i < n; i++) if (this.ar_triqui[i] == 0) return true;
    return false;
  }

  clone(obj: any) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    var temp = obj.constructor();
    for (var key in obj) {
      temp[key] = this.clone(obj[key]);
    }

    return temp;
  }

  getPos(ar: any) {
    this.calculos = 0;
    this.ar_triqui = this.clone(ar);
    var posicion = 0;
    var n = 9;
    var aux,
      mejor = -9999;
    for (var i = 0; i < n; i++) {
      if (this.tableroMarcable(i)) {
        this.tableroMarcar(this.JUGADOR.CPU, i);
        aux = this.min();
        if (aux > mejor) {
          mejor = aux;
          posicion = i;
        }
        this.tableroMarcar(0, i);
      }
    }
    this.tableroMarcar(this.JUGADOR.CPU, posicion);
    console.info('Calculos MiniMax: ' + this.calculos);
    return posicion;
  }
}
