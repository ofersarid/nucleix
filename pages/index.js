import React from 'react';
import { useSelector, connect } from 'react-redux'; // eslint-disable-line
import { compose } from 'redux';
// import cx from 'classnames';
import { withRouter } from 'next/router';
import styles from './index.scss';
import { Head } from '../containers';
// import { reactor, device } from '../services';

class Index extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    // const { router } = this.props;
    // const data = useSelector(state => reactor.selectors.pageData(state, 'test page'));
    // const isMobile = useSelector(device.selectors.type) === 'mobile';

    return (
      <div className={styles.pageContainer} >
        <Head />
        Clinical Page
      </div >
    );
  }
}

export default compose(withRouter, connect())(Index);
