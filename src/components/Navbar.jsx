import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navLogo">
        <img src="/logos/EPHorLogo.png" alt="Evergreen Properties" />
      </Link>

      <div className="navLinks">
        <Link to="/about">About</Link>
        <a href="/#apply">Apply</a>
        <a href="/#maintenance">Maintenance</a>
        <a href="/#faq">FAQ</a>
        <a href="/#contact">Contact</a>
      </div>
    </nav>
  );
}

export default Navbar;