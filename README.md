# React + TypeScript + Vite + JSCAD

This template provides a minimal setup to publish a JSCAD package and uses React to render a simple user interface to test the output of the JSCAD package.

## Getting started

Create a new github repository from this template (more info [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)) and clone the repository to your local machine.

Install dependencies

```bash
npm install
```

Start the development server with `npm run dev`, you should see a cube in the preview window.

Edit `lib/main.ts` and `src/App.tsx` file to create your JSCAD package and adapt the dev preview UI to get a preview of your JSCAD package output.

## Building your package

To build your package run `npm run build`. This will create a `dist` folder with the compiled package. Check the files in the `dist` folder to make sure everything is correct.

## Publishing your package

First be sure to update the `name` and `version` fields in `package.json` before publishing. It is also a good idea to modify this `README.md` explaining what your package does and how to use it.

To publish your package to npm run `npm publish`. This will publish your package to npm and make it available for others to use.

If you want to publish the package to the public you have to set `private: false` in `package.json` to allow publishing. The first time you publish a public package you also need to append `--access public` to the publish command.

```bash
npm publish --access public
```

## Using your package on jscad.app

If you have published your package you can use it on the [jscad.app](https://jscad.app) website like so:

```javascript
const { randomCube } = require("jscad-mylib");

function main() {
  randomCube({ minSize: 1, maxSize: 10 });
}

module.exports = { main };
```

**Note:** If you update your plugin and jscad.app does not pick up the new version, it may be necessary to request purging the jsDelivr cache. You can do this here: [jsdelivr.com/tools/purge](https://www.jsdelivr.com/tools/purge)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
