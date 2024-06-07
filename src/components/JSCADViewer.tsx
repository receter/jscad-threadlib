import { useEffect, useRef, useCallback, useMemo, useState } from "react";

import {
  prepareRender,
  cameras,
  drawCommands,
  entitiesFromSolids,
} from "@jscad/regl-renderer";
import { useAnimationFrame } from "./useAnimationFrame";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function JSCADViewer({ solids }: { solids: any }) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refNeedsRerender = useRef(false);
  const [viewerReady, setViewerReady] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refRender = useRef<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refViewerOptions = useRef<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entitiesFromSolidsMemoized: any = useMemo(() => {
    return [
      {
        visuals: {
          drawCmd: "drawGrid",
          show: true,
          color: [0, 0, 0, 1],
          subColor: [0, 0, 1, 0.5],
          fadeOut: false,
          transparent: true,
        },
        size: [200, 200],
        ticks: [10, 10],
      },
      {
        visuals: {
          drawCmd: "drawAxis",
          show: true,
        },
      },
      ...entitiesFromSolids({}, solids),
    ];
  }, [solids]);

  useEffect(() => {
    const canvas = refCanvas.current as HTMLCanvasElement;

    function getContextAndContextType(
      canvas: HTMLCanvasElement,
      contextType: string,
    ) {
      const context = canvas.getContext(contextType);
      return context ? { context, contextType } : null;
    }

    const contextAndContextTypeResult =
      getContextAndContextType(canvas, "webgl2") ||
      getContextAndContextType(canvas, "webgl") ||
      getContextAndContextType(canvas, "experimental-webgl") ||
      getContextAndContextType(canvas, "webgl-experimental");

    const webglContext = contextAndContextTypeResult?.context;
    const webglContextType = contextAndContextTypeResult?.contextType;

    const viewerOptions = {
      rendering: {
        background: [0.93, 0.93, 0.93, 1],
      },
      glOptions: {
        gl: webglContext,
      },
      camera: { ...cameras.perspective.defaults, position: [150, -180, 233] },
      drawCommands: {
        drawAxis: drawCommands.drawAxis,
        drawGrid: drawCommands.drawGrid,
        drawLines: drawCommands.drawLines,
        drawMesh: drawCommands.drawMesh,
      },
    };

    // This was in https://github.com/jscad/OpenJSCAD.org/blob/master/packages/web/src/ui/views/viewer.js
    if (webglContextType === "webgl") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((webglContext as any)?.getExtension("OES_element_index_uint")) {
        if (viewerOptions.glOptions) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (viewerOptions.glOptions as any).optionalExtensions = [
            "oes_element_index_uint",
          ];
        }
      }
    }

    refViewerOptions.current = viewerOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refRender.current = prepareRender(viewerOptions as any);

    cameras.perspective.setProjection(
      refViewerOptions.current.camera,
      refViewerOptions.current.camera,
      {
        width: refCanvas.current?.width ?? 0,
        height: refCanvas.current?.height ?? 0,
      },
    );
    cameras.perspective.update(
      refViewerOptions.current.camera,
      refViewerOptions.current.camera,
    );

    setViewerReady(true);
  }, []);

  useEffect(() => {
    if (viewerReady === true) {
      refViewerOptions.current.entities = entitiesFromSolidsMemoized;
      refNeedsRerender.current = true;
    }
  }, [entitiesFromSolidsMemoized, viewerReady]);

  const animationFrameCallback = useCallback(() => {
    if (
      viewerReady === true &&
      refNeedsRerender.current === true &&
      refRender.current !== undefined
    ) {
      refNeedsRerender.current = false;
      refRender.current(refViewerOptions.current);
    }
  }, [viewerReady]);

  useAnimationFrame(animationFrameCallback);

  return <canvas height={600} width={800} ref={refCanvas} />;
}
