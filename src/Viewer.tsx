import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ViewerCore from './ViewerCore';
import ViewerProps from './ViewerProps';

export default React.forwardRef((props: ViewerProps, ref) => {
  const [ container, setContainer ] = React.useState(props.container);
  const [ init, setInit ] = React.useState(false);

  React.useEffect(() => {
    if (props.visible && !init) {
      setInit(true);
    }
  }, [props.visible, init]);

  if (!container) {
    const defaultContainer = document.createElement('div');
    document.body.appendChild(defaultContainer);
    setContainer(defaultContainer);
  }

  React.useEffect(() => {
    if (props.container) {
      setContainer(props.container);
    }
  }, [props.container]);

  if (!init) {
    return null;
  }
  return ReactDOM.createPortal((
    <ViewerCore
      {...props}
    />
  ), container);
});
