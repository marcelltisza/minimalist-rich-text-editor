import React, { useEffect, useRef, useState } from "react";
import {
  CompositeDecorator,
  SelectionState,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  RichUtils,
} from "draft-js";
import "../../node_modules/draft-js/dist/Draft.css";
import "../styles/MyEditor.css";
import Toolbar from "./Toolbar";
import { COMMAND } from "../constants";
import "../styles/Link.css";
import "../styles/CustomEntity.css";

function MyEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const domEditor = useRef();

  useEffect(() => {
    focusToEditor();

    // setEditorState(EditorState.set(editorState, { decorator: decorators }));

    setEditorState(
      EditorState.forceSelection(
        EditorState.set(editorState, { decorator: decorators }),
        editorState.getSelection()
      )
    );
  }, []);

  useEffect(() => {
    editorState
      .getCurrentContent()
      .getBlockMap()
      .map((block) => {
        const text = block.getText();
        const regex = /(https?:\/\/)?www\.(?<shortLink>(\w+))\.(com|hu|org)/gi;
        let match;
        while ((match = regex.exec(text))) {
          let start = match.index;
          let end = start + match[0].length;
          callback(start, end, block, match);
        }
      });
  }, [editorState]);

  function callback(start, end, block, match) {
    const selectionState = SelectionState.createEmpty(block.getKey()).merge({
      anchorOffset: start,
      focusOffset: end,
    });
    let contentState = editorState.getCurrentContent();

    const oldText = block.getText().slice(start, end + 1);

    const replace = match.groups.shortLink;
    const newContentState = Modifier.replaceText(
      contentState,
      selectionState,
      replace
    );

    const contentStateWithEntity = newContentState.createEntity(
      "LINK",
      "IMMUTABLE",
      oldText
    );

    // return EditorState.push(editorState, currentContent);

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newSelectionState = SelectionState.createEmpty(block.getKey()).merge({
      anchorOffset: start,
      focusOffset: replace.length,
    });

    const contentStateWithToken = Modifier.applyEntity(
      contentStateWithEntity,
      newSelectionState,
      entityKey
    );
    const merge = newSelectionState.merge({
      anchorOffset: newSelectionState.focusOffset,
      focusOffset: newSelectionState.focusOffset,
    });
    setEditorState(
      EditorState.forceSelection(
        EditorState.set(editorState, { currentContent: contentStateWithToken }),
        newSelectionState.merge(merge)
      )
    );
  }

  function focusToEditor() {
    domEditor.current.focus();
  }

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: "yellow",
    },
  };

  const keyBindingFn = (e) => {
    if (e.keyCode === 9) {
      setEditorState(RichUtils.onTab(e, editorState, 4));
      return COMMAND.TAB;
      // return COMMAND.TAB + ";" + stringifyEvent(e);
    }

    if (e.key === "k" && KeyBindingUtil.hasCommandModifier(e)) {
      return COMMAND.ENTITY;
    }

    return getDefaultKeyBinding(e);
  };

  const handleKeyCommand = (command, editorState) => {
    if (command === COMMAND.TAB) {
      return COMMAND.HANDLED;
    }

    if (command === COMMAND.ENTITY) {
      const selectionState = editorState.getSelection();
      if (!selectionState.isCollapsed()) {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          "TOKEN",
          "IMMUTABLE",
          Math.random()
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        const contentStateWithToken = Modifier.applyEntity(
          contentStateWithEntity,
          selectionState,
          entityKey
        );

        setEditorState(
          EditorState.set(editorState, {
            currentContent: contentStateWithToken,
          })
        );
      }
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return COMMAND.HANDLED;
    }

    return COMMAND.NOT_HANDLED;
  };

  const linkDecorator = {
    strategy: (contentBlock, callback) => {
      const text = contentBlock.getText();
      const regex = /(https?:\/\/)?www\.(\w+\.)+(com|hu|org)/gi;
      let match;
      while ((match = regex.exec(text))) {
        let start = match.index;
        let end = start + match[0].length;
        callback(start, end);
      }
    },
    component: (props) => {
      const url = props.decoratedText.startsWith("http")
        ? props.decoratedText
        : `http://${props.decoratedText}`;
      return (
        <a href={url} onClick={() => window.open(url)}>
          {props.children}
        </a>
      );
    },
  };

  const linkEntityDecorator = {
    strategy: (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === "LINK"
        );
      }, callback);
    },
    component: (props) => {
      let url = props.contentState.getEntity(props.entityKey).getData();
      url = url.startsWith("http") ? url : `http://${url}`;
      // return <span className="custom-entity">[{props.children}]</span>;
      return (
        <a href={url} onClick={() => window.open(url)}>
          {props.children}
        </a>
      );
    },
  };

  const decorators = new CompositeDecorator([linkEntityDecorator]);

  return (
    <div className="editor-container">
      <div className="toolbar">
        <Toolbar editorState={editorState} setEditorState={setEditorState} />
      </div>
      <div className="editor" onClick={focusToEditor}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder={
            editorState.getCurrentContent().getBlockMap().first().getType() ===
            "unstyled"
              ? "Write something..."
              : ""
          }
          ref={domEditor}
          customStyleMap={styleMap}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
}

export default MyEditor;
