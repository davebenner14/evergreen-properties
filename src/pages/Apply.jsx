import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";
import "./Apply.css";

function Apply() {
  return (
    <div className="site">
      <Navbar />

      <main className="applyPage">
        {/* =========================
            HERO
        ========================= */}
        <section className="applyPageHero">
          <div className="sectionInner">
            <p className="eyebrow dark">Rental Applications</p>

            <h1>Find your next home with Evergreen.</h1>

            <p className="applyHeroText">
              Interested in renting an Evergreen Properties home? Tell us a
              little about yourself and what you're looking for. We'll use your
              information to help determine whether one of our current or
              upcoming rental opportunities may be a good fit.
            </p>
          </div>
        </section>

        {/* =========================
            BEFORE YOU APPLY
        ========================= */}
        <section className="section applyIntroSection">
          <div className="sectionInner twoCol">
            <div>
              <p className="eyebrow">Before You Apply</p>

              <h2>A simple first step toward finding the right rental.</h2>
            </div>

            <div>
              <p>
                Complete the rental inquiry form with your contact information
                and basic rental requirements.
              </p>

              <p>
                Submitting an inquiry does not guarantee availability or
                approval. If we have a property that may be a good match, we'll
                contact you with additional information and next steps.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            AIRTABLE APPLICATION FORM
        ========================= */}
        <section className="section applyFormSection">
          <div className="sectionInner">
            <div className="applyFormHeader">
              <p className="eyebrow dark">Rental Inquiry</p>

              <h2>Tell us what you're looking for.</h2>

              <p>
                Complete the form below to be considered for current and
                upcoming Evergreen Properties rentals.
              </p>
            </div>

            <div className="airtableFormWrapper">
              <iframe
                className="airtable-embed airtableApplyForm"
                src="https://airtable.com/embed/appmZFilPYR2vMKWB/pagP6nwG2S0tSYw6M/form"
                frameBorder="0"
                width="100%"
                height="900"
                title="Evergreen Properties Rental Application"
              />
            </div>
          </div>
        </section>

        {/* =========================
            QUESTIONS
        ========================= */}
        <section className="section applyContactSection">
          <div className="sectionInner">
            <p className="eyebrow dark">Questions?</p>

            <h2>Need help before submitting an inquiry?</h2>

            <p>
              Contact Evergreen Properties and we'll be happy to help with
              general questions about the rental inquiry process.
            </p>

            <a
              href="mailto:info@evergreenproperties.ca"
              className="button primary darkButton"
            >
              Contact Evergreen Properties
            </a>
          </div>
        </section>

        {/* =========================
            BACK TO HOME
        ========================= */}
        <section className="applyBackSection">
          <div className="sectionInner">
            <Link to="/" className="applyBackLink">
              ← Back to Evergreen Properties
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

export default Apply;