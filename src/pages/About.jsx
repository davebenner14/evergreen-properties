import "../App.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="site">
      <Navbar />

      <main>
        <section className="section aboutPageHero">
          <div className="sectionInner">
            <p className="eyebrow dark">About Evergreen</p>

            <h1>Homes cared for with long-term pride of ownership.</h1>

            <p className="heroText darkText">
              Evergreen Properties is a privately owned residential rental
              company serving communities throughout Niagara and Fort Erie,
              Ontario.
            </p>
          </div>
        </section>

        <section className="section aboutSection">
          <div className="sectionInner twoCol">
            <div>
              <p className="eyebrow dark">Our Approach</p>
              <h2>Simple, responsible property management.</h2>
            </div>

            <div>
              <p>
                We believe a rental home should be clean, safe, functional, and
                properly maintained. Our approach is centered on taking care of
                our properties and creating a stable rental experience for the
                people who call them home.
              </p>

              <p>
                As long-term property owners, we take pride in maintaining our
                homes and addressing issues responsibly. We understand that
                good property management is about more than maintaining a
                building — it is also about respecting tenants, neighbours, and
                the surrounding community.
              </p>
            </div>
          </div>
        </section>

        <section className="section cardSection">
          <div className="sectionInner twoCol">
            <div>
              <p className="eyebrow dark">Our Properties</p>
              <h2>Local roots. A long-term commitment to our communities.</h2>
            </div>

            <div>
              <p>
                Our roots are here in the Niagara and Fort Erie region. Having
                grown up in the area, we know these communities and are proud
                to continue investing in the places we know and call home.
              </p>

              <p>
                Our portfolio is focused on residential rental properties
                throughout the region. We take a long-term approach to
                ownership, with a focus on maintaining our homes responsibly
                and contributing positively to the neighbourhoods they are
                part of.
              </p>

              <p>
                We are not focused on luxury rentals or large-scale property
                management. Our goal is straightforward: provide clean,
                well-maintained homes and care for our properties with the same
                pride we have for the communities around them.
              </p>
            </div>
          </div>
        </section>

        <section className="section maintenanceSection">
          <div className="sectionInner twoCol">
            <div>
              <p className="eyebrow dark">Our Commitment</p>
              <h2>Respect for tenants, properties, and communities.</h2>
            </div>

            <div>
              <p>
                We work to maintain our properties responsibly and provide
                tenants with a clear way to communicate questions, concerns,
                and maintenance needs.
              </p>

              <p>
                We believe that well-cared-for rental properties benefit
                everyone — the people living in them, the property owners, and
                the neighbourhoods around them.
              </p>

              <Link to="/#apply" className="button primary darkButton">
                Looking for a Rental?
              </Link>
            </div>
          </div>
        </section>

        <section className="section contactSection">
          <div className="sectionInner contactBox">
            <p className="eyebrow">Evergreen Properties</p>

            <h2>Questions about our properties?</h2>

            <p>
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