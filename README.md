# Reddit Clone

React Native Experiment

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app) (CRNA), to find the information about performing common tasks, see CREATE-REACT-NATIVE-APP.md.

## Run the app

You can run this project by one of the following options.

### Option 1 (easiest)
View the app with Expo client.

- Download Expo for iOS: https://itunes.apple.com/app/apple-store/id982107779?ct=www&mt=8
- Download Expo for Android: https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www

Open Expo app and scan the QR code in this link: https://expo.io/@trungdq88/reddit-clone

### Option 2
Download and install pre-build app. Go to the following links and click the Download button.

- Android: https://expo.io/builds/24788c5f-bfd5-44db-91cc-21a3da2c23b0
- iOS: (My Apply Developer account expired, so I can't build. Please check other options.)

### Option 3
Run in development mode from command line:

Install dependencies:

    yarn install

Start project in development mode:

    yarn start

After the packager is complete, then press `i` to open an iOS simulator, or press `a` to open an Android simulator.

## Development

Install dependencies:

    yarn install

Start development environment (use Expo to run/debug the app)

    yarn start

Run tests

    yarn test

Build APK/IPA:

    exp build:android
    exp build:ios

Publishing Expo project:

    exp publish

## `TopicDatabase`
In-memory data storage using Observer pattern.



See jsdoc API document in `src/utils/TopicDatabase.js';
