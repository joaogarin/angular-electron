/**
 * Import decorators and services from angular
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

/**
 * Import the ngrx configured store
 */
import { Store } from '@ngrx/store';
import { AppState } from '../../store/appState.store';

@Component({
  selector: 'ae-home',
  template: require('./home.component.html').toString(),
  styles: [require('./home.component.scss').toString()],
})
export class HomeComponent implements OnInit {
  name: string;

  messageForm = new FormGroup({
    messageText: new FormControl('Angular2'),
  });

  constructor(public store: Store<AppState>) {}

  ngOnInit() {
    let state = this.store.select('authStore').subscribe((state: any) => {
      this.name = state.username;
    });
  }
}
