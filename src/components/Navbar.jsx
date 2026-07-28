import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navLogo">
        <img src="/logos/EPHorLogo.png" alt="Evergreen Properties" />
      </Link>

      <div className="navLinks">
        <Link to="/about">About</Link>
        <Link to="/apply">Apply</Link>
        <Link to="/tenant-application">Tenant Application</Link>
        <Link to="/maintenance">Maintenance</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar;