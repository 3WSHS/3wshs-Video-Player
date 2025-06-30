import React, { useRef, useState, useEffect } from 'react';
import './UploadForm.css';

function UploadForm({ onUpload, uploadedVideos, onVideoSelect, onRemove, onAddToPlaylist, playlists, onCategorize, onChangeThumbnail }) {
  const dropRef = useRef();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(null);
  const dropdownRef = useRef();

  // Click-away listener for category dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        // Also check the button itself
        !event.target.closest('.category-btn')
      ) {
        setShowCategoryDropdown(null);
      }
    }
    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  const handleFile = (file) => {
    if (file && (file.type === 'video/mp4' || file.type === 'video/quicktime')) {
      onUpload({ file, name: file.name, type: file.type });
    } else {
      alert('Please select a .mp4 or .mov video file.');
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleThumbnailChange = (vid, e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('image/'))) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChangeThumbnail(vid, ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a JPG or PNG image.');
    }
  };

  const categories = ['Movies', 'TV Shows', 'Youtube', 'Work', 'Resources'];

  return (
    <div className="upload-form-full">
      <h2 className="upload-section-title">Upload Video</h2>
      <div
        className="upload-drop-area"
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="upload-drop-icon">⬆️</div>
        <div>Drag and drop your video here, or <label className="upload-browse"><input type="file" accept="video/mp4,video/quicktime" onChange={handleFileChange} />browse</label></div>
        <div className="upload-drop-support">Supports MP4, MOV formats</div>
      </div>
      {uploadedVideos && uploadedVideos.length > 0 && (
        <div className="uploaded-videos-list">
          <h3>Your Videos</h3>
          <div className="uploaded-videos-grid">
            {uploadedVideos.map((vid) => (
              <div key={vid.id} className="uploaded-video-card">
                <button className="remove-btn" title="Remove video" onClick={() => onRemove(vid)}>&times;</button>
                {playlists && playlists.length > 0 && (
                  <button className="add-to-playlist-btn" title="Add to Playlist" onClick={() => onAddToPlaylist(vid)}>+</button>
                )}
                <button className="category-btn" title="Categorize" onClick={() => setShowCategoryDropdown(showCategoryDropdown === vid.id ? null : vid.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="currentColor"/>
                  </svg>
                </button>
                {showCategoryDropdown === vid.id && (
                  <div
                    className="category-dropdown"
                    ref={dropdownRef}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{color:'#b3b8c5', padding:'8px 16px', fontSize:'0.98rem'}}>Categorize video as:</div>
                    {categories.map(category => (
                      <div
                        key={category}
                        className="category-dropdown-item"
                        onClick={() => {
                          onCategorize(vid, category);
                          setShowCategoryDropdown(null);
                        }}
                      >
                        {category}
                      </div>
                    ))}
                    <div className="category-dropdown-item" style={{color:'#ff4f4f'}} onClick={() => setShowCategoryDropdown(null)}>Cancel</div>
                  </div>
                )}
                <label className="thumbnail-btn" title="Change Thumbnail">
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleThumbnailChange(vid, e)} />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" fill="currentColor"/>
                    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
                  </svg>
                </label>
                <div className="play-overlay">
                  <button className="play-btn" onClick={() => onVideoSelect(vid)}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="11" fill="none"/>
                      <polygon points="8,6 17,11 8,16" fill="white"/>
                    </svg>
                  </button>
                </div>
                {vid.thumbnail ? (
                  <img src={vid.thumbnail} alt="Thumbnail" className="uploaded-video-thumb" />
                ) : (
                  <video src={vid.url} className="uploaded-video-thumb" />
                )}
                <div className="uploaded-video-name">{vid.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadForm; 