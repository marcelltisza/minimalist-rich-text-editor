import { convertToRaw } from 'draft-js';
import axios from 'axios';

export function saveEditorState(editorState) {
  const raw = convertToRaw(editorState.getCurrentContent());
  axios.post('http://localhost:8000/save', {
    content: raw,
    state: editorState,
    selection: editorState.getSelection(),
  });
  console.log('saved document...');
}
