import Navbar from "../components/Navbar";
import "./TenantApplication.css";

function TenantApplication() {
  return (
    <div className="tenantApplicationPage">
      <Navbar />

      <main className="tenantApplicationMain">
        <section className="tenantApplicationHero">
          <div className="tenantApplicationHeroInner">
            <p className="eyebrow dark">Evergreen Properties</p>

            <h1>Tenant Application</h1>

            <p className="tenantApplicationIntro">
              Please complete the application below as accurately and completely
              as possible. The information provided will help Evergreen
              Properties review your application for tenancy.
            </p>

            <p className="tenantApplicationNote">
              Please ensure all required information is included before
              submitting your application.
            </p>
          </div>
        </section>

        <section className="tenantApplicationFormSection">
          <div className="tenantApplicationFormContainer">
            <iframe
              className="airtable-embed tenantApplicationAirtableForm"
              src="https://airtable.com/embed/appmZFilPYR2vMKWB/pagLvhZnDpB9jCXhv/form"
              frameBorder="0"
              title="Evergreen Properties Tenant Application"
            />
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
//this is a test

export default TenantApplication;