import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css';
import App from './App';
import Login from './pages/login';
import reportWebVitals from './reportWebVitals';
import Attendance from './pages/attendance';
import Leaderboard from './pages/leaderboard';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<Login/>}/>
      <Route path="attendance" element={<Attendance/>}/>
      <Route path='leaderboard' element={<Leaderboard/>}/>
    </Routes>
  </BrowserRouter>,
);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
