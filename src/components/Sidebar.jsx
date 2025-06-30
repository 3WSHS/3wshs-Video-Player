import React from 'react';
import './Sidebar.css';
import genieLamp from '../images/genie-lamp.png';

function Sidebar({ active, onSelect }) {
  return (
    <div className="sidebar">
      <img src={genieLamp} alt="Logo" className="sidebar-logo-img" />
      <div className="sidebar-title">Video Dashboard</div>
      <nav className="sidebar-nav">
        <button className={`sidebar-link${active === 'Home' ? ' active' : ''}`} onClick={() => onSelect('Home')}>Home</button>
        <button className={`sidebar-link${active === 'My Videos' ? ' active' : ''}`} onClick={() => onSelect('My Videos')}>My Videos</button>
        <button className={`sidebar-link${active === 'Movies' ? ' active' : ''}`} onClick={() => onSelect('Movies')}>Movies</button>
        <button className={`sidebar-link${active === 'TV Shows' ? ' active' : ''}`} onClick={() => onSelect('TV Shows')}>TV Shows</button>
        <button className={`sidebar-link${active === 'Youtube' ? ' active' : ''}`} onClick={() => onSelect('Youtube')}>Youtube</button>
        <button className={`sidebar-link${active === 'Playlists' ? ' active' : ''}`} onClick={() => onSelect('Playlists')}>Playlists</button>
        <button className={`sidebar-link${active === 'Work' ? ' active' : ''}`} onClick={() => onSelect('Work')}>Work</button>
        <button className={`sidebar-link${active === 'Resources' ? ' active' : ''}`} onClick={() => onSelect('Resources')}>Resources</button>
        <button className={`sidebar-link${active === 'Upload' ? ' active' : ''}`} onClick={() => onSelect('Upload')}>+ Upload</button>
        <li className={active === 'Internet archive' ? 'sidebar-link active' : 'sidebar-link'} onClick={() => onSelect('Internet archive')}>
          Internet archive
        </li>
      </nav>
    </div>
  );
}

export default Sidebar; 