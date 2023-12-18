import React from "react";
import { Outlet } from "react-router-dom";
//Conponents
import AppLayout from './uicomponents/AppLayout';
import AppHeader from './uicomponents/AppHeader';
import AppNavBar from './uicomponents/AppNavBar';
import ScrollingContent from './uicomponents/ScrollingContent';
import SideBar from './uicomponents/SideBar';
import NavBarToggle from './uicomponents/NavBarToggle';
import SystemLogo from './uicomponents/systemLogo';
import ThemeModeToggle from "./uicomponents/ThemeModeToggle";
import AdminDropdown from './uicomponents/AdminDropdown';
import TodaysEventsSideBar from './uicomponents/TodaysEventsSideBar';
import 'react-loading-skeleton/dist/skeleton.css'
import SnackBars from './uicomponents/reusables/SnackBar/SnackBars';
import DeleteModal from "./uicomponents/reusables/DeleteModal/DeleteModal";

const AppMainLayout: React.FC = () => {
    return(
        <AppLayout>
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
          <ScrollingContent>
            <Outlet />
          </ScrollingContent>
          <SideBar>
            <TodaysEventsSideBar />
          </SideBar>
        </AppLayout>
    )
}

export default AppMainLayout;