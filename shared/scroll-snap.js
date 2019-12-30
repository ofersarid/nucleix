import { Component } from 'react';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import { device } from '../services';

const THRESHOLD = 20;

class ScrollSnap extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.lock = false;
  }

  componentDidMount() {
    const { router, frames } = this.props;
    const frame = parseInt(router.query.frame);
    if (!frame || frame > frames.length) {
      this.navigate(frames[0]);
    }
    this.$node = document.getElementById('__next');
    this.$node.addEventListener('wheel', this.mouseScrollHandler, true);
    this.$node.addEventListener('touchstart', this.touchStartHandler, true);
    this.$node.addEventListener('touchend', this.touchEndHandler, true);
    this.$node.addEventListener('touchmove', this.touchMoveHandler, true);
    window.addEventListener('keydown', this.onkeypress, true);
  }

  componentWillUnmount() {
    this.$node.removeEventListener('wheel', this.mouseScrollHandler, true);
    this.$node.removeEventListener('touchstart', this.touchStartHandler, true);
    this.$node.removeEventListener('touchend', this.touchEndHandler, true);
    this.$node.removeEventListener('touchmove', this.touchMoveHandler, true);
    window.removeEventListener('keydown', this.onkeypress, true);
  }

  onkeypress(e) {
    switch (e.keyCode) {
      case 37: // left
        break;
      case 38: // up
        this.prev();
        break;
      case 39: // right
        break;
      case 40: // down
        this.next();
        break;
      default:
        break;
    }
  }

  snap(direction) {
    const { bizCard } = this.props;
    if (this.lock || bizCard) return;
    this.lock = true;
    switch (direction) {
      case -1:
        this.next();
        break;
      case 1:
        this.prev();
        break;
      default:
        break;
    }
  }

  mouseScrollHandler(e) {
    clearTimeout(this.to);
    const delta = e.wheelDelta;
    if (Math.abs(delta) > THRESHOLD) {
      this.snap(delta < 0 ? -1 : 1);
    }
    this.to = setTimeout(() => {
      this.lock = false;
    }, 100);
  };

  touchStartHandler(e) {
    this.lock = false;
    this.yDown = e.touches[0].clientY;
    this.xDown = e.touches[0].clientX;
  };

  touchEndHandler(e) {
    this.yDown = null;
    this.xDown = null;
  }

  touchMoveHandler(e) {
    let yUp = e.touches[0].clientY;
    // let xUp = e.touches[0].clientX;
    // let deltaX = (this.xDown - xUp);
    // if (deltaX > 2) return;
    let deltaY = (this.yDown - yUp);
    if (Math.abs(deltaY) > THRESHOLD) {
      this.snap(deltaY > 0 ? -1 : 1);
    }
  };

  next() {
    const { disableNext, router, frames } = this.props;
    const frame = router.query.frame;
    const i = frames.indexOf(frame);
    if (disableNext) return;
    if (i + 1 < frames.length) {
      this.navigate(frames[i + 1]);
    }
  };

  prev() {
    const { disablePrev, router, frames } = this.props;
    const frame = router.query.frame;
    const i = frames.indexOf(frame);
    if (disablePrev) return;
    if (i - 1 >= 0) {
      this.navigate(frames[i - 1]);
    }
  };

  navigate(index) {
    const { router } = this.props;
    router.push(`${router.pathname}?frame=${index}`);
  }

  render() {
    return null;
  }
}

export default compose(
  withRouter,
  connect(state => ({
    bizCard: device.selectors.type(state) === 'mobile' && device.selectors.orientation(state) === 'landscape'
  }))
)(ScrollSnap);
