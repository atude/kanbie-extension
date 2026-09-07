import React from 'react';
import KanbieLogo from '../assets/kanbie-logo.svg';

export function Header({ hideKanbieText }) {
  return (
    <div className="header-container">
      <img
        alt="logo"
        src={KanbieLogo}
        width={28}
        className={hideKanbieText ? 'header kanbie-logo-color' : 'kanbie-logo kanbie-logo-color'}
      />
      {!hideKanbieText && <div className="header">kanbie</div>}
    </div>
  );
}

export default Header;

