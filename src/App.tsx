import React from 'react';
import { ThemeProvider } from 'styled-components';
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

function App() {
  const admin = useAppSelector(state => state.setAdmin.admin);
  const theme = useAppSelector(state => state.switchThemeModeReducer.theme);
  const {data: adminInfo, isLoading, isError} = useGetAdminInfoQuery({});

  const dispatcher = useAppDispatch()
  React.useEffect(() => {
    if(!isError) dispatcher(setAdmin(adminInfo));
  }, [adminInfo, isError]);

  React.useEffect(() => {
    console.log(admin)
  }, [admin])
  return (
    <React.Fragment>
      <Reset />
      <ThemeProvider theme={ theme }>
        <SnackBars position='bottom-left' />
        <AppLayout>
          <DeleteModal />
          <AppHeader>
            <NavBarToggle />
            <SystemLogo>
              <img className="desktop-logo" src='/fbims-logo.png' />
              <img className='mobile-logo' src='/fbims-logo-mobile.png' />
              <span className="cover"></span>
            </SystemLogo>
            <ThemeModeToggle />
            <AdminDropdown />
            {/* <UserAvatar /> */}
          </AppHeader>
          <AppNavBar />
          <ScrollingContent>
            {
              admin? <>
              <Routes>
                <Route path='/app' element={<Layout />}>
                  <Route path='information'>
                    <Route index element={<Information />} />
                    <Route path='members'>
                      <Route index element={<Members />} />
                      <Route path='view/:memberUID' element={<ViewMember />} />
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
                  <Route path='attendance'>
                    {/* <Route index element={<QRScanner />} /> */}
                  </Route>
                  <Route path='calendar' element={<Calendar />} />
                </Route>
              </Routes>
              </> : <>
              <Routes>
                <Route path='/app' element={<Layout />}>
                  <Route index path='*' element={<SkeletonRouteLayout />} />
                </Route>
              </Routes>
              </>
            }
          </ScrollingContent>
          <SideBar>
            <TodaysEventsSideBar />
          </SideBar>
        </AppLayout>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
