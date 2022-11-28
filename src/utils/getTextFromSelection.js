export function getTextFromSelection(editorState) {
  const selection = editorState.getSelection();
  if (selection.isCollapsed()) {
    return '';
  }
  const content = editorState.getCurrentContent();
  const blockText = content.getBlockForKey(selection.getStartKey()).getText();
  return blockText.slice(selection.anchorOffset, selection.focusOffset);
}
