# Angular 2 electron starterkit featuring webpack

## DEPRECATED

This repo makes no longer much sense as I would recommend using [Electron forge template for Angular](https://github.com/electron-userland/electron-forge-templates) instead. for that reason I am no longer maintaining this repository.

A working demo of [electron] with [angular] using [Webpack], [ngrx] and [material2]

This is a starter of angular (2 and above) and electron. Its a demo of oauth with github using angular and electron. It uses [ngrx] to manage state. You should create a config file as following :

```javascript
{
    "github": {
        "client_id": "yourclientID",
        "client_secret": "yoursecretkey",
        "scopes": [
            "user:email",
            "notifications"
        ]
    }
}
```

and place this file inside the "app" folder.Dont use this in production as for production you should have a safe server side URI and not have your secret key in the app folder.  

When running it authenticates the user and goes to a page showing the username received from the authentication oauth workflow.

## Run the example

```bash
$ npm install
$ npm run build
$ npm run watch
$ npm run electron
```

## Packaging

The app has support for packaging using 'electron-packager'

```bash
$ npm run package
```

Will run the package for OSX. You can also provide additional options to the package command such as

*  --name : The package name
*  --all : Will packaget the application to all the platforms
*  --arch : Arches to be provided
*  --icon : The icon for the app

## License

[MIT]

[Webpack]: http://webpack.github.io
[MIT]: http://markdalgleish.mit-license.org
[angular]: http://angular.io
[electron]: http://electron.atom.io/
[ngrx]: https://github.com/ngrx/store
[material2]: https://github.com/angular/material2
[electron-packager]: https://github.com/electron-userland/electron-packager
