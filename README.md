# CheckingApp
The example of how to build the Theia-based applications with the CheckingApp.

## Getting started

Please install all necessary [prerequisites](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

### Running the browser example

    yarn && yarn build:dev && yarn download:plugins
    yarn browser build
    yarn browser start

~~*or:* launch `Start Browser Backend` configuration from VS code.~~

Open http://localhost:3000 in the browser.

### Running the Electron example

    yarn && yarn build:dev && yarn download:plugins
    yarn electron bundle:lib
    yarn electron start

~~*or:* launch `Start Electron Backend` configuration from VS code.~~


### Developing with the browser example

Start watching all packages of your application with

    yarn watch

Run the example as [described above](#Running-the-browser-example)

### Developing with the Electron example

Start watching all packages, including `electron-app`, of your application with

    yarn watch


Run the example as [described above](#Running-the-Electron-example)

### Publishing CheckingApp

Create a npm user and login to the npm registry, [more on npm publishing](https://docs.npmjs.com/getting-started/publishing-npm-packages).

    npm login

Publish packages with lerna to update versions properly across local packages, [more on publishing with lerna](https://github.com/lerna/lerna#publish).

    npx lerna publish

### Creating installer for CheckingApp

Build the theia app

    yarn && yarn build:dev && yarn download:plugins

Create the application installer.

    yarn electron bundle:lib
    yarn package:applications

## Code
- Modules:
  - browser-app - used for testing in browser only
  - CheckingApp - startup code
    - see business logic in `CheckingApp/src/browser/CheckingApp-contribution.ts`
  - electron-app - used for testing in electron and for packaging app
  - startChecking - start checking widget
    - widget UI `startChecking/src/browser/startChecking-widget.tsx`
