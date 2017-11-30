// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
  	apiKey: "AIzaSyA61RSyow7ViN4uVAT48_XHQQf69kHjx00",
    authDomain: "noteapp-436f9.firebaseapp.com",
    databaseURL: "https://noteapp-436f9.firebaseio.com",
    projectId: "noteapp-436f9",
    storageBucket: "noteapp-436f9.appspot.com",
    messagingSenderId: "978310462691"
  }
};
