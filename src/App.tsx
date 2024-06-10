import { useMemo, useState } from "react";
import { JSCADViewer } from "./components/JSCADViewer";
import { bolt, nut, thread, getThreadSpecsFromTable } from "../lib/main";
import { THREAD_TABLE, ThreadDesignator } from "../lib/threadTable";

import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import jscadLogo from "./assets/jscad.png";
import "./App.css";

function App() {
  const [turns, setTurns] = useState(3);
  const [threadDesignator, setThreadDesignator] =
    useState<ThreadDesignator>("PCO-1810-ext");
  const [functionName, setFunctionName] = useState<"thread" | "bolt" | "nut">(
    "thread",
  );

  const solids = useMemo(() => {
    switch (functionName) {
      case "thread":
        return thread({
          thread: threadDesignator,
          turns: turns,
        });
      case "bolt":
        return bolt({
          thread: threadDesignator,
          turns: turns,
        });
      case "nut":
        return nut({
          thread: threadDesignator,
          turns: turns,
          outerRadius: getThreadSpecsFromTable(threadDesignator)[2] / 2 + 3,
        });
    }
  }, [turns, threadDesignator, functionName]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://github.com/jscad/OpenJSCAD.org" target="_blank">
          <img src={jscadLogo} className="logo" alt="JSCAD logo" />
        </a>
      </div>
      <h1>Vite + React + JSCAD</h1>
      <JSCADViewer solids={solids} />
      <div className="card">
        <select
          value={threadDesignator}
          onChange={(e) =>
            setThreadDesignator(e.target.value as ThreadDesignator)
          }
        >
          {THREAD_TABLE.map(([threadName]) => (
            <option key={threadName} value={threadName}>
              {threadName}
            </option>
          ))}
        </select>
        <select
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value as "thread" | "bolt")}
        >
          <option value="thread">thread()</option>
          <option value="bolt">bolt()</option>
          <option value="nut">nut()</option>
        </select>
        <button onClick={() => setTurns((length) => length + 1)}>
          length is {turns}
        </button>
        <p>
          Edit <code>lib/main.ts</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite, React, and JSCAD logos to learn more
      </p>
      <a href="https://vitejs.dev/guide/build#library-mode" target="_blank">
        Read the Vite Docs (Library Mode)
      </a>
    </>
  );
}

export default App;
