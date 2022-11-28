import { BLOCK_TYPE, VISIBILITY, COMMAND } from './constants';
import { saveEditorState } from './utils';
import {
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  EditorState,
} from 'draft-js';

function getKeyBindings(editorState, setEditorState, setSearchVisibility) {
  function myKeyBindingFn(e) {
    if (e.key === 's' && KeyBindingUtil.hasCommandModifier(e)) {
      return COMMAND.SAVE;
    } else if (e.keyCode === 32) {
      const selection = editorState.getSelection();
      const text = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getText();
      if (text[0] === '*') {
        return COMMAND.START_UNORDERED_LIST;
      } else if (text.slice(0, 2) === '1.') {
        return COMMAND.START_ORDERED_LIST;
      } else {
        return getDefaultKeyBinding(e);
      }
    } else if (e.key === 'k' && KeyBindingUtil.hasCommandModifier(e)) {
      return COMMAND.ENTITY;
    } else if (e.key === 'f' && KeyBindingUtil.hasCommandModifier(e)) {
      e.preventDefault();
      return COMMAND.FIND;
    } else if (e.keyCode === 9) {
      e.preventDefault();
      const newState = RichUtils.onTab(e, editorState, 4);
      setEditorState(newState);
      return COMMAND.TAB;
    }
    return getDefaultKeyBinding(e);
  }

  function handleKeyCommand(command, editorState) {
    if (command === COMMAND.SAVE) {
      saveEditorState(editorState);
      return COMMAND.HANDLED;
    }

    if (command === COMMAND.START_UNORDERED_LIST) {
      const newEditorState = RichUtils.toggleBlockType(
        editorState,
        BLOCK_TYPE.UNORDERED_LIST_ITEM
      );
      const selection = newEditorState.getSelection();
      const contentState = newEditorState.getCurrentContent();
      const block = contentState.getBlockForKey(selection.getStartKey());
      const blockSelection = selection.merge({
        anchorOffset: 0,
        focusOffset: block.getLength(),
      });
      const newContentState = Modifier.replaceText(
        contentState,
        blockSelection,
        ''
      );
      setEditorState(EditorState.push(newEditorState, newContentState));

      return COMMAND.HANDLED;
    }

    if (command === COMMAND.START_ORDERED_LIST) {
      const newEditorState = RichUtils.toggleBlockType(
        editorState,
        BLOCK_TYPE.ORDERED_LIST_ITEM
      );
      const selection = newEditorState.getSelection();
      const contentState = newEditorState.getCurrentContent();
      const block = contentState.getBlockForKey(selection.getStartKey());
      const blockSelection = selection.merge({
        anchorOffset: 0,
        focusOffset: block.getLength(),
      });
      const newContentState = Modifier.replaceText(
        contentState,
        blockSelection,
        ''
      );
      setEditorState(EditorState.push(newEditorState, newContentState));
      return COMMAND.HANDLED;
    }

    if (command === COMMAND.FIND) {
      setSearchVisibility((visibility) =>
        visibility === VISIBILITY.VISIBLE
          ? VISIBILITY.HIDDEN
          : VISIBILITY.VISIBLE
      );
    }

    if (command === COMMAND.TAB) {
      return COMMAND.HANDLED;
    }

    if (command === COMMAND.ENTITY) {
      const selectionState = editorState.getSelection();
      if (selectionState.isCollapsed()) {
        return COMMAND.HANDLED;
      }

      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'TOKEN',
        'IMMUTABLE'
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      const newEditorState = EditorState.set(editorState, {
        currentContent: Modifier.applyEntity(
          contentStateWithEntity,
          selectionState,
          entityKey
        ),
      });

      setEditorState(newEditorState);
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return COMMAND.HANDLED;
    }
    return COMMAND.NOT_HANDLED;
  }

  return [myKeyBindingFn, handleKeyCommand];
}

export default getKeyBindings;
