import { CompositeDecorator } from 'draft-js';
import '../../styles/Link.css';
import { findWithRegex } from '../../utils';

function Link({ children }) {
  return (
    <a
      href={children}
      onClick={(e) => {
        const url = e.target.innerText;
        console.log(children);
        if (!url.startsWith('http')) {
          window.open(`http://${url}`, '_blank');
        } else {
          window.open(url, '_blank');
        }
      }}
    >
      {children}
    </a>
  );
}

const LinkDecorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback) => {
      findWithRegex(
        /(https?:\/\/)?www\.(\w+\.)+(com|hu|org)/gi,
        contentBlock,
        callback
      );
    },
    component: Link,
  },
]);

export default LinkDecorator;
