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
      viewValue: 'Invencible',
      value: 2,
    },
  ];

  public selectedDifficulty = this.difficulties[0];
  public isChecked: boolean = false;
  @Output() emitCheked = new EventEmitter<boolean>();
  @Output() emitDifficulty = new EventEmitter<number>();
  @Output() emitRefresh = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  toggleCheked() {
    this.isChecked = !this.isChecked;
    this.emitCheked.emit(this.isChecked);
  }

  change() {
    this.emitDifficulty.emit(this.selectedDifficulty.value);
  }

  refresh(){
    this.emitRefresh.emit(true);
  }
}
