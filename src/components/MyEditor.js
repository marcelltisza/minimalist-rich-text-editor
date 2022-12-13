import React, { useEffect, useRef, useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "../../node_modules/draft-js/dist/Draft.css";
import "../styles/MyEditor.css";
import Toolbar from "./Toolbar";
import { saveEditorState } from "../utils";

function MyEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const domEditor = useRef();

  useEffect(() => {
    focusToEditor();
  }, []);

  function focusToEditor() {
    domEditor.current.focus();
  }

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: "yellow",
    },
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <Toolbar
          editorState={editorState}
          setEditorState={setEditorState}
          focusToEditor={focusToEditor}
        />
      </div>
      <div className="editor" onClick={focusToEditor}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Write something..."
          ref={domEditor}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
}

export default MyEditor;
