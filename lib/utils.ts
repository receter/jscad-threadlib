import { extrusions, maths } from "@jscad/modeling";
import {
  ThreadPitch,
  ThreadRotationRadius,
  ThreadSectionProfile,
  THREAD_TABLE,
  ThreadDesignator,
  ThreadSpecs,
} from "./threadTable";

const { extrudeFromSlices, slice } = extrusions;
const { mat4 } = maths;

export function liloTaper(x: number, N: number, taperedFraction: number) {
  return Math.min(
    Math.min(1, (1.0 / taperedFraction) * (x / N)),
    (1 / taperedFraction) * (1 - x / N),
  );
}

export function getThreadSpecsFromTable(
  designator: ThreadDesignator,
): ThreadSpecs {
  const specs = THREAD_TABLE.find((e) => e[0] === designator);

  if (specs === undefined) {
    throw new Error(`Designator: '${designator}' not found`);
  }

  // Avoids mutating THREAD_TABLE by returning a new array
  return [
    specs[1][0],
    specs[1][1],
    specs[1][2],
    [
      [...specs[1][3][0]],
      [...specs[1][3][1]],
      [...specs[1][3][2]],
      [...specs[1][3][3]],
    ],
  ];
}

export function straightThread({
  sectionProfile,
  pitch,
  rotationRadius,
  segments,
  turns,
  higbeeArc,
}: {
  sectionProfile: ThreadSectionProfile;
  pitch: ThreadPitch;
  rotationRadius: ThreadRotationRadius;
  segments: number;
  turns: number;
  higbeeArc: number;
}) {
  const steps = turns * segments;

  // calc profile height
  // const profileHighestPoint = sectionProfile.reduce(
  //   (acc, point) => Math.max(acc, point[1]),
  //   0,
  // );
  // const profileLowestPoint = sectionProfile.reduce(
  //   (acc, point) => Math.min(acc, point[1]),
  //   0,
  // );
  // const profileHeight = profileHighestPoint - profileLowestPoint;

  // create thread slice
  const threadSlice = slice.fromPoints(
    sectionProfile as unknown as [number, number][],
  );
  const rotateMatrix = mat4.fromXRotation(mat4.create(), Math.PI / 2);
  mat4.rotateY(rotateMatrix, rotateMatrix, Math.PI / 2);
  const rotatedThreadSlice = slice.transform(rotateMatrix, threadSlice);

  // offset so that the thread is positioned in the center
  const offsetZ = -(((turns + 1) * pitch) / 2 - pitch / 2);

  return extrudeFromSlices(
    {
      numberOfSlices: steps + 1,
      callback: (_progress, i, base) => {
        // calc
        const angle = (((360 * i) / segments - 90) * Math.PI) / 180;
        const scalingFactor =
          0.01 +
          0.99 * liloTaper(i / turns, steps / turns, higbeeArc / 360 / turns);
        // const scaledProfileHeight = profileHeight * scalingFactor;
        const height = (pitch * i) / segments; // + (profileHeight - scaledProfileHeight) / 2;

        // transform
        const matrix = mat4.fromZRotation(mat4.create(), angle);
        mat4.translate(matrix, matrix, [0, rotationRadius, height + offsetZ]);
        mat4.scale(matrix, matrix, [
          scalingFactor,
          scalingFactor,
          scalingFactor,
        ]);

        // return
        return slice.transform(matrix, base);
      },
    },
    rotatedThreadSlice,
  );
}

export function getThreadSpecs(
  threadSpecsOrDesignator: ThreadDesignator | ThreadSpecs,
) {
  if (typeof threadSpecsOrDesignator === "string") {
    return getThreadSpecsFromTable(threadSpecsOrDesignator);
  } else {
    // TODO: Validate the threadSpecs and throw an error if invalid

    // Validate ThreadSpecs

    if (typeof threadSpecsOrDesignator[0] !== "number") {
      throw new Error("Pitch (specs[0]) must be a number");
    }

    if (typeof threadSpecsOrDesignator[1] !== "number") {
      throw new Error("Rotation Radius (specs[1]) must be a number");
    }

    if (typeof threadSpecsOrDesignator[2] !== "number") {
      throw new Error("Support Diameter (specs[2]) must be a number");
    }

    if (!Array.isArray(threadSpecsOrDesignator[3])) {
      throw new Error(
        "Section Profile (specs[3]) must be an array of points: [number, number][]",
      );
    }

    if (threadSpecsOrDesignator[3].length !== 4) {
      throw new Error("Section Profile (specs[3]) must contain 4 points");
    }

    threadSpecsOrDesignator[3].forEach((point) => {
      if (
        !Array.isArray(point) ||
        typeof point[0] !== "number" ||
        typeof point[1] !== "number"
      ) {
        throw new Error(
          "Section Profile (specs[3]) must be an array of points: [number, number][]",
        );
      }
    });

    return threadSpecsOrDesignator;
  }
}
