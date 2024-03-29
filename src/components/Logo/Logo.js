import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './artificial-intelligence.png';

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt options={{ max: 55 }} style={{ height: 150, width: 150 }}>
        <div className="Tilt-inner">
          <img style={{ paddingTop: '5px' }} src={brain} alt="brain" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
