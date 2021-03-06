import React from 'react';
import { Provider } from 'react-redux';

import { NotificationProvider } from './utils/Alert';
import { Router } from './utils/Router';

import { hasWSProvider } from './utils/connector';
import store from './redux/store';

import { Login } from './layout';

const App = () => {
  const localSetUp = hasWSProvider();
  
  return (
    <Provider store={store}>
      <Router> 
        <Login local={localSetUp}/>
      </Router>
      <NotificationProvider/>
    </Provider>
  );
}

export default App;
