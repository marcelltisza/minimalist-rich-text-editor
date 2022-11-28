import {
  EditorState,
  CompositeDecorator,
  SelectionState,
  Modifier,
} from 'draft-js';
import { getTextFromSelection, findWithRegex } from '../utils';
import { useEffect, useState } from 'react';
import SearchHighlight from './decorators/SearchHighlight';
import { VISIBILITY } from '../constants';
import '../styles/SearchAndReplace.css';

function SearchAndReplace({ editorState, setEditorState, visibility }) {
  const [search, setSearch] = useState('');
  const [replace, setReplace] = useState('');

  useEffect(() => {
    if (visibility === VISIBILITY.HIDDEN) {
      setSearch('');
      setEditorState((editorState) =>
        EditorState.set(editorState, {
          decorator: generateDecorator(''),
          seleection: editorState.getSelection(),
        })
      );
      setReplace('');
    } else {
      const text = getTextFromSelection(editorState);
      setSearch(text);
      setEditorState((editorState) =>
        EditorState.set(editorState, { decorator: generateDecorator(text) })
      );
    }
  }, [visibility]);

  function onSearchChange(e) {
    setSearch(e.target.value);
    setEditorState((editorState) =>
      EditorState.set(editorState, {
        decorator: generateDecorator(e.target.value),
      })
    );
  }

  function generateDecorator(highlightTerm) {
    const regex = new RegExp(highlightTerm, 'g');
    return new CompositeDecorator([
      {
        strategy: (contentBlock, callback) => {
          if (highlightTerm !== '') {
            findWithRegex(regex, contentBlock, callback);
          }
        },
        component: SearchHighlight,
      },
    ]);
  }

  function onReplace() {
    if (search) {
      setEditorState((editorState) => {
        const regex = new RegExp(search, 'g');
        const selectionsToReplace = [];
        const blockMap = editorState.getCurrentContent().getBlockMap();

        blockMap.forEach((contentBlock) => {
          return findWithRegex(regex, contentBlock, (start, end) => {
            const blockKey = contentBlock.getKey();
            const blockSelection = SelectionState.createEmpty(blockKey).merge({
              anchorOffset: start,
              focusOffset: end,
            });

            selectionsToReplace.push(blockSelection);
          });
        });

        let currentContent = editorState.getCurrentContent();
        selectionsToReplace.forEach((selectionState) => {
          currentContent = Modifier.replaceText(
            currentContent,
            selectionState,
            replace
          );
        });

        return EditorState.push(editorState, currentContent);
      });
    }
  }

  return (
    <div
      className='search-and-replace'
      style={{
        visibility,
      }}
    >
      <input
        onChange={(e) => onSearchChange(e)}
        placeholder='Search...'
        value={search}
      />
      <input
        onChange={(e) => setReplace(e.target.value)}
        placeholder='Replace...'
        value={replace}
      />
      <button
        className='replace'
        onClick={onReplace}
      >
        Replace
      </button>
    </div>
  );
}

export default SearchAndReplace;
