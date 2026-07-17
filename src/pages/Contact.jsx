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

        <section className="contactFormSection">
          <div className="contactFormInner">
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