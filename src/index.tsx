import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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
  faCloudUploadAlt,
  faEdit,
  faHome,
  faSearch,
  faTired,
  faEllipsisV,
  faUserMinus,
  faExclamationTriangle,
  faInfoCircle,
  faQuestionCircle,
  faImage,
  faCircle,
  faCertificate,
  faMapMarkerAlt,
  faQrcode,
  faPrayingHands,
  faAngleDown,
  faPrint,
  faFire,
  faFilePdf,
  faThLarge,
  faThList,
  faFileCsv,
  faFilter,
  faCamera,
  faBan,
  faCropAlt,
  faRotate,
  faDownload
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
library.add(faS, faEllipsisV);
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
library.add(faS, faSearch);
library.add(faR, faClock);
library.add(faR, faBell);
library.add(faR, faSortAlphaDown);
library.add(faR, faSortAlphaDownAlt);
library.add(faR, faCloudUploadAlt);
library.add(faR, faEdit);
library.add(faR, faHome);
library.add(faR, faTired);
library.add(faR, faUserMinus);
library.add(faR, faExclamationTriangle);
library.add(faR, faInfoCircle);
library.add(faR, faQuestionCircle);
library.add(faS, faImage);
library.add(faS, faCircle);
library.add(faS, faCertificate);
library.add(faS, faMapMarkerAlt);
library.add(faS, faQrcode);
library.add(faS, faPrayingHands);
library.add(faS, faAngleDown);
library.add(faS, faPrint);
library.add(faS, faFire);
library.add(faS, faFilePdf);
library.add(faS, faThLarge);
library.add(faS, faThList);
library.add(faS, faFileCsv);
library.add(faS, faFilter);
library.add(faS, faCamera);
library.add(faS, faBan);
library.add(faS, faExpand);
library.add(faS, faCropAlt);
library.add(faS, faRotate);
library.add(faS, faDownload);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

ChartJS.register(ArcElement, Tooltip, Legend);

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
