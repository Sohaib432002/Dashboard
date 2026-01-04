const StoneInfo = () => {
  // ================= THEME COLORS =================
  const THEME = {
    bg: '#0f172a', // main background
    card: '#1e293b', // card background
    accent: '#1cb5e0', // accent color / highlights
    text: '#e5e7eb', // text color
    border: '#94a3b8', // muted border
  }

  const cardStyle = {
    background: THEME.card,
    padding: 24,
    borderRadius: 16,
    color: THEME.text,
    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
  }

  const sectionTitleStyle = {
    color: THEME.accent,
    fontWeight: 600,
    fontSize: 18,
    marginBottom: 8,
  }

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 8,
  }

  const thStyle = {
    border: `1px solid ${THEME.accent}`,
    padding: '8px 12px',
    background: THEME.card,
    color: THEME.text,
    textAlign: 'left',
  }

  const tdStyle = {
    border: `1px solid ${THEME.accent}`,
    padding: '8px 12px',
    background: `${THEME.card}80`,
    color: THEME.text,
  }

  const ulStyle = {
    listStyleType: 'disc',
    marginLeft: 20,
    marginTop: 4,
  }

  return (
    <div style={cardStyle}>
      <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Kidney / Gallstone Characteristics Overview
      </h1>

      <section>
        <h2 style={sectionTitleStyle}>1. What are Stones?</h2>
        <p>
          Kidney stones or gallstones are <strong>solid concretions of minerals</strong> that form
          in the kidneys or gallbladder. They develop when substances in urine (or bile) such as
          calcium, oxalate, or uric acid become highly concentrated, crystallize, and aggregate.
        </p>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>2. Types of Stones</h2>
        <ul style={ulStyle}>
          <li>
            <strong>Calcium Stones:</strong> Most common; often calcium oxalate.
          </li>
          <li>
            <strong>Uric Acid Stones:</strong> Formed due to high uric acid levels.
          </li>
          <li>
            <strong>Struvite Stones:</strong> Usually caused by infections.
          </li>
          <li>
            <strong>Cystine Stones:</strong> Rare; caused by genetic disorders.
          </li>
        </ul>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>3. Key Characteristics</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Characteristic</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Age</td>
              <td style={tdStyle}>More common in adults aged 30–60 years.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Gender</td>
              <td style={tdStyle}>Males prone to kidney stones; females to gallstones.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Stone Size</td>
              <td style={tdStyle}>
                Varies from 1 mm to greater than 20 mm; size affects treatment.
              </td>
            </tr>
            <tr>
              <td style={tdStyle}>Stone Location</td>
              <td style={tdStyle}>
                Kidney: lower/mid/upper pole, renal pelvis; Gallbladder: gallbladder or bile ducts.
              </td>
            </tr>
            <tr>
              <td style={tdStyle}>Comorbidities</td>
              <td style={tdStyle}>
                Diabetes, obesity, hyperlipidemia, hypertension increase risk.
              </td>
            </tr>
            <tr>
              <td style={tdStyle}>Gallstone Status</td>
              <td style={tdStyle}>Presence (Yes/1) or absence (No/0).</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>4. Symptoms</h2>
        <ul style={ulStyle}>
          <li>Severe flank or abdominal pain (renal colic)</li>
          <li>Nausea and vomiting</li>
          <li>Blood in urine (hematuria)</li>
          <li>Recurrent urinary tract infections</li>
          <li>Gallstones: jaundice, fatty food intolerance, bloating</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>5. Risk Factors</h2>
        <ul style={ulStyle}>
          <li>Poor diet, low fluid intake, high salt/fat diet</li>
          <li>Family history increases risk</li>
          <li>Obesity, diabetes, metabolic syndrome</li>
          <li>Certain medications: diuretics, calcium supplements</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>6. Diagnostic & Clinical Relevance</h2>
        <p>
          Ultrasound and CT scans are commonly used for detection. Blood and urine tests can detect
          metabolic causes. Stone size, location, and comorbidities guide treatment decisions.
        </p>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>7. Data Analysis Applications</h2>
        <p>
          Using datasets of stone characteristics, we can visualize prevalence by age and gender,
          track size distribution, identify high-risk groups, and build interactive dashboards for
          research and clinical planning.
        </p>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Summary</h2>
        <p>
          Kidney and gallstones are common yet complex medical conditions. By analyzing age, gender,
          size, location, and comorbidities, medical professionals can better predict risk, tailor
          treatments, and improve patient outcomes. Modern data visualization enhances understanding
          and accessibility of these insights.
        </p>
      </section>
    </div>
  )
}

export default StoneInfo
