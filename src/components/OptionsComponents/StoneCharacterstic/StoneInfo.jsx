const StoneInfo = () => {
  return (
    <div className="card space-y-5">
      <h1 className="text-center text-xl font-bold sm:text-2xl">
        Kidney / Gallstone Characteristics Overview
      </h1>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-cyan-400">1. What are Stones?</h2>
        <p>
          Kidney stones or gallstones are <strong>solid concretions of minerals</strong> that form
          in the kidneys or gallbladder. They develop when substances in urine (or bile) such as
          calcium, oxalate, or uric acid become highly concentrated, crystallize, and aggregate.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-cyan-400">2. Types of Stones</h2>
        <ul className="ml-5 list-disc space-y-1">
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
        <h2 className="mb-2 text-lg font-semibold text-cyan-400">3. Key Characteristics</h2>
        <div className="table-wrap">
          <table className="mt-2 w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-cyan-400 bg-slate-900 px-3 py-2 text-left">
                  Characteristic
                </th>
                <th className="border border-cyan-400 bg-slate-900 px-3 py-2 text-left">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-cyan-400 px-3 py-2">Age</td>
                <td className="border border-cyan-400 px-3 py-2">
                  More common in adults aged 30–60 years.
                </td>
              </tr>
              <tr>
                <td className="border border-cyan-400 px-3 py-2">Gender</td>
                <td className="border border-cyan-400 px-3 py-2">
                  Males prone to kidney stones; females to gallstones.
                </td>
              </tr>
              <tr>
                <td className="border border-cyan-400 px-3 py-2">Stone Size</td>
                <td className="border border-cyan-400 px-3 py-2">
                  Varies from 1 mm to greater than 20 mm; size affects treatment.
                </td>
              </tr>
              <tr>
                <td className="border border-cyan-400 px-3 py-2">Stone Location</td>
                <td className="border border-cyan-400 px-3 py-2">
                  Kidney: lower/mid/upper pole, renal pelvis; Gallbladder: gallbladder or bile
                  ducts.
                </td>
              </tr>
              <tr>
                <td className="border border-cyan-400 px-3 py-2">Comorbidities</td>
                <td className="border border-cyan-400 px-3 py-2">
                  Diabetes, obesity, hyperlipidemia, hypertension increase risk.
                </td>
              </tr>
              <tr>
                <td className="border border-cyan-400 px-3 py-2">Gallstone Status</td>
                <td className="border border-cyan-400 px-3 py-2">
                  Presence (Yes/1) or absence (No/0).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-cyan-400">4. Symptoms</h2>
        <ul className="ml-5 list-disc space-y-1">
          <li>Severe flank or abdominal pain (renal colic)</li>
          <li>Nausea and vomiting</li>
          <li>Blood in urine (hematuria)</li>
          <li>Recurrent urinary tract infections</li>
          <li>Gallstones: jaundice, fatty food intolerance, bloating</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-cyan-400">5. Risk Factors</h2>
        <ul className="ml-5 list-disc space-y-1">
          <li>Poor diet, low fluid intake, high salt/fat diet</li>
          <li>Family history increases risk</li>
          <li>Obesity, diabetes, metabolic syndrome</li>
          <li>Certain medications: diuretics, calcium supplements</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-cyan-400">
          6. Diagnostic & Clinical Relevance
        </h2>
        <p>
          Ultrasound and CT scans are commonly used for detection. Blood and urine tests can detect
          metabolic causes. Stone size, location, and comorbidities guide treatment decisions.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-cyan-400">7. Data Analysis Applications</h2>
        <p>
          Using datasets of stone characteristics, we can visualize prevalence by age and gender,
          track size distribution, identify high-risk groups, and build interactive dashboards for
          research and clinical planning.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-cyan-400">Summary</h2>
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
