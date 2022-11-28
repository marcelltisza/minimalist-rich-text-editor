import { CompositeDecorator, DraftDecorator } from 'draft-js';
import { findWithRegex } from '../../utils';

function getMentionDecorator(createEntity) {
  function MentionInProgress(props) {
    return (
      <span
        style={{
          backgroundColor: 'grey',
          fontWeight: 'bold',
        }}
      >
        {props.children}
      </span>
    );
  }

  function MentionFinished(props) {
    console.log(props);
    return (
      <span
        style={{
          backgroundColor: 'yellow',
          fontWeight: 'bold',
        }}
      >
        {props.children}
      </span>
    );
  }

  const MentionDecorator = new CompositeDecorator([
    {
      strategy: (contentBlock, callback) => {
        const text = contentBlock.getText();
        let match, start, end;
        const regex = new RegExp(/@\w*\w(?=\s)/g);
        while ((match = regex.exec(text)) !== null) {
          start = match.index;
          end = start + match[0].length;
          const existingEntity = contentBlock.getEntityAt(start);
          if (!existingEntity) {
            createEntity(start, end, {
              type: 'MENTION',
              mutability: 'IMMUTABLE',
              data: Math.random(),
            });
          }

          callback(start, end);
        }
      },
      component: MentionFinished,
    },
    {
      strategy: (contentBlock, callback) => {
        const text = contentBlock.getText();
        let match, start, end;
        const regex = new RegExp(/@\w*\w(?!\s)/g);
        while ((match = regex.exec(text)) !== null) {
          start = match.index;
          end = start + match[0].length;
          callback(start, end);
        }
      },
      component: MentionInProgress,
    },
  ]);

  return MentionDecorator;
}

export default getMentionDecorator;
