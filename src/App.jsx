import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import UploadForm from './components/UploadForm';
import InternetArchivePage from './components/InternetArchivePage';
import './styles/App.css';
import { v4 as uuidv4 } from 'uuid';
import { addVideo, getVideo, deleteVideo, getAllVideos, addOrUpdatePlaylist, getAllPlaylists, deletePlaylist as dbDeletePlaylist } from './utils/videoDB';
import BokehBalls from './components/BokehBalls';
import { COLLECTIONS as IA_COLLECTIONS } from './components/InternetArchivePage';

function App() {
  const [activeSection, setActiveSection] = useState('Home');
  const [videoSrc, setVideoSrc] = useState(null);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistInput, setShowPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(null);
  const [showCategoryPlaylistInput, setShowCategoryPlaylistInput] = useState(null);
  const [newCategoryPlaylistName, setNewCategoryPlaylistName] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [videoURLs, setVideoURLs] = useState({});
  const dropdownRef = useRef();
  const categoryDropdownRef = useRef();

  // Dynamic page titles and subtitles
  const sectionTitles = {
    Home: 'Welcome to Your Video Dashboard',
    'My Videos': 'My Videos',
    Movies: 'Movies',
    'TV Shows': 'TV Shows',
    Youtube: 'Youtube',
    Playlists: 'Your Playlists',
    Work: 'Work',
    Resources: 'Resources',
    Upload: 'Upload Video',
    Settings: 'Settings',
    'Internet archive': 'Internet Archive',
  };
  const sectionSubtitles = {
    Home: 'A modern home for your videos',
    'My Videos': 'Browse all your uploaded videos',
    Movies: 'All your categorized movies',
    'TV Shows': 'All your categorized TV shows',
    Youtube: 'All your categorized Youtube videos',
    Playlists: 'Organize your videos into playlists',
    Work: 'Videos for work and productivity',
    Resources: 'Reference and resource videos',
    Upload: 'Upload and manage your video files',
    Settings: 'App settings',
    'Internet archive': 'Browse videos from the Internet Archive',
  };

  const handleUpload = async (video) => {
    const id = uuidv4();
    await addVideo(id, video.file);
    const videoWithId = { ...video, id };
    setUploadedVideos((prev) => [videoWithId, ...prev]);
    // Fetch blob and set object URL for immediate playback
    const blob = await getVideo(id);
    const url = URL.createObjectURL(blob);
    setVideoURLs((prev) => ({ ...prev, [id]: url }));
  };

  const handleVideoSelect = (video) => {
    // Handle both local videos and Internet Archive videos
    if (video.id) {
      // Local video
      setVideoSrc(videoURLs[video.id]);
      setRecentlyPlayed((prev) => {
        const filtered = prev.filter((v) => v.id !== video.id);
        return [video, ...filtered].slice(0, 8);
      });
    } else if (video.url) {
      // Internet Archive video
      setVideoSrc(video.url);
      setRecentlyPlayed((prev) => {
        const filtered = prev.filter((v) => v.url !== video.url);
        return [video, ...filtered].slice(0, 8);
      });
    }
  };

  const handleRemoveVideo = async (video) => {
    await deleteVideo(video.id);
    setUploadedVideos((prev) => prev.filter((v) => v.id !== video.id));
    if (videoSrc === videoURLs[video.id]) setVideoSrc(null);
    setVideoURLs((prev) => {
      const copy = { ...prev };
      delete copy[video.id];
      return copy;
    });
  };

  // Helper to ensure playlist has an id
  function ensurePlaylistId(pl) {
    return pl.id ? pl : { ...pl, id: uuidv4() };
  }

  // On mount, load playlists from IndexedDB if not present
  useEffect(() => {
    if (playlists.length === 0) {
      getAllPlaylists().then((pls) => {
        if (pls && pls.length > 0) {
          setPlaylists(pls.map(pl => ({ ...pl, id: pl.id || uuidv4(), videos: Array.isArray(pl.videos) ? pl.videos : [] })));
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  // On create or update playlist, sync with IndexedDB
  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim() && !playlists.some(p => p.name === newPlaylistName.trim())) {
      const newPl = ensurePlaylistId({ name: newPlaylistName.trim(), videos: [] });
      await addOrUpdatePlaylist(newPl);
      setPlaylists(prev => [...prev, newPl]);
      setNewPlaylistName('');
      setShowPlaylistInput(false);
    }
  };

  const handleAddToPlaylist = async (video, playlistName) => {
    const pl = playlists.find(pl => pl.name === playlistName);
    if (!pl) return;
    const updated = { ...pl, videos: [...pl.videos, video.id] };
    await addOrUpdatePlaylist(updated);
    setPlaylists(prev => prev.map(p => p.id === pl.id ? updated : p));
    setShowPlaylistDropdown(null);
  };

  const handleCategorizeVideo = (video, category) => {
    setUploadedVideos(prev => prev.map(v => v.id === video.id ? { ...v, category } : v));
    setShowCategoryDropdown(null);
  };

  const handleChangeThumbnail = (video, thumbnailUrl) => {
    setUploadedVideos(prev => prev.map(v => v.id === video.id ? { ...v, thumbnail: thumbnailUrl } : v));
  };

  const handleCreateCategoryPlaylist = async (category) => {
    const name = newCategoryPlaylistName.trim();
    if (!name) return; // Prevent empty names
    if (playlists.some(p => p.name === name && p.category === category)) return; // Prevent duplicates
    const newPl = ensurePlaylistId({ name, videos: [], category });
    await addOrUpdatePlaylist(newPl);
    setPlaylists(prev => [...prev, newPl]);
    setNewCategoryPlaylistName('');
    setShowCategoryPlaylistInput(null);
  };

  // Modal close handler
  const handleCloseModal = () => setVideoSrc(null);

  // Add a handler to toggle featured status
  const handleToggleFeatured = async (playlist) => {
    const updated = { ...playlist, featured: !playlist.featured };
    await addOrUpdatePlaylist(updated);
    setPlaylists(prev => prev.map(pl => pl.id === playlist.id ? updated : pl));
  };

  // Add a handler to remove a playlist
  const handleRemovePlaylist = async (playlist) => {
    if (window.confirm(`Are you sure you want to delete the playlist "${playlist.name}"?`)) {
      await dbDeletePlaylist(playlist.id);
      setPlaylists(prev => prev.filter(pl => pl.id !== playlist.id));
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPlaylistDropdown(null);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load from localStorage on mount, with migration for missing id/featured
  useEffect(() => {
    const vids = localStorage.getItem('uploadedVideos');
    const pls = localStorage.getItem('playlists');
    const rec = localStorage.getItem('recentlyPlayed');
    if (vids) {
      let parsed = JSON.parse(vids);
      // Add id if missing
      parsed = parsed.map(v => v.id ? v : { ...v, id: uuidv4() });
      setUploadedVideos(parsed);
    }
    if (pls) {
      let parsed = JSON.parse(pls);
      // Add id and featured if missing
      parsed = parsed.map(p => ({
        ...p,
        id: p.id || uuidv4(),
        featured: typeof p.featured === 'boolean' ? p.featured : false
      }));
      setPlaylists(parsed);
    }
    if (rec) {
      let parsed = JSON.parse(rec);
      // Add id if missing
      parsed = parsed.map(v => v.id ? v : { ...v, id: uuidv4() });
      setRecentlyPlayed(parsed);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos));
  }, [uploadedVideos]);
  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);
  useEffect(() => {
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Home page section logic
  const topPlaylists = (playlists || []).slice(0, 4);
  const featuredPlaylists = (playlists || []).filter(pl => pl?.featured).slice(0, 5);
  const recentlyPlayedToShow = (recentlyPlayed || []).slice(0, 4);

  const topPlaylistsPlaceholders = Array.from({ length: Math.max(0, 4 - (topPlaylists?.length || 0)) });
  const featuredPlaylistsPlaceholders = Array.from({ length: Math.max(0, 5 - (featuredPlaylists?.length || 0)) });
  const recentlyPlayedPlaceholders = Array.from({ length: Math.max(0, 4 - (recentlyPlayedToShow?.length || 0)) });

  // useEffect to fetch blobs for all uploadedVideos on mount or change
  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      const urls = {};
      for (const vid of uploadedVideos) {
        if (!videoURLs[vid.id]) {
          const blob = await getVideo(vid.id);
          if (blob && isMounted) {
            urls[vid.id] = URL.createObjectURL(blob);
          }
        } else {
          urls[vid.id] = videoURLs[vid.id];
        }
      }
      if (isMounted) setVideoURLs(urls);
    };
    fetchAll();
    return () => { isMounted = false; };
  }, [uploadedVideos]);

  // On mount, if uploadedVideos is empty, load from IndexedDB
  useEffect(() => {
    if (uploadedVideos.length === 0) {
      getAllVideos().then((all) => {
        if (all && all.length > 0) {
          // Try to get metadata from localStorage if available
          const vidsMeta = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
          // Rebuild metadata for each video in IndexedDB
          const rebuilt = all.map(({ id, file }) => {
            // Try to find matching metadata by id
            const meta = vidsMeta.find(v => v.id === id) || {};
            return {
              id,
              name: meta.name || file.name || 'Untitled',
              type: meta.type || file.type || 'video/mp4',
              category: meta.category,
              thumbnail: meta.thumbnail,
              // No url here, will be set by useEffect
            };
          });
          setUploadedVideos(rebuilt);
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  // Helper to get 4 random movies
  function getRandomMovies(movies, count = 4) {
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Add event listener for Internet Archive videos being played
  useEffect(() => {
    function handleVideoPlayed(e) {
      const video = e.detail;
      setRecentlyPlayed((prev) => {
        const filtered = prev.filter((v) => v.url !== video.url);
        return [video, ...filtered].slice(0, 8);
      });
    }
    window.addEventListener('videoPlayed', handleVideoPlayed);
    return () => window.removeEventListener('videoPlayed', handleVideoPlayed);
  }, []);

  return (
    <div className="app-root">
      <Sidebar active={activeSection} onSelect={setActiveSection} />
      <main className="main-content">
        {activeSection !== 'Home' && (
          <header className="main-header">
            <h1>{sectionTitles[activeSection] || 'Your Video Dashboard'}</h1>
            <p className="main-subtitle">{sectionSubtitles[activeSection] || ''}</p>
          </header>
        )}
        {videoSrc && (
          <div className="video-modal-overlay" onClick={handleCloseModal}>
            <div className="video-modal" onClick={e => e.stopPropagation()}>
              <button className="video-modal-close" onClick={handleCloseModal}>&times;</button>
              <VideoPlayer src={videoSrc} />
            </div>
          </div>
        )}
        <section className="video-section">
          {activeSection === 'Upload' ? (
            <div style={{width: '100%'}}>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 24}}>
                <button className="create-playlist-btn" onClick={() => setShowPlaylistInput(true)}>Create Playlist</button>
              </div>
              {showPlaylistInput && (
                <div style={{display: 'flex', gap: 8, marginBottom: 24}}>
                  <input
                    className="playlist-input"
                    type="text"
                    placeholder="Playlist name"
                    value={newPlaylistName}
                    onChange={e => setNewPlaylistName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreatePlaylist(); }}
                    autoFocus
                  />
                  <button className="playlist-save-btn" onClick={handleCreatePlaylist}>Save</button>
                  <button className="playlist-cancel-btn" onClick={() => { setShowPlaylistInput(false); setNewPlaylistName(''); }}>Cancel</button>
                </div>
              )}
              {videoSrc && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                  <VideoPlayer src={videoSrc} />
                </div>
              )}
              <UploadForm onUpload={handleUpload} uploadedVideos={uploadedVideos} onVideoSelect={handleVideoSelect} onRemove={handleRemoveVideo} 
                playlists={playlists} onAddToPlaylist={(video) => setShowPlaylistDropdown(video.id)}
                onCategorize={(video) => setShowCategoryDropdown(video.id)} onChangeThumbnail={handleChangeThumbnail} />
              {showPlaylistDropdown && (
                <div className="playlist-dropdown" ref={dropdownRef} style={{position: 'fixed', top: 120, left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: '#23283a', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.18)', padding: 18}}>
                  <div style={{color: '#fff', marginBottom: 10}}>Add to playlist:</div>
                  {playlists.length === 0 ? <div style={{color: '#b3b8c5'}}>No playlists yet</div> :
                    Object.entries(
                      playlists.reduce((acc, pl) => {
                        acc[pl.category || 'Uncategorized'] = acc[pl.category || 'Uncategorized'] || [];
                        acc[pl.category || 'Uncategorized'].push(pl);
                        return acc;
                      }, {})
                    ).map(([cat, pls]) => (
                      <div key={cat} style={{marginBottom: 8}}>
                        <div style={{color: '#b3b8c5', fontSize: '0.98rem', marginBottom: 2}}>{cat}</div>
                        {pls.map(pl => (
                          <div key={pl.name + cat} className="playlist-dropdown-item" onClick={() => { setActiveSection('Playlists'); setSelectedPlaylist(pl); handleAddToPlaylist(uploadedVideos.find(v => v.id === showPlaylistDropdown), pl.name); }}>
                            {pl.name} <span style={{color: '#4f8cff', fontSize: '0.95em'}}>({cat})</span>
                          </div>
                        ))}
                      </div>
                    ))
                  }
                  <div className="playlist-dropdown-item" style={{color: '#ff4f4f'}} onClick={() => setShowPlaylistDropdown(null)}>Cancel</div>
                </div>
              )}
              {showCategoryDropdown && (
                <div className="playlist-dropdown" ref={categoryDropdownRef} style={{position: 'fixed', top: 180, left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: '#23283a', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.18)', padding: 18}}>
                  <div style={{color: '#fff', marginBottom: 10}}>Categorize video as:</div>
                  {['Movies','TV Shows','Youtube','Work','Resources'].map(cat => (
                    <div key={cat} className="playlist-dropdown-item" onClick={() => { handleCategorizeVideo(uploadedVideos.find(v => v.id === showCategoryDropdown), cat); }}>
                      {cat}
                    </div>
                  ))}
                  <div className="playlist-dropdown-item" style={{color: '#ff4f4f'}} onClick={() => setShowCategoryDropdown(null)}>Cancel</div>
                </div>
              )}
            </div>
          ) : activeSection === 'My Videos' ? (
            <div className="uploaded-videos-list" style={{ width: '100%' }}>
              {videoSrc && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                  <VideoPlayer src={videoSrc} />
                </div>
              )}
              <div className="uploaded-videos-grid">
                {uploadedVideos.length === 0 ? (
                  <div style={{ color: '#b3b8c5', fontSize: '1.1rem', padding: 32 }}>No videos uploaded yet.</div>
                ) : uploadedVideos.map((vid, idx) => (
                  <div key={idx} className="uploaded-video-card">
                    <button className="remove-btn" title="Remove video" onClick={() => handleRemoveVideo(vid)}>&times;</button>
                    <div className="play-overlay">
                      <button className="play-btn" onClick={() => handleVideoSelect(vid)}>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="11" cy="11" r="11" fill="none"/>
                          <polygon points="8,6 17,11 8,16" fill="white"/>
                        </svg>
                      </button>
                    </div>
                    {vid.thumbnail ? (
                      <img src={vid.thumbnail} alt="Thumbnail" className="uploaded-video-thumb" />
                    ) : (
                      <video src={videoURLs[vid.id]} className="uploaded-video-thumb" />
                    )}
                    <div className="uploaded-video-name">{vid.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'Movies' ? (
            <div className="uploaded-videos-list" style={{ width: '100%' }}>
              {/* Featured Movies Row */}
              {(() => {
                // Show the 5 most recently added movies in the Movies category
                const allMovies = (uploadedVideos || []).filter(v => v.category === 'Movies');
                const featuredMovies = allMovies.slice(0, 5);
                const placeholders = Array.from({ length: 5 - featuredMovies.length });
                return (
                  <div style={{ display: 'flex', gap: 32, marginBottom: 36, marginTop: 8, justifyContent: 'center' }}>
                    {featuredMovies.map((vid, idx) => (
                      <div key={vid.id} style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 340,
                        aspectRatio: '2 / 3',
                        background: '#181c24',
                        borderRadius: 18,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border 0.2s, transform 0.15s',
                      }} onClick={() => handleVideoSelect(vid)}>
                        {/* Thumbnail change button overlay */}
                        <label style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(30,34,44,0.85)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 4,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          opacity: 0.85,
                          transition: 'opacity 0.18s',
                        }} title="Change Thumbnail" onClick={e => e.stopPropagation()}>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleChangeThumbnail(vid, URL.createObjectURL(e.target.files[0]))} />
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" fill="currentColor"/>
                            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
                          </svg>
                        </label>
                        {vid.thumbnail ? (
                          <img src={vid.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                        ) : (
                          <video src={videoURLs[vid.id]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                        )}
                        {/* Gradient overlay for title */}
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: '32%',
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.82) 100%)',
                          zIndex: 2,
                          borderBottomLeftRadius: 18,
                          borderBottomRightRadius: 18,
                        }} />
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 3,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          textAlign: 'left',
                          padding: '0 16px 16px 16px',
                          textShadow: '0 2px 8px rgba(0,0,0,0.45)',
                          letterSpacing: '0.01em',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}>{vid.name}</div>
                      </div>
                    ))}
                    {placeholders.map((_, idx) => (
                      <div key={"movie-placeholder-" + idx} style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 340,
                        aspectRatio: '2 / 3',
                        background: '#23283a',
                        borderRadius: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#b3b8c5',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        opacity: 0.5,
                      }}>
                        No movie
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 24}}>
                <button className="create-playlist-btn" onClick={() => setShowCategoryPlaylistInput('Movies')}>Create Playlist</button>
              </div>
              {showCategoryPlaylistInput === 'Movies' && (
                <div style={{display: 'flex', gap: 8, marginBottom: 24}}>
                  <input
                    className="playlist-input"
                    type="text"
                    placeholder="Playlist name"
                    value={newCategoryPlaylistName}
                    onChange={e => setNewCategoryPlaylistName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateCategoryPlaylist('Movies'); }}
                    autoFocus
                  />
                  <button className="playlist-save-btn" onClick={() => handleCreateCategoryPlaylist('Movies')}>Save</button>
                  <button className="playlist-cancel-btn" onClick={() => { setShowCategoryPlaylistInput(null); setNewCategoryPlaylistName(''); }}>Cancel</button>
                </div>
              )}
              {videoSrc && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                  <VideoPlayer src={videoSrc} />
                </div>
              )}
              <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, letterSpacing: '0.01em', marginBottom: 18 }}>Movie Playlists</h3>
              {/* Movie Playlists as Netflix-style rows */}
              {(playlists || []).filter(pl => pl.category === 'Movies' && Array.isArray(pl.videos) && pl.videos.length > 0).map((pl, idx) => (
                <div key={pl.id || pl.name + idx} style={{ marginBottom: 36 }}>
                  <h4 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 14px 8px', letterSpacing: '0.01em' }}>{pl.name}</h4>
                  <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 8 }}>
                    {pl.videos.map((vidId, vIdx) => {
                      const vid = uploadedVideos.find(v => v.id === vidId);
                      if (!vid) return null;
                      return (
                        <div key={vid.id} style={{
                          width: 180,
                          height: 270,
                          background: '#181c24',
                          borderRadius: 14,
                          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'box-shadow 0.2s, border 0.2s, transform 0.15s',
                        }} onClick={() => handleVideoSelect(vid)}>
                          {vid.thumbnail ? (
                            <img src={vid.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                          ) : (
                            <video src={videoURLs[vid.id]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                          )}
                          {/* Gradient overlay for title */}
                          <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: '36%',
                            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.82) 100%)',
                            zIndex: 2,
                            borderBottomLeftRadius: 14,
                            borderBottomRightRadius: 14,
                          }} />
                          <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 3,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textAlign: 'left',
                            padding: '0 10px 12px 10px',
                            textShadow: '0 2px 8px rgba(0,0,0,0.45)',
                            letterSpacing: '0.01em',
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}>{vid.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : activeSection === 'TV Shows' ? (
            <div className="uploaded-videos-list" style={{ width: '100%' }}>
              {/* Featured TV Shows Row */}
              {(() => {
                const allShows = (uploadedVideos || []).filter(v => v.category === 'TV Shows');
                const featuredShows = getRandomMovies(allShows, 5);
                const placeholders = Array.from({ length: 5 - featuredShows.length });
                return (
                  <div style={{ display: 'flex', gap: 32, marginBottom: 36, marginTop: 8, justifyContent: 'center' }}>
                    {featuredShows.map((vid, idx) => (
                      <div key={vid.id} style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 340,
                        aspectRatio: '2 / 3',
                        background: '#181c24',
                        borderRadius: 18,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border 0.2s, transform 0.15s',
                      }} onClick={() => handleVideoSelect(vid)}>
                        {/* Thumbnail change button overlay */}
                        <label style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(30,34,44,0.85)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 4,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          opacity: 0.85,
                          transition: 'opacity 0.18s',
                        }} title="Change Thumbnail" onClick={e => e.stopPropagation()}>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleChangeThumbnail(vid, URL.createObjectURL(e.target.files[0]))} />
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" fill="currentColor"/>
                            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
                          </svg>
                        </label>
                        {vid.thumbnail ? (
                          <img src={vid.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                        ) : (
                          <video src={videoURLs[vid.id]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                        )}
                        {/* Gradient overlay for title */}
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: '32%',
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.82) 100%)',
                          zIndex: 2,
                          borderBottomLeftRadius: 18,
                          borderBottomRightRadius: 18,
                        }} />
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 3,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          textAlign: 'left',
                          padding: '0 16px 16px 16px',
                          textShadow: '0 2px 8px rgba(0,0,0,0.45)',
                          letterSpacing: '0.01em',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}>{vid.name}</div>
                      </div>
                    ))}
                    {placeholders.map((_, idx) => (
                      <div key={"tvshow-placeholder-" + idx} style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 340,
                        aspectRatio: '2 / 3',
                        background: '#23283a',
                        borderRadius: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#b3b8c5',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        opacity: 0.5,
                      }}>
                        No show
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 24}}>
                <button className="create-playlist-btn" onClick={() => setShowCategoryPlaylistInput('TV Shows')}>Create Playlist</button>
              </div>
              {showCategoryPlaylistInput === 'TV Shows' && (
                <div style={{display: 'flex', gap: 8, marginBottom: 24}}>
                  <input
                    className="playlist-input"
                    type="text"
                    placeholder="Playlist name"
                    value={newCategoryPlaylistName}
                    onChange={e => setNewCategoryPlaylistName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateCategoryPlaylist('TV Shows'); }}
                    autoFocus
                  />
                  <button className="playlist-save-btn" onClick={() => handleCreateCategoryPlaylist('TV Shows')}>Save</button>
                  <button className="playlist-cancel-btn" onClick={() => { setShowCategoryPlaylistInput(null); setNewCategoryPlaylistName(''); }}>Cancel</button>
                </div>
              )}
              {videoSrc && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                  <VideoPlayer src={videoSrc} />
                </div>
              )}
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.01em', marginBottom: 18 }}>TV Shows</h3>
              <div className="playlist-cards-grid">
                {(playlists || []).filter(pl => pl.category === 'TV Shows').length === 0 ? (
                  <div style={{ color: '#b3b8c5', fontSize: '1.1rem', padding: 32 }}>No playlists yet.</div>
                ) : (playlists || []).filter(pl => pl.category === 'TV Shows').map((pl, idx) => (
                  <div key={idx} className="playlist-card" onClick={() => { setActiveSection('Playlists'); setSelectedPlaylist(pl); }}>
                    <div className="playlist-card-title">{pl.name}</div>
                    <div className="playlist-card-count">{Array.isArray(pl.videos) ? pl.videos.length : 0} {Array.isArray(pl.videos) && pl.videos.length === 1 ? 'video' : 'videos'}</div>
                    <button className="star-btn" onClick={e => { e.stopPropagation(); handleToggleFeatured(pl); }} title={pl.featured ? 'Unmark as Featured' : 'Mark as Featured'}>
                      {pl.featured ? '★' : '☆'}
                    </button>
                    <button className="remove-playlist-btn" onClick={e => { e.stopPropagation(); handleRemovePlaylist(pl); }} title="Remove playlist">&times;</button>
                  </div>
                ))}
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.01em', marginBottom: 18, marginTop: 32 }}>All TV Shows</h3>
              <div className="uploaded-videos-grid">
                {(uploadedVideos || []).filter(v => v.category === 'TV Shows').length === 0 ? (
                  <div style={{ color: '#b3b8c5', fontSize: '1.1rem', padding: 32 }}>No TV shows yet.</div>
                ) : (uploadedVideos || []).filter(v => v.category === 'TV Shows').map((vid, idx) => (
                  <div key={idx} className="uploaded-video-card">
                    <button className="remove-btn" title="Remove video" onClick={() => handleRemoveVideo(vid)}>&times;</button>
                    <div className="play-overlay">
                      <button className="play-btn" onClick={() => handleVideoSelect(vid)}>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="11" cy="11" r="11" fill="none"/>
                          <polygon points="8,6 17,11 8,16" fill="white"/>
                        </svg>
                      </button>
                    </div>
                    {vid.thumbnail ? (
                      <img src={vid.thumbnail} alt="Thumbnail" className="uploaded-video-thumb" />
                    ) : (
                      <video src={videoURLs[vid.id]} className="uploaded-video-thumb" />
                    )}
                    <div className="uploaded-video-name">{vid.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'Youtube' ? (
            <div className="uploaded-videos-list" style={{ width: '100%' }}>
              {/* Featured Youtube Row */}
              {(() => {
                const allYoutube = (uploadedVideos || []).filter(v => v.category === 'Youtube');
                const featuredYoutube = getRandomMovies(allYoutube, 5);
                const placeholders = Array.from({ length: 5 - featuredYoutube.length });
                return (
                  <div style={{ display: 'flex', gap: 32, marginBottom: 36, marginTop: 8, justifyContent: 'center' }}>
                    {featuredYoutube.map((vid, idx) => (
                      <div key={vid.id} style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 340,
                        aspectRatio: '2 / 3',
                        background: '#181c24',
                        borderRadius: 18,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border 0.2s, transform 0.15s',
                      }} onClick={() => handleVideoSelect(vid)}>
                        {/* Thumbnail change button overlay */}
                        <label style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(30,34,44,0.85)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 4,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          opacity: 0.85,
                          transition: 'opacity 0.18s',
                        }} title="Change Thumbnail" onClick={e => e.stopPropagation()}>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleChangeThumbnail(vid, URL.createObjectURL(e.target.files[0]))} />
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" fill="currentColor"/>
                            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
                          </svg>
                        </label>
                        {vid.thumbnail ? (
                          <img src={vid.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                        ) : (
                          <video src={videoURLs[vid.id]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                        )}
                        {/* Gradient overlay for title */}
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: '32%',
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.82) 100%)',
                          zIndex: 2,
                          borderBottomLeftRadius: 18,
                          borderBottomRightRadius: 18,
                        }} />
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 3,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          textAlign: 'left',
                          padding: '0 16px 16px 16px',
                          textShadow: '0 2px 8px rgba(0,0,0,0.45)',
                          letterSpacing: '0.01em',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}>{vid.name}</div>
                      </div>
                    ))}
                    {placeholders.map((_, idx) => (
                      <div key={"youtube-placeholder-" + idx} style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 340,
                        aspectRatio: '2 / 3',
                        background: '#23283a',
                        borderRadius: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#b3b8c5',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        opacity: 0.5,
                      }}>
                        No video
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 24}}>
                <button className="create-playlist-btn" onClick={() => setShowCategoryPlaylistInput('Youtube')}>Create Playlist</button>
              </div>
              {showCategoryPlaylistInput === 'Youtube' && (
                <div style={{display: 'flex', gap: 8, marginBottom: 24}}>
                  <input
                    className="playlist-input"
                    type="text"
                    placeholder="Playlist name"
                    value={newCategoryPlaylistName}
                    onChange={e => setNewCategoryPlaylistName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateCategoryPlaylist('Youtube'); }}
                    autoFocus
                  />
                  <button className="playlist-save-btn" onClick={() => handleCreateCategoryPlaylist('Youtube')}>Save</button>
                  <button className="playlist-cancel-btn" onClick={() => { setShowCategoryPlaylistInput(null); setNewCategoryPlaylistName(''); }}>Cancel</button>
                </div>
              )}
              {videoSrc && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                  <VideoPlayer src={videoSrc} />
                </div>
              )}
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.01em', marginBottom: 18 }}>Youtube</h3>
              <div className="playlist-cards-grid">
                {(playlists || []).filter(pl => pl.category === 'Youtube').length === 0 ? (
                  <div style={{ color: '#b3b8c5', fontSize: '1.1rem', padding: 32 }}>No playlists yet.</div>
                ) : (playlists || []).filter(pl => pl.category === 'Youtube').map((pl, idx) => (
                  <div key={idx} className="playlist-card" onClick={() => { setActiveSection('Playlists'); setSelectedPlaylist(pl); }}>
                    <div className="playlist-card-title">{pl.name}</div>
                    <div className="playlist-card-count">{Array.isArray(pl.videos) ? pl.videos.length : 0} {Array.isArray(pl.videos) && pl.videos.length === 1 ? 'video' : 'videos'}</div>
                    <button className="star-btn" onClick={e => { e.stopPropagation(); handleToggleFeatured(pl); }} title={pl.featured ? 'Unmark as Featured' : 'Mark as Featured'}>
                      {pl.featured ? '★' : '☆'}
                    </button>
                    <button className="remove-playlist-btn" onClick={e => { e.stopPropagation(); handleRemovePlaylist(pl); }} title="Remove playlist">&times;</button>
                  </div>
                ))}
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.01em', marginBottom: 18, marginTop: 32 }}>All Youtube Videos</h3>
              <div className="uploaded-videos-grid">
                {(uploadedVideos || []).filter(v => v.category === 'Youtube').length === 0 ? (
                  <div style={{ color: '#b3b8c5', fontSize: '1.1rem', padding: 32 }}>No Youtube videos yet.</div>
                ) : (uploadedVideos || []).filter(v => v.category === 'Youtube').map((vid, idx) => (
                  <div key={idx} className="uploaded-video-card">
                    <button className="remove-btn" title="Remove video" onClick={() => handleRemoveVideo(vid)}>&times;</button>
                    <div className="play-overlay">
                      <button className="play-btn" onClick={() => handleVideoSelect(vid)}>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="11" cy="11" r="11" fill="none"/>
                          <polygon points="8,6 17,11 8,16" fill="white"/>
                        </svg>
                      </button>
                    </div>
                    {vid.thumbnail ? (
                      <img src={vid.thumbnail} alt="Thumbnail" className="uploaded-video-thumb" />
                    ) : (
                      <video src={videoURLs[vid.id]} className="uploaded-video-thumb" />
                    )}
                    <div className="uploaded-video-name">{vid.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'Work' ? (
            <div className="uploaded-videos-list" style={{ width: '100%' }}>
              {/* Featured Work Row */}
              {(() => {
                const allWork = (uploadedVideos || []).filter(v => v.category === 'Work');
                const featuredWork = getRandomMovies(allWork, 5);
                const placeholders = Array.from({ length: 5 - featuredWork.length });
                return (
                  <div style={{ display: 'flex', gap: 32, marginBottom: 36, marginTop: 8, justifyContent: 'center' }}>
                    {featuredWork.map((vid, idx) => (
                      <div key={vid.id} style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 340,
                        aspectRatio: '2 / 3',
                        background: '#181c24',
                        borderRadius: 18,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border 0.2s, transform 0.15s',
                      }} onClick={() => handleVideoSelect(vid)}>
                        {/* Thumbnail change button overlay */}
                        <label style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(30,34,44,0.85)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 4,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          opacity: 0.85,
                          transition: 'opacity 0.18s',
                        }} title="Change Thumbnail" onClick={e => e.stopPropagation()}>
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleChangeThumbnail(vid, URL.createObjectURL(e.target.files[0]))} />
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" fill="currentColor"/>
                            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
                          </svg>
                        </label>
                        {vid.thumbnail ? (
                          <img src={vid.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                        ) : (
                          <video src={videoURLs[vid.id]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18, position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                        )}
                        {/* Gradient overlay for title */}
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: '32%',
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.82) 100%)',
                          zIndex: 2,
                          borderBottomLeftRadius: 18,
                          borderBottomRightRadius: 18,
                        }} />
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 3,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          textAlign: 'left',
                          padding: '0 16px 16px 16px',
                          textShadow: '0 2px 8px rgba(0,0,0,0.45)',
                          letterSpacing: '0.01em',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}>{vid.name}</div>
                      </div>
                    ))}
                    {placeholders.map((_, idx) => (
                      <div key={"resources-placeholder-" + idx} style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 340,
                        aspectRatio: '2 / 3',
                        background: '#23283a',
                        borderRadius: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#b3b8c5',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        opacity: 0.5,
                      }}>
                        No video
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 24}}>
                <button className="create-playlist-btn" onClick={() => setShowCategoryPlaylistInput('Resources')}>Create Playlist</button>
              </div>
              {showCategoryPlaylistInput === 'Resources' && (
                <div style={{display: 'flex', gap: 8, marginBottom: 24}}>
                  <input
                    className="playlist-input"
                    type="text"
                    placeholder="Playlist name"
                    value={newCategoryPlaylistName}
                    onChange={e => setNewCategoryPlaylistName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateCategoryPlaylist('Resources'); }}
                    autoFocus
                  />
                  <button className="playlist-save-btn" onClick={() => handleCreateCategoryPlaylist('Resources')}>Save</button>
                  <button className="playlist-cancel-btn" onClick={() => { setShowCategoryPlaylistInput(null); setNewCategoryPlaylistName(''); }}>Cancel</button>
                </div>
              )}
              {videoSrc && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                  <VideoPlayer src={videoSrc} />
                </div>
              )}
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.01em', marginBottom: 18 }}>Resources</h3>
              <div className="playlist-cards-grid">
                {(playlists || []).filter(pl => pl.category === 'Resources').length === 0 ? (
                  <div style={{ color: '#b3b8c5', fontSize: '1.1rem', padding: 32 }}>No playlists yet.</div>
                ) : (playlists || []).filter(pl => pl.category === 'Resources').map((pl, idx) => (
                  <div key={idx} className="playlist-card" onClick={() => { setActiveSection('Playlists'); setSelectedPlaylist(pl); }}>
                    <div className="playlist-card-title">{pl.name}</div>
                    <div className="playlist-card-count">{Array.isArray(pl.videos) ? pl.videos.length : 0} {Array.isArray(pl.videos) && pl.videos.length === 1 ? 'video' : 'videos'}</div>
                    <button className="star-btn" onClick={e => { e.stopPropagation(); handleToggleFeatured(pl); }} title={pl.featured ? 'Unmark as Featured' : 'Mark as Featured'}>
                      {pl.featured ? '★' : '☆'}
                    </button>
                    <button className="remove-playlist-btn" onClick={e => { e.stopPropagation(); handleRemovePlaylist(pl); }} title="Remove playlist">&times;</button>
                  </div>
                ))}
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.01em', marginBottom: 18, marginTop: 32 }}>All Resources</h3>
              <div className="uploaded-videos-grid">
                {(uploadedVideos || []).filter(v => v.category === 'Resources').length === 0 ? (
                  <div style={{ color: '#b3b8c5', fontSize: '1.1rem', padding: 32 }}>No resources yet.</div>
                ) : (uploadedVideos || []).filter(v => v.category === 'Resources').map((vid, idx) => (
                  <div key={idx} className="uploaded-video-card">
                    <button className="remove-btn" title="Remove video" onClick={() => handleRemoveVideo(vid)}>&times;</button>
                    <div className="play-overlay">
                      <button className="play-btn" onClick={() => handleVideoSelect(vid)}>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="11" cy="11" r="11" fill="none"/>
                          <polygon points="8,6 17,11 8,16" fill="white"/>
                        </svg>
                      </button>
                    </div>
                    {vid.thumbnail ? (
                      <img src={vid.thumbnail} alt="Thumbnail" className="uploaded-video-thumb" />
                    ) : (
                      <video src={videoURLs[vid.id]} className="uploaded-video-thumb" />
                    )}
                    <div className="uploaded-video-name">{vid.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'Playlists' ? (
            <div style={{ width: '100%' }}>
              {!selectedPlaylist ? (
                <>
                  <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, letterSpacing: '0.01em', marginBottom: 32 }}>Your Playlists</h3>
                  <div className="playlist-cards-grid">
                    {(playlists || []).length === 0 ? (
                      <div style={{ color: '#b3b8c5', fontSize: '1.1rem', padding: 32 }}>No playlists yet.</div>
                    ) : (playlists || []).map((pl, idx) => (
                      <div key={idx} className="playlist-card" onClick={() => { setActiveSection('Playlists'); setSelectedPlaylist(pl); }}>
                        <div className="playlist-card-title">{pl.name}</div>
                        <div className="playlist-card-count">{Array.isArray(pl.videos) ? pl.videos.length : 0} {Array.isArray(pl.videos) && pl.videos.length === 1 ? 'video' : 'videos'}</div>
                        <button className="star-btn" onClick={e => { e.stopPropagation(); handleToggleFeatured(pl); }} title={pl.featured ? 'Unmark as Featured' : 'Mark as Featured'}>
                          {pl.featured ? '★' : '☆'}
                        </button>
                        <button className="remove-playlist-btn" onClick={e => { e.stopPropagation(); handleRemovePlaylist(pl); }} title="Remove playlist">&times;</button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button className="playlist-back-btn" onClick={() => setSelectedPlaylist(null)}>&larr; Back to Playlists</button>
                  <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, marginBottom: 24 }}>{selectedPlaylist.name}</h3>
                  <div className="uploaded-videos-grid">
                    {Array.isArray(selectedPlaylist.videos) && selectedPlaylist.videos.length === 0 ? (
                      <div style={{ color: '#b3b8c5', fontSize: '1.1rem', padding: 32 }}>No videos in this playlist.</div>
                    ) : Array.isArray(selectedPlaylist.videos) && selectedPlaylist.videos.map((url, idx) => {
                      const vid = uploadedVideos.find(v => v.id === url);
                      if (!vid) return null;
                      return (
                        <div key={idx} className="uploaded-video-card">
                          <div className="play-overlay">
                            <button className="play-btn" onClick={() => handleVideoSelect(vid)}>
                              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="11" fill="none"/>
                                <polygon points="8,6 17,11 8,16" fill="white"/>
                              </svg>
                            </button>
                          </div>
                          {vid.thumbnail ? (
                            <img src={vid.thumbnail} alt="Thumbnail" className="uploaded-video-thumb" />
                          ) : (
                            <video src={videoURLs[vid.id]} className="uploaded-video-thumb" />
                          )}
                          <div className="uploaded-video-name">{vid.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ) : activeSection === 'Internet archive' ? (
            <InternetArchivePage />
          ) : (
            <div className="home-dashboard">
              <div className="home-banner" style={{position: 'relative', overflow: 'hidden'}}>
                <BokehBalls>
                  <div className="home-banner-content">
                    <h2 className="home-banner-title">Welcome to Your Video Dashboard</h2>
                    <p className="home-banner-subtitle">A modern home for your videos, playlists, and more</p>
                  </div>
                </BokehBalls>
              </div>
              <div className="home-section">
                <h3>Browse Categories</h3>
                <div className="home-categories-row">
                  <button className="category-nav-btn" onClick={() => setActiveSection('Movies')}>Movies</button>
                  <button className="category-nav-btn" onClick={() => setActiveSection('TV Shows')}>TV Shows</button>
                  <button className="category-nav-btn" onClick={() => setActiveSection('Youtube')}>Youtube</button>
                  <button className="category-nav-btn" onClick={() => setActiveSection('Work')}>Work</button>
                  <button className="category-nav-btn" onClick={() => setActiveSection('Resources')}>Resources</button>
                </div>
                <div className="all-my-videos-strip" onClick={() => setActiveSection('My Videos')}>
                  <span className="all-my-videos-label">All My Videos</span>
                </div>
              </div>
              <div className="home-section">
                <h3>Top Playlists</h3>
                <div className="top-playlists-row">
                  {topPlaylists.map((pl, idx) => (
                    <button key={pl.name + idx} className="top-playlist-btn" onClick={() => { setActiveSection('Playlists'); setSelectedPlaylist(pl); }}>{pl.name}</button>
                  ))}
                  {topPlaylistsPlaceholders.map((_, idx) => (
                    <div key={"top-placeholder-" + idx} className="home-placeholder-card">No playlist</div>
                  ))}
                </div>
              </div>
              <div className="home-section">
                <h3>Recently Played</h3>
                <div className="uploaded-videos-grid">
                  {recentlyPlayedToShow.map((vid, idx) => (
                    <div key={vid.id} className="uploaded-video-card">
                      <div className="play-overlay">
                        <button className="play-btn" onClick={() => handleVideoSelect(vid)}>
                          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="11" fill="none"/>
                            <polygon points="8,6 17,11 8,16" fill="white"/>
                          </svg>
                        </button>
                      </div>
                      {vid.thumbnail ? (
                        <img src={vid.thumbnail} alt="Thumbnail" className="uploaded-video-thumb" />
                      ) : (
                        <video src={videoURLs[vid.id]} className="uploaded-video-thumb" />
                      )}
                      <div className="uploaded-video-name">{vid.name}</div>
                    </div>
                  ))}
                  {recentlyPlayedPlaceholders.map((_, idx) => (
                    <div key={"recent-placeholder-" + idx} className="home-placeholder-card">No recently played video</div>
                  ))}
                </div>
              </div>
              <div className="home-section">
                <h3>Featured Playlists</h3>
                <div className="playlist-cards-grid">
                  {featuredPlaylists.map((pl, idx) => (
                    <div key={pl.name + idx} className="playlist-card" onClick={() => { setActiveSection('Playlists'); setSelectedPlaylist(pl); }}>
                      <div className="playlist-card-title">{pl.name}</div>
                      <div className="playlist-card-count">{Array.isArray(pl.videos) ? pl.videos.length : 0} {Array.isArray(pl.videos) && pl.videos.length === 1 ? 'video' : 'videos'}</div>
                      <button className="star-btn" onClick={e => { e.stopPropagation(); handleToggleFeatured(pl); }} title={pl.featured ? 'Unmark as Featured' : 'Mark as Featured'}>
                        {pl.featured ? '★' : '☆'}
                      </button>
                      <button className="remove-playlist-btn" onClick={e => { e.stopPropagation(); handleRemovePlaylist(pl); }} title="Remove playlist">&times;</button>
                    </div>
                  ))}
                  {featuredPlaylistsPlaceholders.map((_, idx) => (
                    <div key={"featured-placeholder-" + idx} className="home-placeholder-card">No featured playlist</div>
                  ))}
                </div>
              </div>
              <div className="home-section">
                <h3>Watch Again</h3>
                <div className="uploaded-videos-grid">
                  {recentlyPlayedToShow.map((vid, idx) => (
                    <div key={"watch-again-" + vid.id} className="uploaded-video-card">
                      <div className="play-overlay">
                        <button className="play-btn" onClick={() => handleVideoSelect(vid)}>
                          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="11" fill="none"/>
                            <polygon points="8,6 17,11 8,16" fill="white"/>
                          </svg>
                        </button>
                      </div>
                      {vid.thumbnail ? (
                        <img src={vid.thumbnail} alt="Thumbnail" className="uploaded-video-thumb" />
                      ) : (
                        <video src={videoURLs[vid.id]} className="uploaded-video-thumb" />
                      )}
                      <div className="uploaded-video-name">{vid.name}</div>
                    </div>
                  ))}
                  {recentlyPlayedPlaceholders.map((_, idx) => (
                    <div key={"watch-again-placeholder-" + idx} className="home-placeholder-card">No watch again video</div>
                  ))}
                </div>
              </div>
              <div className="home-section">
                <h3>Random Internet Archive Playlists</h3>
                <div style={{ 
                  display: 'flex', 
                  gap: 16,
                  justifyContent: 'center',
                  paddingBottom: 8 
                }}>
                  {(() => {
                    // Pick 8 random collections
                    const shuffled = [...IA_COLLECTIONS].sort(() => 0.5 - Math.random());
                    const randomCollections = shuffled.slice(0, 8);
                    return randomCollections.map((col, idx) => (
                      <div
                        key={col.key}
                        style={{
                          minWidth: 160,
                          width: 160,
                          background: '#23283a',
                          borderRadius: 14,
                          padding: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          height: 280,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
                        }}
                        onClick={() => {
                          setActiveSection('Internet archive');
                          window.setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('openInternetArchiveCollection', { detail: col.key }));
                          }, 100);
                        }}
                      >
                        <img 
                          src={col.thumb} 
                          alt={col.title} 
                          style={{ 
                            width: '100%', 
                            height: 200,
                            objectFit: 'cover', 
                            borderRadius: 8, 
                            marginBottom: 12,
                            background: '#181c24'
                          }} 
                        />
                        <div style={{ 
                          color: '#fff', 
                          fontWeight: 600, 
                          fontSize: '1rem',
                          textAlign: 'center',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {col.title}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App; 