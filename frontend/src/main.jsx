import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routers';
import './index.css';

const root = document.getElementById('root');
const reactRoot = createRoot(root);

reactRoot.render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
  // <React.StrictMode>
  //   <BrowserRouter>
  //     <AppRoutes />
  //   </BrowserRouter>
  // </React.StrictMode>
);


