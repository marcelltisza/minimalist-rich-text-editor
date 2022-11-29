import React, { useState } from 'react';
import { Editor, EditorState, getDefaultKeyBinding, RichUtils } from 'draft-js';
import '../../node_modules/draft-js/dist/Draft.css';
// import '../styles/MyEditor.css';

function MyEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const myKeyBindingFn = (e) => getDefaultKeyBinding(e);
  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  return (
    <div className='editor'>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        // handleKeyCommand={handleKeyCommand}
        // keyBindingFn={myKeyBindingFn}
        // placeholder={'Enter text...'}
      />
    </div>
  );
}

export default MyEditor;
