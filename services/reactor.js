import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
import firebase from 'firebase/app';
import camelCase from 'lodash/camelCase';
import { fromJS } from 'immutable';

const structuredData = {
  collections: {},
  pages: {}
};

const STORE_DATA = 'REACTOR/STORE_DATA';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyCVoJ1fNik-brXSirPwXfzEzpK4HDJyIdE',
    authDomain: 'reactor-dam.firebaseapp.com',
    databaseURL: 'https://reactor-dam.firebaseio.com',
    projectId: 'reactor-dam',
    storageBucket: 'reactor-dam.appspot.com',
    messagingSenderId: '198256799515'
  });
}

const preloadImages = data => {
  const images = [];
  Object.keys(data.collections).forEach(key => {
    data.collections[key].forEach(itm => {
      Object.keys(itm).forEach(itmKey => {
        const isImg = itmKey.toLowerCase().match(/^pic--/) &&
          itm[itmKey].toLowerCase().match(/^https?:\/\//);
        if (isImg && !images.includes(itm[itmKey])) {
          images.push(itm[itmKey]);
        }
      });
    });
  });
  Object.keys(data.pages).forEach(key => {
    Object.keys(data.pages[key]).forEach(itmKey => {
      const isImg = itmKey.toLowerCase().match(/\b(\w*pic--\w*)\b/) &&
        data.pages[key][itmKey].match && data.pages[key][itmKey].toLowerCase().match(/^https?:\/\//);
      if (isImg && !images.includes(data.pages[key][itmKey])) {
        images.push(data.pages[key][itmKey]);
      }
    });
  });
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

const getData = async (userId) => {
  const db = firebase.firestore();
  const user = await db.collection('users').doc(userId).get();
  const userData = await user.data();
  if (userData.collections) {
    for (const id of userData.collections) {
      const item = await db.collection('collections').doc(id).get();
      const data = await item.data();
      structuredData.collections[camelCase(data.name)] = [];
      const assets = await db.collection('collections').doc(id).collection('data').get();
      assets.docs.forEach(asset => {
        structuredData.collections[camelCase(data.name)].push({
          id: asset.id,
          ...asset.data()
        });
      });
    }
  }
  if (userData.pages) {
    for (const id of userData.pages) {
      const item = await db.collection('pages').doc(id).get();
      const data = await item.data();
      structuredData.pages[camelCase(data.name)] = data.data;
    }
  }
  return structuredData;
};

const camelize = str => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
};

const reducer = (state = fromJS({
  collections: {},
  pages: {}
}), action) => {
  switch (action.type) {
    case STORE_DATA:
      return fromJS(action.payload);
    default:
      return state;
  }
};

const actions = {
  fetch: userId => async dispatch => {
    const data = await getData(userId);
    dispatch({
      type: STORE_DATA,
      payload: data
    });
  },
  storeData: data => ({
    type: STORE_DATA,
    payload: data
  })
};

const selectors = {
  collectionData: (state, name) => state.getIn(['reactor', 'collections', name]),
  pageData: (state, name) => state.getIn(['reactor', 'pages', camelize(name)]),
  data: (state) => state.get('reactor')
};

export default {
  getData,
  actions,
  reducer,
  selectors,
  preloadImages
};
