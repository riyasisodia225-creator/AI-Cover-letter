import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");

  function handlePdfUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
  }

  async function generateLetter() {
    if (!name || !role || !company || !skills) {
      alert("Please fill all fields!");
      return;
    }
    setLoading(true);
    setLetter("");
    const prompt = "Write a short professional cover letter for " + name + " applying for " + role + " at " + company + ". Skills: " + skills + ". Write 3 paragraphs only.";
    try {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + import.meta.env.VITE_GEMINI_API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await res.json();
      if (data.candidates) {
        setLetter(data.candidates[0].content.parts[0].text);
      } else {
        setLetter(JSON.stringify(data));
      }
    } catch (err) {
      setLetter("Error. Try again.");
    }
    setLoading(false);
  }

  function copyText() {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", padding: "30px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "620px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: "#2d3748", fontSize: "24px" }}>AI Cover Letter Generator</h1>
        <p style={{ textAlign: "center", color: "#718096", fontSize: "13px", marginBottom: "24px" }}>Fill details and generate instantly</p>

        <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#4a5568", fontWeight: "600", fontSize: "14px" }}>Your Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Riya Sisodia" style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#4a5568", fontWeight: "600", fontSize: "14px" }}>Job Role</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend Developer" style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#4a5568", fontWeight: "600", fontSize: "14px" }}>Target Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google" style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#4a5568", fontWeight: "600", fontSize: "14px" }}>Key Skills</label>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React.js, HTML, CSS" style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#4a5568", fontWeight: "600", fontSize: "14px" }}>Upload Resume (optional)</label>
            <input type="file" accept=".pdf,.txt" onChange={handlePdfUpload} style={{ width: "100%", padding: "10px", border: "1px dashed #cbd5e0", borderRadius: "8px", fontSize: "13px", background: "#f7fafc" }} />
            {fileName && <p style={{ marginTop: "5px", fontSize: "12px", color: "#48bb78" }}>Uploaded: {fileName}</p>}
          </div>
          <button onClick={generateLetter} disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#a0aec0" : "#4c6ef5", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>

        {letter && (
          <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginTop: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h2 style={{ color: "#2d3748", fontSize: "17px", margin: 0 }}>Your Cover Letter</h2>
              <button onClick={copyText} style={{ padding: "7px 14px", background: copied ? "#48bb78" : "#edf2f7", color: copied ? "white" : "#4a5568", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p style={{ color: "#4a5568", lineHeight: "1.8", fontSize: "14px", whiteSpace: "pre-wrap" }}>{letter}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;