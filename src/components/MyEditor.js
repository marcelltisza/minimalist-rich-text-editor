import React, { useEffect, useRef, useState } from 'react';
import { CompositeDecorator, Editor, EditorState, Modifier } from 'draft-js';
import '../../node_modules/draft-js/dist/Draft.css';
import '../styles/MyEditor.css';
import SearchAndReplace from './SearchAndReplace';
import LinkDecorator from './decorators/Link';
import CustomEntityDecorator from './decorators/CustomEntity';
import Toolbar from './Toolbar';
import styleMap from '../styles/styleMap';
import { VISIBILITY } from '../constants';
import getKeyBindings from '../KeyBindings';

function MyEditor() {
  const [searchVisibility, setSearchVisibility] = useState(VISIBILITY.HIDDEN);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const domEditor = useRef();
  const [myKeyBindingFn, handleKeyCommand] = getKeyBindings(
    editorState,
    setEditorState,
    setSearchVisibility
  );

  useEffect(() => {
    domEditor.current.focus();
  }, []);

  useEffect(() => {
    if (searchVisibility === VISIBILITY.VISIBLE) {
      turnOffDecorators();
    } else {
      turnOnDecorators();
    }
  }, [searchVisibility]);

  useEffect(() => {
    editorState.getCurrentContent();
  }, [editorState]);

  function turnOffDecorators() {
    setEditorState(
      EditorState.set(editorState, {
        decorator: null,
      })
    );
  }

  function turnOnDecorators() {
    setEditorState(
      EditorState.forceSelection(
        EditorState.set(editorState, {
          decorator: CustomEntityDecorator,
        }),
        editorState.getSelection()
      )
    );
  }

  return (
    <div className='editor-container'>
      <Toolbar
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <div className='editor'>
        <SearchAndReplace
          editorState={editorState}
          setEditorState={setEditorState}
          visibility={searchVisibility}
        />
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={myKeyBindingFn}
          placeholder={'Enter text...'}
          ref={domEditor}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
}

export default MyEditor;
