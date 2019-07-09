import React from 'react';
import ReactDOM from 'react-dom';
import App from './Pages/app';
import './Assets/Css/style.scss';
// import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/lib/integration/react'
// import { store, persistor } from "@redux/store"

ReactDOM.render(<App />, document.getElementById('root'));

// ReactDOM.render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>
//   , document.getElementById('root')
// );