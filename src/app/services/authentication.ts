/**
 * Include angular2 dependencies including HTTP dependencies
 * and Injectable and Inject
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

/**
 * Import the ngrx configured store
 */
import { Store } from '@ngrx/store';
import { AppState } from './../store/appState.store';
import { AUTH_ACTION_TYPES } from './../store/auth.store';

/**
 * Include electron browser so that a new windows can be triggered for auth
 * Information about browserWindow on electron
 * https://github.com/electron/electron/blob/master/docs/api/browser-window.md
 */
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;

/**
 * Basic configuration like Endpoint URL's, API version..
 */
const options = require('./../config.json');

@Injectable()
export class Authentication {
  authWindow: any;
  http: Http;

  //Inject the store to make sure state changes go through the store
  constructor(public store: Store<AppState>, http: Http) {
    //authenticate and call the store to update the token
    const webPreferences = {
      nodeIntegration: false
    }
    this.authWindow = new BrowserWindow({ width: 800, height: 600, show: false, webPreferences });
    this.http = http;
  }

  /**
   * Fires the Github Auth process by calling the github api with
   * https://github.com/login/oauth/authorize
   *
   * Listens to specific redirects ont he BrowserWindow object to handle the callback from envato
   * On will-navigate and did-get-redirect-request methods invocation will call the handleGitHubCallback(url)
   * with the url to make sure a code was received
   *
   * OnClose will reset the browserWindow object
   */
  githubHandShake() {

    // Build the OAuth consent page URL
    let githubUrl = 'https://github.com/login/oauth/authorize?';
    let authUrl = githubUrl + 'client_id=' + options.github.client_id + '&scope=' + options.github.scopes;
    this.authWindow.loadURL(authUrl);
    this.authWindow.show();

    // Handle the response from GitHub
    this.authWindow.webContents.on('will-navigate', (event, url) => {
      this.handleGitHubCallback(url);
    });

    this.authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      this.handleGitHubCallback(newUrl);
    });

    // Reset the authWindow on close
    this.authWindow.on('close', function () {
      this.authWindow = null;
    }, false);
  }

  /**
   * Handles the callback from the browserWindow object
   * Checks for a code in the url and a refresh token received. When token and refresh
   * token are received calls requestGithubToken
   *
   * @param {string} url
   * The url that was just called by one of the events :
   * will-navigate
   * did-get-redirect-request
   *
   */
  handleGitHubCallback(url) {
    let raw_code = /code=([^&]*)/.exec(url) || null;
    let code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    let error = /\?error=(.+)$/.exec(url);

    if (code || error) {
      // Close the browser if code found or error
      this.authWindow.destroy();
    }

    // If there is a code, proceed to get token from github
    if (code) {
      this.requestGithubToken(options.github, code);
    } else if (error) {
      alert('Oops! Something went wrong and we couldn\'t' +
        'log you in using Github. Please try again.');
    }
  }

  /**
   * Requests a git token from the github api given the
   * code received in the authentication step before
   *
   * @param {Object} githubOptions
   * The options to be sent to this request (received from the config file)
   *
   * @param {string} githubCode
   * The code received by the authentication method
   */
  requestGithubToken(githubOptions, githubCode) {
    let creds = 'client_id=' + githubOptions.client_id + '&client_secret=' + githubOptions.client_secret + '&code=' + githubCode;

    let headers = new Headers();
    headers.append('Accept', 'application/json');

    this.http.post('https://github.com/login/oauth/access_token?' + creds, '', { headers: headers })
      .subscribe(
      response => {
        //call the store to update the authToken
        let body_object = JSON.parse(response['_body']);
        this.requestUserData(body_object.access_token);
      },
      err => console.log(err),
      () => console.log('Authentication Complete')
      );

  }

  /**
   * API Request to get information of a user from the Github API
   *
   * @param {string} token
   * The token to be used in the request
   */
  requestUserData(token) {
    //set the token
    this.store.dispatch({
      type: AUTH_ACTION_TYPES.GITHUB_AUTH, payload: {
        'token': token
      }
    });

    let headers = new Headers();
    headers.append('Accept', 'application/json');

    this.http.get('https://api.github.com/user?access_token=' + token, { headers: headers })
      .subscribe(
      response => {
        //call the store to update the authToken
        let body_object = JSON.parse(response['_body']);
        console.log(body_object);
        this.store.dispatch({
          type: AUTH_ACTION_TYPES.CHANGE_NAME, payload: {
            'username': body_object.name
          }
        });
      },
      err => console.log(err),
      () => console.log('Request Complete')
      );
  }

}
