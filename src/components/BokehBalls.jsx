import React from 'react';
import './BokehBalls.css';

const BALLS = [
  { size: 120, top: '10%', left: '15%', color: 'rgba(79,140,255,0.18)', duration: 18 },
  { size: 90, top: '40%', left: '30%', color: 'rgba(255,255,255,0.13)', duration: 22 },
  { size: 160, top: '25%', left: '60%', color: 'rgba(79,140,255,0.13)', duration: 26 },
  { size: 80, top: '60%', left: '75%', color: 'rgba(255,255,255,0.10)', duration: 20 },
  { size: 100, top: '70%', left: '45%', color: 'rgba(79,140,255,0.10)', duration: 24 },
];

export default function BokehBalls({ children }) {
  return (
    <div className="bokeh-balls-bg">
      {BALLS.map((ball, i) => (
        <div
          key={i}
          className="bokeh-ball"
          style={{
            width: ball.size,
            height: ball.size,
            top: ball.top,
            left: ball.left,
            background: ball.color,
            animationDuration: `${ball.duration}s`,
          }}
        />
      ))}
      <div className="bokeh-balls-content">{children}</div>
    </div>
  );
} 