import * as React from 'react';
import './style/index.less';
import ViewerCanvas from './ViewerCanvas';
import ViewerNav from './ViewerNav';
import ViewerToolbar, { defaultToolbars } from './ViewerToolbar';
import ViewerProps, { ImageDecorator, ToolbarConfig } from './ViewerProps';
import Icon, { ActionType } from './Icon';
import * as constants from './constants';

function noop() { }

const transitionDuration = 300;

export interface ViewerCoreState {
  visible?: boolean;
  visibleStart?: boolean;
  transitionEnd?: boolean;
  activeIndex?: number;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  rotate?: number;
  imageWidth?: number;
  imageHeight?: number;
  scaleX?: number;
  scaleY?: number;
  loading?: boolean;
  loadFailed?: boolean;
}

export default React.forwardRef((props: ViewerProps, ref) => {
  const [ activeIndex, setActiveIndex ] = React.useState(props.activeIndex || 0);
  const [ visible, setVisible ] = React.useState(props.visible);

  React.useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  React.useEffect(() => {
    setActiveIndex(props.activeIndex);
  }, [props.activeIndex]);

  function handleChangeImg(newIndex: number) {
    if (!this.props.loop && (newIndex >= this.props.images.length || newIndex < 0)) {
      return;
    }
    if (newIndex >= this.props.images.length) {
      newIndex = 0;
    }
    if (newIndex < 0) {
      newIndex = this.props.images.length - 1;
    }
    if (newIndex === this.state.activeIndex) {
      return;
    }
    if (this.props.onChange) {
      const activeImage = this.getActiveImage(newIndex);
      this.props.onChange(activeImage, newIndex);
    }
    setActiveIndex(newIndex);
  }

  function getActiveImage(activeIndex2 = undefined) {
    let activeImg2: ImageDecorator = {
      src: '',
      alt: '',
      downloadUrl: '',
    };

    let images = props.images || [];
    let realActiveIndex = null;
    if (activeIndex2 !== undefined) {
      realActiveIndex = activeIndex2;
    } else {
      realActiveIndex = activeIndex;
    }
    if (images.length > 0 && realActiveIndex >= 0) {
      activeImg2 = images[realActiveIndex];
    }

    return activeImg2;
  }

  const zIndex = 1000;
  const prefixCls = 'react-viewer';

  let className = `${prefixCls} ${prefixCls}-transition`;
  if (props.container) {
    className += ` ${prefixCls}-inline`;
  }

  let viewerStryle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    display: (props.visible || visible) ? 'block' : 'none',
  };

  let activeImg: ImageDecorator = {
    src: '',
    alt: '',
  };

  if (props.visible) {
    activeImg = getActiveImage();
  }

  return (
    <div
      className={className}
      style={viewerStryle}
      onTransitionEnd={() => {
        console.log(props.visible);
      }}
    >
      <div className={`${prefixCls}-mask`} style={{ zIndex: zIndex }} />
      {props.noClose || (
        <div
          className={`${prefixCls}-close ${prefixCls}-btn`}
          onClick={() => {
            props.onClose();
          }}
          style={{ zIndex: zIndex + 10 }}
        >
          <Icon type={ActionType.close} />
        </div>
      )}
      {props.noFooter || (
        <div className={`${prefixCls}-footer`} style={{ zIndex: zIndex + 5 }}>
          {props.noNavbar || (
            <ViewerNav
              prefixCls={prefixCls}
              images={props.images}
              activeIndex={activeIndex}
              onChangeImg={handleChangeImg}
            />
          )}
        </div>
      )}
    </div>
  );
});
