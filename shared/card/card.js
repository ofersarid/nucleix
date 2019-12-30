import React, { PureComponent } from 'react';
import styles from './styles.scss';

class Card extends PureComponent {
  render() {
    const { logo, firstLine, secondLine, thirdLine } = this.props;
    return (
      <div className={styles.bizCard} >
        <div className={styles.contentBox} >
          <div className={styles.logo} >
            <img src={logo} />
            <h2 >Sanoculis</h2 >
          </div >
          <ul className={styles.info} >
            <li >{firstLine}</li >
            <li >{secondLine}</li >
            <li >{thirdLine}</li >
          </ul >
        </div >
      </div >
    );
  }
}

export default Card;
