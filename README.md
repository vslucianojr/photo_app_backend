# Photo App Server

Application developed with Node, receive uploaded images from Photo App.

## Installation

Use the package manager [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) to install.

```bash
yarn install
```

## Usage

In root path, after install all dependencies, start local server:

```bash
yarn dev
```

## Deploy

This server was development with a local mongoDB instance. If you run it locally, configure vars in .env file. To use it in production mode, configure AWS S3 secret, and run:

```bash
yarn start
```
