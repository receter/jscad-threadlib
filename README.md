# JSCAD threadlib

JSCAD threadlib allows you to create threads in JSCAD designs by picking a standard thread from the built in thread table or specify your own thread parameters. It is a port of the OpenSCAD thread library [threadlib](https://github.com/adrianschlatter/threadlib) to JSCAD.

## Installation

Depending on how you use JSCAD, you need to either install `jscad-threadlib` using npm or `require` it in your JSCAD design. Then you can call the `thread` function with the desired thread parameters.

```bash
npm install jscad-threadlib
```

```typescript
import { thread } from "jscad-threadlib";
```

When using `jscad-threadlib` in [jscad.app](https:jscad.app), you can use `require`, no need to install anything. The package will be downloaded automatically from a CDN.

```javascript
const { thread } = require("jscad-threadlib");
```

## Usage

The `thread` function takes either a string with a designator for a standard thread or an array with thread parameters:

**Using a standard thread:**

```javascript
const thread1 = thread({
  thread: "PCO-1810-ext", // PET bottle thread
  turns: 3,
});
```

You can find a list of all supported standard threads in the [here](lib/threadTable.ts).

> If you want to contribute a thread, please read the [contribution guidelines](https://github.com/adrianschlatter/threadlib/blob/develop/docs/CONTRIBUTING.md#you-intend-to-contribute-new-threads), open a pull request to the original [OpecnSCAD threadlib](https://github.com/adrianschlatter/threadlib) repository and let me know in an issue.

**Specifying your own thread specification:**

```javascript
// Specifying thread parameters
const myThreadSpecs = [
  3.18, // Pitch (mm)
  12.055, // Rotation Radius (mm)
  24.51, // Support Diameter (mm)
  [
    [0, -1.13],
    [0, 1.13],
    [1.66, 0.5258],
    [1.66, -0.5258],
  ], // Section Profile (mm, Points[])
];

const thread2 = thread({
  thread: myThreadSpecs,
  turns: 3,
  higbeeArc: 20,
  segments: 120,
});
```

### Bolt and Nut Example

You can use the `bolt` and `nut` functions to create a bolt and a nut with matching threads. The `bolt` function takes the same parameters as the `thread` function. The `nut` function has an additional `outerRadius` parameter.

> Currently you need to select the correct thread designator (suffix `-ext` for bolts and `-int` for nuts) manually.

```javascript
const myBolt = bolt({
  thread: "PCO-1810-ext",
  turns: turns,
});

const supportDiameter = getThreadSpecs(threadDesignator)[2];

const myNut = nut({
  thread: "PCO-1810-int",
  turns: turns,
  outerRadius: supportDiameter + 3,
});
```
