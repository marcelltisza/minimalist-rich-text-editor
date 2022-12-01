import { RichUtils, EditorState } from 'draft-js';
import { useState, useEffect } from 'react';
import ToggleButton from './ToggleButton';
import { saveEditorState } from '../utils';
import { INLINE_STYLE, BLOCK_TYPE } from '../constants';
import '../styles/Toolbar.css';

function Toolbar({ editorState, setEditorState }) {
  const [stylesAtCursor, setStylesAtCursor] = useState([]);
  const [currentBlockType, setCurrentBlockType] = useState('');

  useEffect(() => {
    const selection = editorState.getSelection();
    const styles = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getInlineStyleAt(selection.getStartOffset() - 1);
    setStylesAtCursor(styles);

    const type = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    setCurrentBlockType(type);
  }, [editorState]);

  function toggleBlockType(type) {
    setEditorState((editorState) =>
      RichUtils.toggleBlockType(editorState, type)
    );
  }

  return (
    <div className='toolbar'>
      {/* INLINE_STYLES */}
      <span className='toolbar-group'>
        {/* BOLD */}
        <ToggleButton
          onClick={() => {
            setEditorState((editorState) =>
              RichUtils.toggleInlineStyle(editorState, INLINE_STYLE.BOLD)
            );
          }}
          active={stylesAtCursor && stylesAtCursor.includes(INLINE_STYLE.BOLD)}
        >
          <i className='fa-solid fa-bold'></i>
        </ToggleButton>

        {/* ITALIC */}
        <ToggleButton
          onClick={() =>
            setEditorState((editorState) =>
              RichUtils.toggleInlineStyle(editorState, INLINE_STYLE.ITALIC)
            )
          }
          active={
            stylesAtCursor && stylesAtCursor.includes(INLINE_STYLE.ITALIC)
          }
        >
          <i className='fa-solid fa-italic'></i>
        </ToggleButton>

        {/* UNDERLINE */}
        <ToggleButton
          onClick={() =>
            setEditorState((editorState) =>
              RichUtils.toggleInlineStyle(editorState, INLINE_STYLE.UNDERLINE)
            )
          }
          active={
            stylesAtCursor && stylesAtCursor.includes(INLINE_STYLE.UNDERLINE)
          }
        >
          <i className='fa-solid fa-underline'></i>
        </ToggleButton>

        {/* STRIKETHROUGHT */}
        <ToggleButton
          onClick={() => {}}
          active={
            stylesAtCursor &&
            stylesAtCursor.includes(INLINE_STYLE.STRIKETHROUGH)
          }
        >
          <i className='fa-solid fa-strikethrough'></i>
        </ToggleButton>

        {/* HIGHLIGHT */}
        <ToggleButton
          onClick={() => {}}
          active={
            stylesAtCursor && stylesAtCursor.includes(INLINE_STYLE.HIGHLIGHT)
          }
        >
          <i className='fa-solid fa-highlighter'></i>
        </ToggleButton>
      </span>

      {/* HEADERS */}
      <span className='toolbar-group'>
        <ToggleButton
          onClick={() => toggleBlockType(BLOCK_TYPE.HEADER_ONE)}
          active={currentBlockType === BLOCK_TYPE.HEADER_ONE}
        >
          H1
        </ToggleButton>
        <ToggleButton
          onClick={() => toggleBlockType(BLOCK_TYPE.HEADER_TWO)}
          active={currentBlockType === BLOCK_TYPE.HEADER_TWO}
        >
          H2
        </ToggleButton>
        <ToggleButton
          onClick={() => toggleBlockType(BLOCK_TYPE.HEADER_THREE)}
          active={currentBlockType === BLOCK_TYPE.HEADER_THREE}
        >
          H3
        </ToggleButton>
        <ToggleButton
          onClick={() => toggleBlockType(BLOCK_TYPE.HEADER_FOUR)}
          active={currentBlockType === BLOCK_TYPE.HEADER_FOUR}
        >
          H4
        </ToggleButton>
        <ToggleButton
          onClick={() => toggleBlockType(BLOCK_TYPE.HEADER_FIVE)}
          active={currentBlockType === BLOCK_TYPE.HEADER_FIVE}
        >
          H5
        </ToggleButton>
      </span>

      {/* LISTS */}
      <span className='toolbar-group'>
        {/* UNORDERED */}
        <ToggleButton
          onClick={() => {}}
          active={currentBlockType === BLOCK_TYPE.UNORDERED_LIST_ITEM}
        >
          <i className='fa-solid fa-list'></i>
        </ToggleButton>

        {/* ORDERED */}
        <ToggleButton
          onClick={() => {}}
          active={currentBlockType === BLOCK_TYPE.ORDERED_LIST_ITEM}
        >
          <i className='fa-solid fa-list-ol'></i>
        </ToggleButton>
      </span>

      {/* UNDO_REDO */}
      <span className='toolbar-group'>
        <button
          className='button'
          onClick={() => {
            setEditorState((editorState) => EditorState.undo(editorState));
          }}
        >
          <i className='fa-solid fa-arrow-rotate-left'></i>
        </button>
        <button
          className='button'
          onClick={() => {
            setEditorState((editorState) => EditorState.redo(editorState));
          }}
        >
          <i className='fa-solid fa-arrow-rotate-right'></i>
        </button>
      </span>

      {/* SAVE */}
      <button
        className='button save'
        onClick={() => saveEditorState(editorState)}
      >
        <i className='fa-solid fa-floppy-disk'></i>
      </button>
    </div>
  );
}

export default Toolbar;
