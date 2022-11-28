import { CompositeDecorator, ContentBlock } from 'draft-js';
import { findEntities } from '../../utils';
import '../../styles/CustomEntity.css';

function CustomEntity(props) {
  return <sapn className='custom-entity'>[{props.children}]</sapn>;
}

const CustomEntityDecorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback, contentState) => {
      findEntities('TOKEN', contentBlock, callback, contentState);
    },
    component: CustomEntity,
  },
]);

export default CustomEntityDecorator;
