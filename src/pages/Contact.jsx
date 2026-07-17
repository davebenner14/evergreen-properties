import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Contact.css";

function Contact() {
  return (
    <div className="site contactPage">
      <Navbar />

      <main>
        <section className="contactPageHero">
          <div className="contactPageHeroInner">
            <p className="eyebrow dark">General Inquiries</p>

            <h1>How can we help?</h1>

            <p>
              Have a general question about Evergreen Properties? Send us a
              message below and we'll review your inquiry as soon as possible.
            </p>
          </div>
        </section>

        <section className="contactLinksSection">
          <div className="contactLinksInner">
            <div className="contactLinksHeader">
              <p className="eyebrow dark">Looking for something else?</p>
              <h2>We can point you in the right direction.</h2>
            </div>

            <div className="contactLinkGrid">
              <Link to="/apply" className="contactLinkCard">
                <span className="contactLinkIcon">🏠</span>

                <h3>Rental Inquiry</h3>

                <p>
                  Interested in renting with Evergreen Properties? Submit a
                  rental inquiry for current and upcoming opportunities.
                </p>

                <span className="contactLinkArrow">
                  Submit Rental Inquiry →
                </span>
              </Link>

              <Link to="/maintenance" className="contactLinkCard">
                <span className="contactLinkIcon">🛠️</span>

                <h3>Maintenance Request</h3>

                <p>
                  Are you a current tenant who needs a repair or has a property
                  maintenance concern?
                </p>

                <span className="contactLinkArrow">
                  Request Maintenance →
                </span>
              </Link>

              <Link to="/about" className="contactLinkCard">
                <span className="contactLinkIcon">🌲</span>

                <h3>About Evergreen</h3>

                <p>
                  Learn more about Evergreen Properties, our approach, and how
                  we care for our rental homes.
                </p>

                <span className="contactLinkArrow">
                  Learn More About Us →
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="contactFormSection">
          <div className="contactFormInner">
            <div className="contactFormIntro">
              <p className="eyebrow">General Contact</p>

              <h2>Still have a question?</h2>

              <p>
                Use the form below for general inquiries that don't fall into
                one of the categories above.
              </p>
            </div>

            <div className="contactFormCard">
              <iframe
                className="airtableEmbed contactAirtableEmbed"
                src="https://airtable.com/embed/appmZFilPYR2vMKWB/pag2pOwSLyPMzEsy5/form"
                frameBorder="0"
                width="100%"
                height="650"
                title="Evergreen Properties General Inquiry Form"
              />
            </div>
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

export default Contact;