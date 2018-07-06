# aerolit.pl

Source code for [http://aerolit.pl](http://aerolit.pl)

## Development

`npm install` to fetch dependencies
`npm start` to compile and start built in server on port 7203

## Deployment

`npm run build` to compile / copy dependencies to `public` directory, then simply put
contents of `public` into directory served via http(s).

## Dependencies

This software uses [SystemJs](https://github.com/systemjs/systemjs) for module loading.

[Terminal.ts](src/Terminal/Terminal.ts) is based on [terminaljs](https://github.com/eosterberg/terminaljs), rewritten in TypeScript, slightly simplified in some places (lacks `sleep`, `password` and `confirm`) and slightly expanded in others (e.g. rudimentary support in styling printed output + ability to print without line breaks).
