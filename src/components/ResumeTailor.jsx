import React, { useState, useRef, useCallback } from "react";

const SYSTEM_PROMPT = `You are an expert resume writer and career coach. Your task is to tailor a resume to match a specific job description.

INSTRUCTIONS:
1. Analyze the job description for key requirements, skills, technologies, and qualifications.
2. Rewrite the resume to emphasize relevant experience and skills that match the job description.
3. Use keywords and phrases from the job description naturally throughout the resume.
4. Quantify achievements where possible.
5. Reorder bullet points to prioritize the most relevant experience.
6. Keep the resume truthful — only reframe and emphasize existing experience, never fabricate.
7. Maintain professional formatting and concise language.
8. Output ONLY the tailored resume content in clean markdown format. No preamble or explanation.`;

const STEPS = [
  { id: 0, label: "Upload Resume", icon: "📄" },
  { id: 1, label: "Job Description", icon: "💼" },
  { id: 2, label: "API Key", icon: "🔑" },
  { id: 3, label: "Result", icon: "✨" },
];

async function extractPdfText(file) {
  const pdfjsLib = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const parts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    parts.push(content.items.map((item) => item.str).join(" "));
  }
  return parts.join("\n\n");
}

async function extractDocxText(file) {
  const mammoth = await import("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function extractPlainText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

function ResumeTailor() {
  const [step, setStep] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    setError("");
    setParsing(true);
    setResumeFileName(file.name);
    const name = file.name.toLowerCase();
    try {
      let text = "";
      if (name.endsWith(".pdf")) {
        text = await extractPdfText(file);
      } else if (name.endsWith(".docx")) {
        text = await extractDocxText(file);
      } else {
        text = await extractPlainText(file);
      }
      if (!text || text.trim().length < 20) {
        setError("Could not extract enough text. Try a different format or paste directly.");
        setParsing(false);
        return;
      }
      setResumeText(text.trim());
    } catch (err) {
      console.error(err);
      setError("Failed to parse file: " + (err.message || "Unknown error"));
    } finally {
      setParsing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const tailorResume = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `Here is my current resume:\n\n---\n${resumeText}\n---\n\nHere is the job description I'm applying for:\n\n---\n${jobDescription}\n---\n\nPlease tailor my resume to this job description. Output the improved resume in clean markdown.`,
            },
          ],
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error: ${response.status}`);
      }
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("\n") || "No response received.";
      setResult(text);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return resumeText.length > 20;
    if (step === 1) return jobDescription.length > 20;
    if (step === 2) return apiKey.startsWith("sk-");
    return false;
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStep(0);
    setResumeText("");
    setResumeFileName("");
    setJobDescription("");
    setResult("");
    setError("");
    setCopied(false);
    setShowPreview(false);
  };

  return (
    <div className="rt-page">
      <div className="rt-container">
        {/* Header */}
        <div className="rt-header">
          <span className="rt-badge">Resume Tailor</span>
          <span className="rt-badge-sep">—</span>
          <span className="rt-badge-sub">Powered by Claude</span>
        </div>
        <h1 className="rt-title">
          Match your resume<br />to the opportunity.
        </h1>
        <p className="rt-subtitle">AI-powered resume optimization in three steps.</p>

        {/* Progress */}
        <div className="rt-progress">
          {STEPS.map((s) => (
            <div key={s.id} className={`rt-progress-bar ${s.id < step ? "done" : ""} ${s.id === step ? "active" : ""}`} />
          ))}
        </div>
        <div className="rt-step-labels">
          {STEPS.map((s) => (
            <div key={s.id} className={`rt-step-label ${s.id <= step ? "on" : ""}`}>
              {s.icon} {s.label}
            </div>
          ))}
        </div>

        {/* Step 0 */}
        {step === 0 && (
          <div className="rt-card rt-fade-in">
            <div className="rt-label">Step 1 of 3</div>
            <div className="rt-step-title">Upload your resume</div>
            <p className="rt-step-desc">
              Drop a file or paste your resume text directly.
              <span className="rt-pills">
                <span className="rt-pill rt-pill-rec">.pdf</span>
                <span className="rt-pill rt-pill-rec">.docx</span>
                <span className="rt-pill">.txt</span>
                <span className="rt-pill">.md</span>
              </span>
            </p>
            <div
              className={`rt-drop ${dragOver ? "active" : ""} ${parsing ? "parsing" : ""} ${resumeText && !parsing ? "has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !parsing && fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.docx" style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
              {parsing ? (
                <>
                  <div className="rt-spinner-amber" />
                  <div className="rt-drop-status parsing">Parsing document...</div>
                  <div className="rt-drop-detail">Extracting text from {resumeFileName}</div>
                </>
              ) : resumeText ? (
                <>
                  <div className="rt-drop-icon">✓</div>
                  <div className="rt-drop-status success">Resume loaded</div>
                  {resumeFileName && <div className="rt-file-badge">📎 {resumeFileName}</div>}
                  <div className="rt-drop-detail">{resumeText.length.toLocaleString()} characters extracted</div>
                </>
              ) : (
                <>
                  <div className="rt-drop-icon">↑</div>
                  <div className="rt-drop-status">Drop file here or click to browse</div>
                  <div className="rt-drop-detail">PDF, DOCX, TXT, or Markdown</div>
                </>
              )}
            </div>
            {resumeText && !parsing && (
              <>
                <button className="rt-preview-toggle" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? "Hide" : "Preview"} extracted text
                </button>
                {showPreview && (
                  <div className="rt-preview">
                    {resumeText.substring(0, 2000)}
                    {resumeText.length > 2000 ? "\n\n... (truncated)" : ""}
                  </div>
                )}
              </>
            )}
            <div className="rt-divider">— OR PASTE BELOW —</div>
            <textarea className="rt-textarea" value={resumeText} onChange={(e) => { setResumeText(e.target.value); setResumeFileName(""); }} placeholder="Paste your resume content here..." />
            <div className="rt-char-count">{resumeText.length.toLocaleString()} chars</div>
            {error && <div className="rt-error">{error}</div>}
            <div className="rt-nav">
              <div />
              <button className="rt-btn-primary" disabled={!canProceed() || parsing} onClick={() => { setShowPreview(false); setStep(1); }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="rt-card rt-fade-in">
            <div className="rt-label">Step 2 of 3</div>
            <div className="rt-step-title">Paste the job description</div>
            <p className="rt-step-desc">Include the full posting — title, responsibilities, requirements, and qualifications.</p>
            <textarea className="rt-textarea rt-textarea-tall" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." autoFocus />
            <div className="rt-char-count">{jobDescription.length.toLocaleString()} chars</div>
            <div className="rt-nav">
              <button className="rt-btn-secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="rt-btn-primary" disabled={!canProceed()} onClick={() => setStep(2)}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="rt-card rt-fade-in">
            <div className="rt-label">Step 3 of 3</div>
            <div className="rt-step-title">Enter your Claude API key</div>
            <p className="rt-step-desc">Your key is sent directly to Anthropic's API and is never stored. Get one at <strong>console.anthropic.com</strong>.</p>
            <input className="rt-input" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-..." autoFocus />
            <div className="rt-privacy">
              <strong>🔒 Privacy note:</strong> Your API key and resume data are sent directly from your browser to Anthropic. Nothing is stored or logged by this tool. Model: <code>claude-sonnet-4</code>
            </div>
            {error && <div className="rt-error">{error}</div>}
            <div className="rt-nav">
              <button className="rt-btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="rt-btn-primary" disabled={!canProceed() || loading} onClick={tailorResume}>
                {loading ? (<><span className="rt-spinner" /> Tailoring...</>) : "Tailor my resume ✨"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="rt-card rt-fade-in">
            <div className="rt-label">Done</div>
            <div className="rt-step-title">Your tailored resume</div>
            <p className="rt-step-desc">Review the optimized version below. Copy it or start over with a different job.</p>
            <div className="rt-result">{result}</div>
            <div className="rt-nav">
              <button className="rt-btn-secondary" onClick={reset}>↺ Start over</button>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="rt-btn-secondary" onClick={() => { setStep(1); setJobDescription(""); setResult(""); }}>Try another job</button>
                <button className="rt-btn-primary" onClick={copyResult}>{copied ? "Copied ✓" : "Copy to clipboard"}</button>
              </div>
            </div>
          </div>
        )}

        <div className="rt-footer-note">Built with Claude API · Your data stays in your browser</div>
      </div>
    </div>
  );
}

export default ResumeTailor;
