import React, { useEffect, useRef, useState } from "react";
import {
  CompositeDecorator,
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

    const contentStateWithEntity = contentState.createEntity(
      "TOKEN",
      "IMMUTABLE",
      Math.random()
    );

    editorState
      .getCurrentContent()
      .getBlockMap()
      .forEach((block) => {
        const text = block.getText();
        const regex = /(https?:\/\/)?www\.(\w+\.)+(com|hu|org)/gi;
        let match;
        while ((match = regex.exec(text))) {
          let start = match.index;
          let end = start + match[0].length;
          callback(start, end, block);
        }
      });

    setEditorState(
      EditorState.forceSelection(
        EditorState.set(editorState, { decorator: decorators }),
        editorState.getSelection()
      )
    );
  }, []);

  function callback(start, end, block) {
    const selectionState
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

  // function stringifyEvent(e) {
  //   const obj = {};
  //   for (let k in e) {
  //     obj[k] = e[k];
  //   }
  //   return JSON.stringify(
  //     obj,
  //     (k, v) => {
  //       if (v instanceof Node) return "Node";
  //       if (v instanceof Window) return "Window";
  //       return v;
  //     },
  //     " "
  //   );
  // }

  // const handleKeyCommandModified = (command, editorState) => {
  //   const commandArray = command.split(";");
  //   const realCommand = commandArray[0];
  //   console.log(realCommand);
  //   console.log(commandArray[1]);
  //   console.log(commandArray[2]);
  //   if (realCommand === COMMAND.TAB) {
  //     const event = JSON.parse(commandArray[1]);
  //     setEditorState(RichUtils.onTab(event, editorState, 4));
  //     return COMMAND.HANDLED;
  //   }
  // };

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

  const entityDecorator = {
    strategy: (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === "TOKEN"
        );
      }, callback);
    },
    component: (props) => {
      console.log("lefutott az entity");
      return <span className="custom-entity">[{props.children}]</span>;
    },
  };

  const decorators = new CompositeDecorator([linkDecorator, entityDecorator]);

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
