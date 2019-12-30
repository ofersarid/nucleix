import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import autoBind from 'auto-bind';
import styles from './styles.scss';

class DynamicFontBox extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.fontBox = React.createRef();
  }

  bindEvents() {
    window.addEventListener('orientationchange', this.resize, true);
    window.addEventListener('resize', this.resize, true);
  }

  unbindEvents() {
    window.removeEventListener('orientationchange', this.resize, true);
    window.removeEventListener('resize', this.resize, true);
  }

  componentDidMount() {
    this.bindEvents();
    const firstChildEl = this.fontBox.current.firstElementChild;
    const fontSize = window.getComputedStyle(firstChildEl, null).getPropertyValue('font-size');
    this.orignalSize = parseInt(fontSize);
    this.resize();
  }

  componentWillUnmount() {
    this.unbindEvents();
  }

  resize(prevOverflow) {
    const el = this.fontBox.current;
    const overflow = Math.floor(el.scrollHeight) > Math.ceil(el.getBoundingClientRect().height);
    if (typeof prevOverflow !== 'boolean' || overflow || (!overflow && !prevOverflow)) {
      const children = Array.from(el.children);
      const fontSize = parseInt(window.getComputedStyle(children[0]).fontSize);
      const newSize = fontSize + (overflow ? -1 : 1);
      // children[0].style.fontSize = `${Math.min(newSize, this.orignalSize)}px`;
      children.forEach(node => {
        node.style.fontSize = `${Math.min(fontSize + (overflow ? -1 : 1), this.orignalSize)}px`;
      });
      if (newSize < this.orignalSize) {
        this.resize(overflow);
      }
    }
  }

  render() {
    const { children, className } = this.props;
    return (
      <div className={cx(styles.dynamicFontBox, className)} ref={this.fontBox} >{children}</div >
    );
  }
}

export default compose()(DynamicFontBox);
