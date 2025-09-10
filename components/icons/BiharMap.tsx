import React from 'react';

const BiharMap = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 90 80"
    aria-labelledby="bihar-map-title"
    role="img"
    style={{
        maxWidth: '180px',
        margin: '0 auto',
        display: 'block',
    }}
  >
    <title id="bihar-map-title">Map of Bihar State</title>
    <path
      className="map-animation"
      d="M84.7,46.2l-2.5-1.6l-1.3-3.2l-2.1,0.2l-1.6-2.9l-3.2,0.5l-1.3-1.6l-3.7,0.2l-3.2-1.8L64.8,34l-3.4,0.5l-1.6-2.1 l-2.9,1.6l-2.1-1.3l-2.7,1.8l-1.8-1.3l-2.9,0.9l-2.4-2.1l-2.9,0.5l-2.7-1.3l-3.7,0.9l-2.7-1.8l-1.8,1.3l-2.1-0.9l-3.7,0.9 l-2.4-1.3l-2.9,1.1l-1.8-1.3l-2.4,1.1l-2.1-1.3l-2.1,0.9l-2.7-1.1l-1.3-2.1l-2.7,0.9l-1.8-1.3l-2.1-1.3l-1.6,2.7l-2.7-0.2 l-1.3,2.9l-2.9,0.2l-1.3,2.4l-1.3,4.3l0.5,3.7l1.3,4.5l1.3,2.7l2.4,1.6l1.3,2.4l3.2,1.3l1.1,2.7l3.4,1.3l1.8,2.7l3.7-0.2 l2.4,1.8l1.3,2.4l2.9,0.9l3.4,2.9l4,0.5l2.7,2.1l3.7-0.5l4.3,1.3l2.7,2.1l4-0.5l3.4,1.3l2.9,2.7l4.3-0.2l3.4,1.8 l2.9,2.7l2.7-0.9l2.9,2.1l4.3,0.5l2.1,2.4l2.4-2.1l1.8,1.3l1.6-2.7l2.1,0.5l1.8-3.2l0.2-3.7l-1.6-2.9l-0.5-3.4 l-2.1-2.4l-0.5-3.7l-2.1-2.1l-0.9-4l0.2-3.2l1.3-2.4L84.7,46.2z"
      fill="var(--secondary-bg)"
      stroke="var(--primary-color)"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BiharMap;