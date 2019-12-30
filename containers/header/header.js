import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from 'next/link';
// import PropTypes from 'prop-types';
import styles from './styles.scss';

const Header = () => (
  <div className={cx(styles.header)} >
    <Link href="/?frame=contact-us" >
      <a >Contact Us</a >
    </Link >
  </div >
);

Header.propTypes = {};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Header);
