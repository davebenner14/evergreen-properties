import "./App.css";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";

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
              <a href="#apply" className="button primary">
                Apply for a Rental
              </a>

              <a href="#maintenance" className="button secondary">
                Request Maintenance
              </a>
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
            <p className="eyebrow dark">Tenant Inquiry</p>
            <h2>Looking for a rental?</h2>

            <p>
              Submit an application or inquiry to be considered for current and
              upcoming rental opportunities.
            </p>

            <a href="#contact" className="button primary darkButton">
              Start Rental Inquiry
            </a>
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

              <a href="#contact" className="button primary darkButton">
                Submit Maintenance Request
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="section faqSection">
          <div className="sectionInner">
            <p className="eyebrow dark">FAQ</p>
            <h2>Common questions</h2>

            <div className="faqGrid">
              <div className="faqItem">
                <h3>Where are your properties located?</h3>
                <p>
                  Our rentals are primarily located in Niagara and Fort Erie,
                  Ontario.
                </p>
              </div>

              <div className="faqItem">
                <h3>How do I apply?</h3>
                <p>
                  Use the rental inquiry section to submit your information and
                  interest in available or upcoming rentals.
                </p>
              </div>

              <div className="faqItem">
                <h3>How do tenants request repairs?</h3>
                <p>
                  Tenants can use the maintenance request section to describe
                  the issue and provide contact details.
                </p>
              </div>

              <div className="faqItem">
                <h3>Are the properties luxury rentals?</h3>
                <p>
                  No. We focus on practical, clean, well-maintained residential
                  rental homes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contactSection">
          <div className="sectionInner contactBox">
            <p className="eyebrow">Contact</p>
            <h2>Get in touch with Evergreen Properties.</h2>

            <p>
              For rental inquiries, tenant questions, or maintenance requests,
              contact us below.
            </p>

            <a
              href="mailto:info@evergreenproperties.ca"
              className="button secondary"
            >
              Email Evergreen Properties
            </a>
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