import React from 'react';
import { connect } from 'react-redux'; // eslint-disable-line
import { compose } from 'redux';
import cx from 'classnames';
import { withRouter } from 'next/router';
import { ReactSVG } from 'react-svg';
import { Tooltip } from 'react-tippy';
import autoBind from 'auto-bind';
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
      showFilter: false
    };
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
    console.log(data);
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
