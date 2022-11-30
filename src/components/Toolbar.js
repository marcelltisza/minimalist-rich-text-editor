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

  function toggleInlineStyle(style) {
    setEditorState((editorState) =>
      RichUtils.toggleInlineStyle(editorState, style)
    );
  }

  function toggleBlockType(type) {
    setEditorState((editorState) =>
      RichUtils.toggleBlockType(editorState, type)
    );
  }

  return (
    <div className='toolbar'>
      <span className='toolbar-group'>
        <ToggleButton
          onClick={(e) => {
            toggleInlineStyle(INLINE_STYLE.BOLD);
          }}
          active={stylesAtCursor && stylesAtCursor.includes(INLINE_STYLE.BOLD)}
        >
          <i className='fa-solid fa-bold'></i>
        </ToggleButton>
        <ToggleButton
          onClick={() => toggleInlineStyle(INLINE_STYLE.ITALIC)}
          active={
            stylesAtCursor && stylesAtCursor.includes(INLINE_STYLE.ITALIC)
          }
        >
          <i className='fa-solid fa-italic'></i>
        </ToggleButton>
        <ToggleButton
          onClick={() => toggleInlineStyle(INLINE_STYLE.UNDERLINE)}
          active={
            stylesAtCursor && stylesAtCursor.includes(INLINE_STYLE.UNDERLINE)
          }
        >
          <i className='fa-solid fa-underline'></i>
        </ToggleButton>
        <ToggleButton
          onClick={() => toggleInlineStyle(INLINE_STYLE.STRIKETHROUGH)}
          active={
            stylesAtCursor &&
            stylesAtCursor.includes(INLINE_STYLE.STRIKETHROUGH)
          }
        >
          <i className='fa-solid fa-strikethrough'></i>
        </ToggleButton>
        <ToggleButton
          onClick={() => toggleInlineStyle(INLINE_STYLE.HIGHLIGHT)}
          active={
            stylesAtCursor && stylesAtCursor.includes(INLINE_STYLE.HIGHLIGHT)
          }
        >
          <i className='fa-solid fa-highlighter'></i>
        </ToggleButton>
      </span>
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
      <span className='toolbar-group'>
        <ToggleButton
          onClick={() => toggleBlockType(BLOCK_TYPE.UNORDERED_LIST_ITEM)}
          active={currentBlockType === BLOCK_TYPE.UNORDERED_LIST_ITEM}
        >
          <i className='fa-solid fa-list'></i>
        </ToggleButton>
        <ToggleButton
          onClick={() => toggleBlockType(BLOCK_TYPE.ORDERED_LIST_ITEM)}
          active={currentBlockType === BLOCK_TYPE.ORDERED_LIST_ITEM}
        >
          <i className='fa-solid fa-list-ol'></i>
        </ToggleButton>
      </span>
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
