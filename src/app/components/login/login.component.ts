/**
 * Import decorators and services from angular
 */
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Import the ngrx configured store
 */
import { Store } from '@ngrx/store';
import { AppState } from '../../store/appState.store';

/**
 * Import the authentication service to be injected into our component
 */
import { Authentication } from '../../services/authentication';

@Component({
    selector: 'ae-login',
    template: require('./login.component.html').toString(),
    styles: [require('./login.component.scss').toString()],
})
export class LoginComponent {
    unsubscribe: any;
    authenticated: boolean;

    //Inject Authentication service on construction
    constructor(private _router: Router, private _ngZone: NgZone, private auth: Authentication, public store: Store<AppState>) {
        this.auth = auth;

        this.checkAuth();

        this.store.map((fullStore: any) => {
            return fullStore.authStore;
        }).subscribe((state: any) => {
            console.log(state);
            this.authenticated = state.authenticated;
            //Because the BrowserWindow runs outside angular for some reason we need to call Zone.run()
            this._ngZone.run(() => {
                if (state.username != '') {
                    this._router.navigate(['home']);
                }
            });
        });
    }

    /**
     * Checks for authentication
     * If existing auth in localstorage just gets the user data immediately
     */
    checkAuth() {
        let storageToken = window.localStorage.getItem('authToken');

        if (storageToken) {
            this.auth.requestUserData(storageToken);
        }
    }

    authenticate() {
        this.auth.githubHandShake();
    }
}
