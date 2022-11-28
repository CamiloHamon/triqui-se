export class Celda {
  public styles: string = '';

  constructor(
    styles: string,
    public pos?: number,
    public valor?: string | 'a',
    public marcado?: boolean | false,
  ) {
    this.styles = styles;
    if (valor) this.valor = valor;
    else this.valor = '';
    if (marcado) this.marcado = marcado;
    else this.marcado = false;
  }

  setCelda(valor: string, marcado: boolean) {
    this.valor = valor;
    this.marcado = marcado;
  }
}
