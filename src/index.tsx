import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

//React Router
import { BrowserRouter } from 'react-router-dom';

//React-Redux
import { Provider } from 'react-redux'
import { store } from './global-state/store';

import SnackBarContext from './uicomponents/reusables/SnackBar/SnackBarContext';
import DeleteModalContext from './uicomponents/reusables/DeleteModal/DeleteModalContext';

//FontAwesomeIcons
import { library } from "@fortawesome/fontawesome-svg-core";
import { 
  faS,
  faR,
  faBars, 
  faUser, 
  faUsers, 
  faClipboardList, 
  faMoon, 
  faSun, 
  faSitemap, 
  faHandHoldingHeart, 
  faHandsHelping,
  faAngleRight,
  faAngleLeft,
  faOutdent,
  faPeopleRoof,
  faCircleExclamation,
  faCakeCandles,
  faMapLocationDot,
  faVenusMars,
  faPeopleGroup,
  faHeart,
  faCaretDown,
  faFolderOpen,
  faCheck,
  faAt,
  faPhoneAlt,
  faEllipsisH,
  faCheckCircle,
  faPlaceOfWorship,
  faPlus,
  faMobileAlt,
  faArrowCircleRight,
  faUserPen,
  faTrash,
  faCircleNotch,
  faSpinner,
  faArrowRight,
  faArrowLeft,
  faArrowAltCircleRight,
  faArrowAltCircleLeft,
  faExpand,
  faTimes,
  faCalendarAlt,
  faQuoteLeft,
  faCalendarDay,
  faCalendarTimes,
  faList,
  faCalendarPlus,
  faBell,
  faCaretUp,
  faSortAlphaDown,
  faSortAlphaDownAlt,
  faSearch,
  faCloudUploadAlt,
  faEdit
 } from '@fortawesome/free-solid-svg-icons';

import { faClock } from '@fortawesome/free-regular-svg-icons';

library.add(faS, faBars);
library.add(faS, faUsers);
library.add(faS, faUser);
library.add(faS, faClipboardList);
library.add(faS, faMoon);
library.add(faS, faSun);
library.add(faS, faSitemap);
library.add(faS, faHandHoldingHeart);
library.add(faS, faHandsHelping);
library.add(faS, faAngleRight);
library.add(faS, faAngleLeft);
library.add(faS, faOutdent);
library.add(faS, faPeopleRoof);
library.add(faS, faCircleExclamation);
library.add(faS, faCakeCandles);
library.add(faS, faMapLocationDot);
library.add(faS, faVenusMars);
library.add(faS, faPeopleGroup);
library.add(faS, faHeart);
library.add(faS, faCaretDown);
library.add(faS, faCaretUp);
library.add(faS, faFolderOpen);
library.add(faS, faCheck);
library.add(faS, faAt);
library.add(faS, faPhoneAlt);
library.add(faS, faEllipsisH);
library.add(faS, faCheckCircle);
library.add(faS, faPlaceOfWorship);
library.add(faS, faPlus);
library.add(faS, faMobileAlt);
library.add(faS, faArrowCircleRight);
library.add(faS, faUserPen);
library.add(faS, faTrash);
library.add(faS, faCircleNotch);
library.add(faS, faSpinner);
library.add(faS, faArrowLeft);  
library.add(faS, faArrowRight);
library.add(faS, faArrowAltCircleRight);
library.add(faS, faArrowAltCircleLeft);
library.add(faS, faExpand);
library.add(faS, faTimes);
library.add(faS, faCalendarAlt);
library.add(faS, faQuoteLeft);
library.add(faS, faCalendarDay);
library.add(faS, faCalendarTimes);
library.add(faS, faList);
library.add(faS, faCalendarPlus);
library.add(faR, faClock);
library.add(faR, faBell);
library.add(faR, faSortAlphaDown);
library.add(faR, faSortAlphaDownAlt);
library.add(faR, faSearch);
library.add(faR, faCloudUploadAlt);
library.add(faR, faEdit);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SnackBarContext>
          <DeleteModalContext>
            <App />
          </DeleteModalContext>
        </SnackBarContext>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
