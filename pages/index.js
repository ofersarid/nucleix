import React from 'react';
import { connect } from 'react-redux'; // eslint-disable-line
import { compose } from 'redux';
import cx from 'classnames';
import { withRouter } from 'next/router';
import { ReactSVG } from 'react-svg';
import { Tooltip } from 'react-tippy';
import Fade from 'react-reveal/Fade';
import autoBind from 'auto-bind';
import moment from 'moment';
import styles from './index.scss';
import { Head } from '../containers';
import { reactor } from '../services';

class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.FILTERS = ['All Products', 'Bladder EpiCheck', 'Lung EpiCheck', 'Other'];
    this.state = {
      filter: this.FILTERS[0],
      showFilter: false,
      scrolling: 'down'
    };
    this.lastScrollTop = 0;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.setScrollDirection);
  }

  setScrollDirection() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop) {
      this.setState({ scrolling: 'down' });
    } else {
      this.setState({ scrolling: 'up' });
    }
    this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  }

  hideFilterMenu() {
    this.setState({ showFilter: false });
  }

  setFilter(e) {
    e.stopPropagation();
    const txt = e.currentTarget.childNodes[0].nodeValue;
    this.setState({ filter: txt });
    this.hideFilterMenu();
  }

  toggleDropMenu() {
    const { showFilter } = this.state;
    this.setState({ showFilter: !showFilter });
  }

  render() {
    const { data } = this.props;
    // const isMobile = useSelector(device.selectors.type) === 'mobile';
    const { filter, showFilter } = this.state;
    return (
      <div className={styles.pageContainer} >
        <Head title="Clinical - Nucleix" />
        <h3 >FILTER DATA</h3 >
        <Tooltip
          trigger="click"
          interactive
          open={showFilter}
          animateFill={false}
          position="bottom"
          className={cx(styles.dropMenuTrigger)}
          html={(
            <ul className={cx(styles.menu)} >
              {this.FILTERS.map(fltr => (
                <li key={fltr} onClick={this.setFilter} >{fltr}</li >
              ))}
            </ul >
          )}
          onRequestClose={this.hideFilterMenu}
        >
          <div className={cx(styles.triggerContainer, { [styles.open]: showFilter })} onClick={this.toggleDropMenu} >
            {filter}
            <ReactSVG src="/static/images/chevron.svg" />
          </div >
        </Tooltip >
        <ul className={styles.postList} >
          <Fade big cascade >
            {data.map(post => {
              const date = post.get('date').toDate ? post.get('date').toDate() : (post.getIn(['date', 'seconds']) * 1000);
              return (
                <li key={post.get('id')} className={styles.postItem} >
                  <div className={styles.left} >
                    <div >{moment(date).format('D, MMM')}</div >
                    <div className={styles.year} >{moment(date).format('YYYY')}</div >
                  </div >
                  <div className={styles.right} >
                    <img className={styles.pic} src={post.get('pic--')} />
                    <h4 className={styles.description} >{post.get('desscription')}</h4 >
                    <div className={styles.authors} >{post.get('outhors')}</div >
                    <a
                      className={styles.readeMoreLink}
                      href={post.get('link')}
                      target="_blank"
                      rel="noopener noreferrer" >
                      read more
                      <ReactSVG src="/static/images/chevron.svg" />
                    </a >
                  </div >
                </li >
              );
            })}
          </Fade >
        </ul >
      </div >
    );
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      data: reactor.selectors.collectionData(state, 'clinical')
    })
  ))(Index);
