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
import { increment, decrement, incrementByAmount } from './global-state/action-creators/counterSlice';

//Utility Components
import UseRipple from './uicomponents/reusables/Ripple/UseRipple';
import UseToggle from './uicomponents/reusables/Toggle/UseToggle';

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

//Routes
import Layout from './uicomponents/routes/layout';
import Information from './uicomponents/routes/information/Information';
import Members from './uicomponents/routes/information/members/Members';
import MembershipForm from './uicomponents/routes/information/members/MembershipForm';
import Ministry from './uicomponents/routes/information/ministry/ministry';
import Organizations from './uicomponents/routes/information/organizations/organizations';


function App() {
  const counterState = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();

  const theme = useAppSelector(state => state.switchThemeModeReducer.theme)
  return (
    <React.Fragment>
      <Reset />
      <ThemeProvider theme={ theme }>
        <AppLayout>
          <AppHeader>
            <NavBarToggle />
            <SystemLogo>
              <img src='/fbims-logo.png' />
              <span className="cover"></span>
            </SystemLogo>
            <ThemeModeToggle />
            <UserAvatar />
          </AppHeader>
          <AppNavBar />
          <ScrollingContent>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route path='information'>
                  <Route index element={<Information />} />
                  <Route path='members'>
                    <Route index element={<Members />} />
                    <Route path='new-member' element={<MembershipForm />} />
                  </Route>
                  <Route path='ministry' element={<Ministry />} />
                  <Route path='organizations' element={<Organizations />} />
                </Route>
                <Route path='attendance'>
                  
                </Route>
              </Route>
            </Routes>
          </ScrollingContent>
          <SideBar>
            
          </SideBar>
        </AppLayout>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
