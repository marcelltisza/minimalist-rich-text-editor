import { convertToRaw } from 'draft-js';

export function saveEditorState(editorState) {
  const raw = convertToRaw(editorState.getCurrentContent());
  console.log(raw);
  console.log('saved document...');
}
