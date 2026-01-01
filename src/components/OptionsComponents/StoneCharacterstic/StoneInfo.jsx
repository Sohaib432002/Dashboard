const StoneInfo = () => {
  const GRADIENT_START = '#000046'
  const GRADIENT_END = '#1cb5e0'
  const TEXT_COLOR = '#ffffff'
  const ACCENT_COLOR = '#a2d15f' // For section titles

  const cardClasses =
    'p-6 rounded-xl shadow-lg bg-gradient-to-br from-[#000046] to-[#1cb5e0] text-white space-y-6'

  const sectionTitleClasses = 'text-[#00bfff] font-semibold text-lg mb-2'

  const tableClasses = 'w-full border-collapse mt-2'
  const thClasses = 'border border-[#a2d15f] px-3 py-2 bg-[#000046] text-white'
  const tdClasses = 'border border-[#a2d15f] px-3 py-2 bg-[#1cb5e0]/30 text-white'

  return (
    <div className={cardClasses}>
      <h1 className="text-center text-2xl font-bold text-[#ffffff] mb-4">
        Kidney / Gallstone Characteristics Overview
      </h1>

      <section>
        <h2 className={sectionTitleClasses}>1. What are Stones?</h2>
        <p>
          Kidney stones or gallstones are <strong>solid concretions of minerals</strong>
          that form in the kidneys or gallbladder. They develop when substances in urine (or bile)
          such as calcium, oxalate, or uric acid become highly concentrated, crystallize, and
          aggregate.
        </p>
      </section>

      <section>
        <h2 className={sectionTitleClasses}>2. Types of Stones</h2>
        <ul className="list-disc ml-6">
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
        <h2 className={sectionTitleClasses}>3. Key Characteristics</h2>
        <table className={tableClasses}>
          <thead>
            <tr>
              <th className={thClasses}>Characteristic</th>
              <th className={thClasses}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdClasses}>Age</td>
              <td className={tdClasses}>More common in adults aged 30–60 years.</td>
            </tr>
            <tr>
              <td className={tdClasses}>Gender</td>
              <td className={tdClasses}>Males prone to kidney stones; females to gallstones.</td>
            </tr>
            <tr>
              <td className={tdClasses}>Stone Size</td>
              <td className={tdClasses}>
                Varies from 1 mm to greater than 20 mm; size affects treatment.
              </td>
            </tr>
            <tr>
              <td className={tdClasses}>Stone Location</td>
              <td className={tdClasses}>
                Kidney: lower/mid/upper pole, renal pelvis; Gallbladder: gallbladder or bile ducts.
              </td>
            </tr>
            <tr>
              <td className={tdClasses}>Comorbidities</td>
              <td className={tdClasses}>
                Diabetes, obesity, hyperlipidemia, hypertension increase risk.
              </td>
            </tr>
            <tr>
              <td className={tdClasses}>Gallstone Status</td>
              <td className={tdClasses}>Presence (Yes/1) or absence (No/0).</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className={sectionTitleClasses}>4. Symptoms</h2>
        <ul className="list-disc ml-6">
          <li>Severe flank or abdominal pain (renal colic)</li>
          <li>Nausea and vomiting</li>
          <li>Blood in urine (hematuria)</li>
          <li>Recurrent urinary tract infections</li>
          <li>Gallstones: jaundice, fatty food intolerance, bloating</li>
        </ul>
      </section>

      <section>
        <h2 className={sectionTitleClasses}>5. Risk Factors</h2>
        <ul className="list-disc ml-6">
          <li>Poor diet, low fluid intake, high salt/fat diet</li>
          <li>Family history increases risk</li>
          <li>Obesity, diabetes, metabolic syndrome</li>
          <li>Certain medications: diuretics, calcium supplements</li>
        </ul>
      </section>

      <section>
        <h2 className={sectionTitleClasses}>6. Diagnostic & Clinical Relevance</h2>
        <p>
          Ultrasound and CT scans are commonly used for detection. Blood and urine tests can detect
          metabolic causes. Stone size, location, and comorbidities guide treatment decisions.
        </p>
      </section>

      <section>
        <h2 className={sectionTitleClasses}>7. Data Analysis Applications</h2>
        <p>
          Using datasets of stone characteristics, we can visualize prevalence by age and gender,
          track size distribution, identify high-risk groups, and build interactive dashboards for
          research and clinical planning.
        </p>
      </section>

      <section>
        <h2 className={sectionTitleClasses}>Summary</h2>
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
