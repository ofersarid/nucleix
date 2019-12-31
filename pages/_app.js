import React from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { fromJS } from 'immutable';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import '../lib/tippy.scss';
import combined from '../combined-reducers';
import { reactor, device } from '../services';
import { Card } from '../shared';
// import { Header } from '../containers';
import styles from './styles.scss';

const makeStore = (initialState, options) => {
  const store = createStore(combined, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
  return store;
};

class MyApp extends App {
  static async getInitialProps({ ctx }) {
    if (ctx.req) {
      const data = await reactor.getData('v6gp9S6PsAdgwMr1v0oDdbB7ylb2');
      ctx.store.dispatch(reactor.actions.storeData(data));
      ctx.store.dispatch(device.actions.ssr(ctx.req.headers['user-agent']));
    }
    return {};
  }

  componentDidMount() {
    const { data } = this.props;
    reactor.preloadImages(data.toJS());
  }

  render() {
    const { Component, pageProps, store, isServer } = this.props;
    return (
      <Provider store={store} >

        {/*<Header />*/}
        <div className={styles.stage} >
          <Component {...pageProps} isServer={isServer} />
        </div >
        <Card
          logo="/static/images/logo.svg"
          firstLine="Lorem Ipsum"
          secondLine="Lorem Ipsum"
          thirdLine="Lorem Ipsum"
        />
      </Provider >
    );
  }
}

export default compose(
  withRedux(makeStore, {
    serializeState: state => state.toJS(),
    deserializeState: state => fromJS(state)
  }),
  connect(state => ({
    data: reactor.selectors.data(state)
  })),
  device.HOC
)(MyApp);
