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
        <Link to="/maintenance">Maintenance</Link>
        <Link to="/contact">Contact</Link>

        <a
          href="https://airtable.com/appmZFilPYR2vMKWB/pagsktftiTWwsFaFv?TGwni=b%3AWzAsWyJKR2NzaCIsMCx0cnVlLCJUR0kwdiJdXQ&Q8oQh=b%3AWzAsWyJKR2NzaCIsMCxudWxsLCJiYmVjNiJdXQ&Qniw5=b%3AWzAsWyJWRmFrWSIsOSxbInNlbFFmT3ptODFQNHZ4SFA5Iiwic2Vsbmk5bnh3SW1FVlptN3EiLCJzZWxKQjU3N1gxY3g2b3hubSJdLCJoWUg2OCJdXQ&BrXPW=b%3AWzAsWyJjMGVZayIsOSxbInNlbDc3TmFZV0RXMlRLeVBhIiwic2VsSU53T3FRM2ExamFVVEYiLCJzZWxTZXNSQzhJdWY2M1Y2YSJdLCJqN3lSTyJdXQ"
          target="_blank"
          rel="noopener noreferrer"
          className="staffLogin"
        >
          Staff Login
        </a>
      </div>
    </nav>
  );
}

export default Navbar;