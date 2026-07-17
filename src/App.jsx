import "./App.css";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import LocalNews from "./components/LocalNews";

function App() {
  return (
    <div className="site">
      <Navbar />

      <main>
        <section className="hero">
          <video
            className="heroVideo"
            src="/videos/EPHero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="heroOverlay" />

          <div className="heroContent">
            <p className="eyebrow">Niagara & Fort Erie Rentals</p>

            <h1>Clean, well-managed rental homes.</h1>

            <p className="heroText">
              Evergreen Properties provides residential rentals maintained with
              care, stability, and long-term pride of ownership.
            </p>

            <div className="heroButtons">
              <Link to="/apply" className="button primary">
                Rental Inquiry
              </Link>

              <Link to="/maintenance" className="button secondary">
                Request Maintenance
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className="section aboutSection">
          <div className="sectionInner twoCol">
            <div>
              <p className="eyebrow dark">About Evergreen</p>

              <h2>Residential properties cared for with pride.</h2>
            </div>

            <div>
              <p>
                Evergreen Properties is a privately owned residential rental
                company focused on clean, safe, and well-maintained homes in
                Niagara and Fort Erie.
              </p>

              <p>
                We believe rental housing should feel stable, respectful, and
                properly cared for — for both tenants and the surrounding
                community.
              </p>

              <Link to="/about" className="button primary darkButton">
                Learn More About Us
              </Link>
            </div>
          </div>
        </section>

        <section id="apply" className="section cardSection">
          <div className="sectionInner">
            <p className="eyebrow dark">Rental Inquiry</p>

            <h2>Looking for a rental?</h2>

            <p>
              Submit an inquiry to be considered for current and upcoming rental
              opportunities with Evergreen Properties.
            </p>

            <Link to="/apply" className="button primary darkButton">
              Submit Rental Inquiry
            </Link>
          </div>
        </section>

        <section id="maintenance" className="section maintenanceSection">
          <div className="sectionInner twoCol">
            <div>
              <p className="eyebrow dark">Maintenance</p>

              <h2>Need something fixed?</h2>
            </div>

            <div>
              <p>
                Current tenants can submit maintenance requests for repairs,
                property issues, or general concerns.
              </p>

              <p className="note">
                For fire, flooding, gas leaks, or immediate danger, contact
                emergency services first.
              </p>

              <Link to="/maintenance" className="button primary darkButton">
                Submit Maintenance Request
              </Link>
            </div>
          </div>
        </section>

        <LocalNews />

        <section id="contact" className="section contactSection">
          <div className="sectionInner contactBox">
            <p className="eyebrow">General Contact</p>

            <h2>Have a question for Evergreen Properties?</h2>

            <p>
              For general questions about Evergreen Properties, our rentals, or
              our properties, send us a message through our contact form.
            </p>

            <Link to="/contact" className="button secondary">
              Contact Evergreen Properties
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <img src="/logos/EPIcon.png" alt="Evergreen Properties icon" />

        <p>© 2026 Evergreen Properties. Niagara & Fort Erie, Ontario.</p>
      </footer>
    </div>
  );
}

export default App;