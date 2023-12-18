import React from 'react';
import { ThemeProvider } from 'styled-components';
import { io } from 'socket.io-client';
import { SOCKETIO_URL } from './API/BASE_URL';
import { lightTheme, darkTheme } from './uicomponents/theme';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Reset } from 'styled-reset'

//React-Router
import { Routes, Route, Outlet } from 'react-router-dom';

//Global State Hooks
import { useAppSelector } from './global-state/hooks';
import { useAppDispatch } from './global-state/hooks';

//Global State Actions
import { setAdmin } from './global-state/action-creators/setAdminSlice';

//Utility Components
import UseRipple from './uicomponents/reusables/Ripple/UseRipple';
import UseToggle from './uicomponents/reusables/Toggle/UseToggle';

//API
import { useGetAdminInfoQuery } from './global-state/api/api';

//Types
import { TBasicAttendancePresentAttendees } from './uicomponents/routes/attendance/entryPage/EntryPage';

//Conponents
import AppLayout from './uicomponents/AppLayout';
import AppHeader from './uicomponents/AppHeader';
import AppNavBar from './uicomponents/AppNavBar';
import ScrollingContent from './uicomponents/ScrollingContent';
import SideBar from './uicomponents/SideBar';
import NavBarToggle from './uicomponents/NavBarToggle';
import SystemLogo from './uicomponents/systemLogo';
import UserAvatar from './uicomponents/UserAvatar';
import ThemeModeToggle from './uicomponents/ThemeModeToggle';
import AdminDropdown from './uicomponents/AdminDropdown';
import TodaysEventsSideBar from './uicomponents/TodaysEventsSideBar';
import Scrollbars from 'react-custom-scrollbars-2';
import 'react-loading-skeleton/dist/skeleton.css'
import SnackBars from './uicomponents/reusables/SnackBar/SnackBars';
import AppMainLayout from './AppMainLayout';

//Routes
import Layout from './uicomponents/routes/layout';
import SkeletonRouteLayout from './uicomponents/routes/SkeletonRouteLayout';
import Information from './uicomponents/routes/information/Information';
import Members from './uicomponents/routes/information/members/Members';
import MembershipForm from './uicomponents/routes/information/members/MembershipForm';
import Ministry from './uicomponents/routes/information/ministry/ministry';
import Organizations from './uicomponents/routes/information/organizations/organizations';
import AddNewMinistryForm from './uicomponents/routes/information/ministry/add-new-ministry-form';
import Calendar from './uicomponents/routes/calendar/Calendar';
import ManageMinistryView from './uicomponents/routes/information/ministry/manage-ministry-view';
import ManageOrganizationView from './uicomponents/routes/information/organizations/manage-organization-view';
import ViewMember from './uicomponents/routes/information/members/ViewMember';
import EditMember from './uicomponents/routes/information/members/EditMember';
import DeleteModal from './uicomponents/reusables/DeleteModal/DeleteModal';
import MemberProfile from './uicomponents/routes/information/members/MemberProfile';
import Attendance from './uicomponents/routes/attendance/attendance';
import WorshipService from './uicomponents/routes/worship-service/WorshipService';
import AttendanceCategory from './uicomponents/routes/attendance/category/AttendanceCategory';
import Error404 from './uicomponents/Error404';

function App() {
  const admin = useAppSelector(state => state.setAdmin.admin);
  const theme = useAppSelector(state => state.switchThemeModeReducer.theme);
  const {data: adminInfo, isLoading, isError} = useGetAdminInfoQuery({});

  const dispatcher = useAppDispatch();
  
  React.useEffect(() => {
    if(!isError) dispatcher(setAdmin(adminInfo));
  }, [adminInfo, isError]);

  React.useEffect(() => {
    console.log(admin)
  }, [admin]);

  function showNotification(icon?: string | null, body?: string) {
    const notification = new Notification('Hello Admin', {
      body: 'New Document Request Added!',
      icon: '/assets/faith-buddy-mob.png',
    });
  
    notification.addEventListener('click', () => {
      // Handle notification click event
    });
  
    notification.addEventListener('close', () => {
      // Handle notification close event
    });
  }

  React.useEffect(() => {
    // const socket = io(SOCKETIO_URL);

    // socket.on(`${admin?.congregation}-NEW_PRESENT`, (data: TBasicAttendancePresentAttendees) => {
    //   if ('Notification' in window) {
    //     if (Notification.permission === 'granted') {
    //       showNotification();
    //     } else if (Notification.permission !== 'denied') {
    //       Notification.requestPermission().then((permission) => {
    //         if (permission === 'granted') {
    //           showNotification();
    //         }
    //       });
    //     }
    //   }
    // });

    // return function () {
    //     socket.disconnect();
    // }
}, [admin]);

  return (
    <React.Fragment>
      <Reset />
      <ThemeProvider theme={ theme }>
        <SnackBars position='bottom-left' />
        {/* <AppLayout>
          <DeleteModal />
          <AppHeader>
            <NavBarToggle />
            <SystemLogo>
              <img className="desktop-logo" src='/faith-buddy.png' />
              <img className='mobile-logo' src='/faith-buddy-mob.png' />
              <span className="cover"></span>
            </SystemLogo>
            <AdminDropdown />
            <ThemeModeToggle />
          </AppHeader>
          <AppNavBar />
          <ScrollingContent> */}
            {
              admin? <>
              <Routes>
                <Route path='/' element={<AppMainLayout />}>
                  <Route path='/app' element={<Layout />}>
                    <Route path='information'>
                      <Route index element={<Information />} />
                      <Route path='members'>
                        <Route index element={<Members />} />
                        <Route path='view/:memberUID' element={<MemberProfile />} />
                        <Route path='edit/:memberUID' element={<EditMember />} />
                        <Route path='new-member' element={<MembershipForm />} />
                      </Route>
                      <Route path='ministry'>
                        <Route index element={<Ministry />} />
                        <Route path="/app/information/ministry/:ministryUID" element={<ManageMinistryView />} />
                        {/* <Route path='add-ministry' element={<AddNewMinistryForm />} /> */}
                      </Route>
                      <Route path='organizations'>
                        <Route index element={<Organizations />} />
                        <Route path="/app/information/organizations/:orgUID" element={<ManageOrganizationView />} />
                      </Route>
                    </Route>
                    <Route path='worship-service'>
                      <Route index element={<WorshipService />} />
                    </Route>
                    <Route path='attendance'>
                      <Route index element={<Attendance />} />
                      <Route path='/app/attendance/category/:categoryUID' element={<AttendanceCategory />} />
                    </Route>
                    <Route path='calendar' element={<Calendar />} />
                    <Route path='*' element={<Error404 />} />
                  </Route>
                </Route>
              </Routes>
              </> : <>
              <Routes>
                <Route path='/' element={<AppMainLayout />}>
                  <Route path='/app' element={<Layout />}>
                    <Route index path='*' element={<SkeletonRouteLayout />} />
                  </Route>
                </Route>
              </Routes>
              </>
            }
          {/* </ScrollingContent>
          <SideBar>
            <TodaysEventsSideBar />
          </SideBar>
        </AppLayout> */}
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
