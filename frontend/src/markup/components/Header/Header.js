import React, { useState } from 'react';
import classes from './Header.module.css';
// Import the Link component from react-router-dom 
import { Link } from 'react-router-dom'
// Import the logo image 
import logo from '../../../assets/images/logo.png';
import iconBar from '../../../assets/template_assets/images/icons/icon-bar.png';
import customLogo from '../../../assets/template_assets/images/custom/logo.png';
import logoTwo from '../../../assets/template_assets/images/logo-two.png';
// Import the login service to access the logout function
import loginService from '../../../services/login.service';
// Import the custom context hook 
import { useAuth } from '../../../Contexts/AuthContext';


function Header(props) {
  // Use the custom hook to access the data in the context 
  const { isLogged, setIsLogged, employee } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // console.log(useAuth());

  // Log out event handler function
  const logOut = () => {
    // Call the logout function from the login service 
    loginService.logOut();
    // Set the isLogged state to false 
    setIsLogged(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={isMenuOpen ? "mobile-menu-visible" : ""}>
      <header className="main-header header-style-one">
        <div className="header-top">
          <div className="auto-container">
            <div className="inner-container">
              <div className="left-column">
                <div className="text">Enjoy the Coffee while we fix your car</div>
                <div className="office-hour">Monday - Saturday 7:00AM - 6:00PM</div>
              </div>
              <div className="right-column">
                {isLogged ? (
                  <div className="link-btn">
                    <div className="phone-number"><strong>Welcome {employee?.employee_first_name}</strong></div>
                  </div>
                ) : (
                  <div className="phone-number">Schedule Appointment: <strong>1800 456 7890   </strong> </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="header-upper">
          <div className="auto-container">
            <div className="inner-container">
              <div className="logo-box">
                <div className={classes.logo}><Link to="/"><img src={logo} alt="" /></Link>
                </div>
              </div>
              <div className="right-column">
                <div className="nav-outer">
                  <div className="mobile-nav-toggler" onClick={toggleMenu}><img src={iconBar} alt="Toggle Mobile Menu" />
                  </div>
                  <nav className="main-menu navbar-expand-md navbar-light">
                    <div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent">
                      <ul className="navigation">
                        <li className="dropdown"><Link to="/">Home</Link>
                        </li>
                        <li className="dropdown"><Link to="/about">About Us</Link>
                        </li>
                        <li className="dropdown"><Link to="/services">Services</Link>
                        </li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        {isLogged && employee?.employee_role <= 3 && (
                          <li className="dropdown"><Link to="/admin">Admin</Link></li>
                        )}
                      </ul>
                    </div>
                  </nav>
                </div>
                <div className="search-btn"></div>
                {isLogged ? (
                  <div className="link-btn">
                    <Link to="/" className="theme-btn btn-style-one blue" onClick={logOut} >Log out</Link>
                  </div>
                ) : (
                  <div className="link-btn">
                    <Link to="/login" className="theme-btn btn-style-one">Login</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky-header">
          <div className="header-upper">
            <div className="auto-container">
              <div className="inner-container">
                <div className="logo-box">
                  <div className="logo"><Link to="/"><img src={customLogo} alt="" /></Link>
                  </div>
                </div>
                <div className="right-column">
                  <div className="nav-outer">
                    <div className="mobile-nav-toggler" onClick={toggleMenu}><img src={iconBar} alt="Toggle Mobile Menu" />
                    </div>

                    <nav className="main-menu navbar-expand-md navbar-light">
                    </nav>
                  </div>
                  <div className="search-btn"></div>
                  {isLogged ? (
                    <div className="link-btn">
                      <Link to="/" className="theme-btn btn-style-one blue" onClick={logOut} >Log out</Link>
                    </div>
                  ) : (
                    <div className="link-btn">
                      <Link to="/login" className="theme-btn btn-style-one">Login</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mobile-menu">
          <div className="menu-backdrop" onClick={toggleMenu}></div>
          <div className="close-btn" onClick={toggleMenu}><span className="icon flaticon-remove"></span></div>

          <nav className="menu-box">
            <div className="nav-logo"><Link to="/">
              <img src={logoTwo} alt=""
                title="" /></Link></div>
            <div className="menu-outer">
              <div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent">
                <ul className="navigation">
                  <li className="dropdown"><Link to="/" onClick={toggleMenu}>Home</Link></li>
                  <li className="dropdown"><Link to="/about" onClick={toggleMenu}>About Us</Link></li>
                  <li className="dropdown"><Link to="/services" onClick={toggleMenu}>Services</Link></li>
                  <li><Link to="/contact" onClick={toggleMenu}>Contact Us</Link></li>
                  {isLogged && employee?.employee_role <= 3 && (
                    <li className="dropdown"><Link to="/admin" onClick={toggleMenu}>Admin</Link></li>
                  )}
                  {isLogged ? (
                    <li><Link to="/" onClick={() => { logOut(); toggleMenu(); }}>Log out</Link></li>
                  ) : (
                    <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                  )}
                </ul>
              </div>
            </div>

          </nav>
        </div>

        <div className="nav-overlay">
          <div className="cursor"></div>
          <div className="cursor-follower"></div>
        </div>
      </header>
    </div>
  );
}

export default Header;