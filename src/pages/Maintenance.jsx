import Navbar from "../components/Navbar";
import "./Maintenance.css";

function Maintenance() {
  return (
    <div className="maintenancePage">
      <Navbar />

      <main className="maintenanceMain">
        <section className="maintenanceHero">
          <div className="maintenanceHeroInner">
            <p className="eyebrow dark">Tenant Maintenance</p>

            <h1>Submit a maintenance request.</h1>

            <p className="maintenanceIntro">
              Current tenants can use the form below to report repairs,
              maintenance issues, or property concerns. Please provide as much
              detail as possible so we can review your request.
            </p>

            <p className="maintenanceEmergency">
              For fire, flooding, gas leaks, or immediate danger, contact
              emergency services first.
            </p>
          </div>
        </section>

        <section className="maintenanceFormSection">
          <div className="maintenanceFormContainer">
            <iframe
              className="airtable-embed maintenanceAirtableForm"
              src="https://airtable.com/embed/appmZFilPYR2vMKWB/pagWiDwgCzVQlfenN/form"
              frameBorder="0"
              title="Evergreen Properties Maintenance Request"
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

export default Maintenance;