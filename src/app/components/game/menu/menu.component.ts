import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  public difficulties = [
    {
      viewValue: 'Fácil',
      value: 0,
    },
    {
      viewValue: 'Medio',
      value: 1,
    },
    {
      viewValue: 'Invencible',
      value: 0,
    },
  ];

  public selectedDifficulty = this.difficulties[0];
  public isChecked: boolean = false;
  @Output() emitCheked = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}

  toggleCheked() {
    this.isChecked = !this.isChecked
    this.emitCheked.emit(this.isChecked);
  }
}
