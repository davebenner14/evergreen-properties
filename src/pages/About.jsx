import "../App.css";
import "./About.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="site aboutPage">
      <Navbar />

      <main>
        {/* =========================
            HERO
        ========================= */}
        <section className="aboutHero">
          <div className="aboutContainer">
            <p className="aboutEyebrow">About Evergreen</p>

            <h1>Homes cared for with long-term pride of ownership.</h1>

            <p className="aboutHeroText">
              Evergreen Properties is a privately owned residential rental
              company serving communities throughout Niagara and Fort Erie,
              Ontario.
            </p>
          </div>
        </section>

        {/* =========================
            LOCAL ROOTS
        ========================= */}
        <section className="aboutLocal">
          <div className="aboutContainer aboutGrid">
            <div className="aboutHeadingColumn">
              <p className="aboutEyebrow">Local Roots</p>

              <h2>
                A long-term commitment to the communities we know.
              </h2>
            </div>

            <div className="aboutContentColumn">
              <p>
                Our roots are here in the Niagara and Fort Erie region. Having
                grown up in the area, we know these communities and are proud
                to continue investing in the places we know and call home.
              </p>

              <p>
                Evergreen Properties is a locally focused rental business with
                a small portfolio of duplex and triplex properties in Fort Erie
                and Niagara Falls.
              </p>

              <p>
                Many of our properties are older homes that require ongoing
                care, maintenance, and improvement. We take a long-term
                approach to ownership and are committed to investing in our
                properties responsibly over time.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            OUR APPROACH
        ========================= */}
        <section className="aboutApproach">
          <div className="aboutContainer aboutGrid">
            <div className="aboutHeadingColumn">
              <p className="aboutEyebrow">Our Approach</p>

              <h2>Simple, responsible property management.</h2>
            </div>

            <div className="aboutContentColumn">
              <p>
                We believe a rental home should be clean, safe, functional, and
                properly maintained. Our approach is centered on taking care of
                our properties and creating a stable rental experience for the
                people who call them home.
              </p>

              <p>
                As long-term property owners, we take pride in maintaining our
                homes and addressing issues responsibly.
              </p>

              <p>
                Good property management is about more than maintaining a
                building. It is also about respecting tenants, neighbours, and
                the surrounding community.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            OUR COMMITMENT
        ========================= */}
        <section className="aboutCommitment">
          <div className="aboutContainer">
            <div className="aboutCommitmentCard">
              <div className="aboutGrid">
                <div className="aboutHeadingColumn">
                  <p className="aboutEyebrow">Our Commitment</p>

                  <h2>
                    Respect for tenants, properties, and communities.
                  </h2>
                </div>

                <div className="aboutContentColumn">
                  <p>
                    We work to maintain our properties responsibly and provide
                    tenants with a clear way to communicate questions,
                    concerns, and maintenance needs.
                  </p>

                  <p>
                    We believe well-cared-for rental properties benefit
                    everyone — the people living in them, the property owners,
                    and the neighbourhoods around them.
                  </p>

                  <p>
                    Our goal is straightforward: provide practical, safe, and
                    well-cared-for rental homes while being responsible
                    property owners and good members of the communities where
                    our properties are located.
                  </p>

                  <Link to="/#apply" className="button primary darkButton">
                    Looking for a Rental?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CONTACT
        ========================= */}
        <section className="aboutContact">
          <div className="aboutContainer">
            <p className="aboutEyebrow">Evergreen Properties</p>

            <h2>Questions about our properties?</h2>

            <p className="aboutContactText">
              Get in touch with us for rental inquiries, tenant questions, or
              general information.
            </p>

            <a
              href="mailto:info@evergreenproperties.ca"
              className="button secondary"
            >
              Contact Evergreen Properties
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

export default About;