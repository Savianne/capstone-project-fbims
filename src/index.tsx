import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

//React Router
import { BrowserRouter } from 'react-router-dom';

//React-Redux
import { Provider } from 'react-redux'
import { store } from './global-state/store';

//FontAwesomeIcons
import { library } from "@fortawesome/fontawesome-svg-core";
import { 
  faS, 
  faBars, 
  faUser, 
  faUsers, 
  faClipboardList, 
  faMoon, 
  faSun, 
  faSitemap, 
  faHandHoldingHeart, 
  faHandsHelping,
  faArrowLeft,
  faAngleRight,
  faAngleLeft,
  faOutdent,
  faPeopleRoof,
  faCircleExclamation,
 } from '@fortawesome/free-solid-svg-icons';

library.add(faS, faBars);
library.add(faS, faUsers);
library.add(faS, faClipboardList);
library.add(faS, faMoon);
library.add(faS, faSun);
library.add(faS, faSitemap);
library.add(faS, faHandHoldingHeart);
library.add(faS, faHandsHelping);
library.add(faS, faArrowLeft);
library.add(faS, faAngleRight);
library.add(faS, faAngleLeft);
library.add(faS, faOutdent);
library.add(faS, faPeopleRoof);
library.add(faS, faCircleExclamation);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
