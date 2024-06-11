// Be sure to install the @jscad/* packages as "devDependencies",
// externalize them in `vite.config.ts`, and add them to the
// "peerDependencies" in the `package.json` file.

import { primitives, booleans } from "@jscad/modeling";
import { ThreadDesignator, ThreadSpecs } from "./threadTable";
import { getThreadSpecs, straightThread } from "./utils";

export { THREAD_TABLE } from "./threadTable";
export { getThreadSpecsFromTable } from "./utils";

const { cylinder } = primitives;
const { union, subtract } = booleans;

type ThreadOptions = {
  // TODO: Nut should accept -ext thread designators and bolt should accept -int
  thread: ThreadDesignator | ThreadSpecs;
  turns?: number;
  higbeeArc?: number;
  segments?: number;
};

export function thread({
  thread,
  turns = 3,
  higbeeArc = 20,
  segments = 32,
}: ThreadOptions) {
  const threadSpecs = getThreadSpecs(thread);

  return straightThread({
    pitch: threadSpecs[0],
    rotationRadius: threadSpecs[1],
    sectionProfile: threadSpecs[3],
    turns,
    higbeeArc,
    segments,
  });
}

export function bolt({
  thread,
  turns = 3,
  higbeeArc = 20,
  segments = 32,
}: ThreadOptions) {
  const threadSpecs = getThreadSpecs(thread);

  const pitch = threadSpecs[0];

  const boltThread = straightThread({
    pitch,
    rotationRadius: threadSpecs[1],
    sectionProfile: threadSpecs[3],
    turns,
    higbeeArc,
    segments,
  });

  const boltCylinder = cylinder({
    height: (turns + 1) * pitch,
    radius: threadSpecs[2] / 2,
    segments,
  });

  return union(boltThread, boltCylinder);
}

export function nut({
  thread,
  turns = 3,
  outerRadius,
  higbeeArc = 20,
  segments = 32,
}: ThreadOptions & { outerRadius: number }) {
  const threadSpecs = getThreadSpecs(thread);

  const pitch = threadSpecs[0];

  const nutThread = straightThread({
    pitch,
    rotationRadius: threadSpecs[1],
    sectionProfile: threadSpecs[3],
    turns,
    higbeeArc,
    segments,
  });

  const height = (turns + 1) * pitch;

  const nutCylinderInner = cylinder({
    height,
    radius: threadSpecs[2] / 2,
    segments,
  });

  const nutCylinderOuter = cylinder({
    height,
    radius: outerRadius,
    segments,
  });

  return union(nutThread, subtract(nutCylinderOuter, nutCylinderInner));
}

// OpenSCAD version of nut:
// module nut(designator, turns, Douter, higbee_arc=20, fn=120, table=THREAD_TABLE, nut_sides=0) {
//     nut_sides = nut_sides == 0 ? fn : nut_sides;
//     union() {
//         specs = thread_specs(str(designator, "-int"), table=table);
//         P = specs[0]; Dsupport = specs[2];
//         H = (turns + 1) * P;
//         thread(str(designator, "-int"), turns=turns, higbee_arc=higbee_arc, fn=fn, table=table);

//         translate([0, 0, -P / 2])
//             difference() {
//                 cylinder(h=H, d=Douter, $fn=nut_sides);
//                 translate([0, 0, -0.1])
//                     cylinder(h=H+0.2, d=Dsupport, $fn=fn);
//             };
//     };
// };

// OpenSCAD version of tap:
// module tap(designator, turns, higbee_arc=20, fn=120, table=THREAD_TABLE) {
//     difference() {
//         specs = thread_specs(str(designator, "-int"), table=table);
//         P = specs[0]; Dsupport = specs[2];
//         H = (turns + 1) * P;

//         translate([0, 0, -P / 2]) {
//             cylinder(h=H, d=Dsupport, $fn=fn);
//         };

//         thread(str(designator, "-int"), turns=turns, higbee_arc=higbee_arc, fn=fn, table=table);
//     };
// }
