import React from "react";
import Menu from "./Menu";

/**
 * Header wraps the animated GSAP Menu component.
 * Additional top-bar elements (announcement strip, search icon) can be added here.
 */
const Header: React.FC = () => {
  return (
    <header>
      <Menu />
    </header>
  );
};

export default Header;
