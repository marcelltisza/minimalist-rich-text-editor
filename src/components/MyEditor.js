import React, { useEffect, useRef, useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import '../../node_modules/draft-js/dist/Draft.css';
import '../styles/MyEditor.css';
import Toolbar from './Toolbar';

function MyEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const domEditor = useRef();

  useEffect(() => {
    domEditor.current.focus();
  }, []);

  return (
    <div className='editor-container'>
      <Toolbar
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <div className='editor'>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder={'Enter text...'}
          ref={domEditor}
        />
      </div>
    </div>
  );
}

export default MyEditor;
