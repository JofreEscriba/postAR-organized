import React from 'react';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* Background elements */}
      <div className="wave-bottom-left"></div>
      <div className="wave-top-right"></div>
      <div className="circle-top-left"></div>
      <div className="circle-bottom-left"></div>
      <div className="circle-bottom-right"></div>
      <div className="circle-left-offscreen"></div>
      <div className="circle-right-offscreen"></div>
      
      {/* Render either children or Outlet */}
      {children || <Outlet />}
    </>
  );
};

export default Layout;