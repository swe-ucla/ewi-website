import React, { useState } from "react";
import "./StudentRegistration.css";
import companiesData from "../../data/companies.json";

const COMPANIES = companiesData.companies;

const FUNCTIONS_URL = process.env.REACT_APP_FIREBASE_FUNCTIONS_URL || process.env.REACT_APP_API_BASE_URL;

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result.split(",")[1];
            resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const StudentRegistration = () => {
    const [form, setForm] = useState({ fullName: "", email: "", major: "", year: "", role: "", isInternational: "" });
    const [preferences, setPreferences] = useState(Array(10).fill(""));
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
    const [duplicateData, setDuplicateData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handlePreferenceChange = (index, value) => {
        const updated = [...preferences];
        updated[index] = value;
        setPreferences(updated);
    };

    const submit = async (overwrite = false) => {
        setLoading(true);
        setStatus(null);
        try {
            let fileBase64 = null;
            let fileName = null;
            if (file) {
                fileBase64 = await fileToBase64(file);
                fileName = file.name;
            }

            const res = await fetch(`${FUNCTIONS_URL}/registerStudent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, preferences: preferences.filter(p => p !== ""), overwrite, fileBase64, fileName }),
            });

            const data = await res.json();
            if (res.status === 409 && data.error === "duplicate") {
                setDuplicateData(data);
                setStatus("duplicate");
            } else if (!res.ok) {
                setStatus("error");
                console.error(data);
            } else {
                setStatus("success");
                setDuplicateData(null);
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submit(false);
    };

    return (
        <div className="student-registration">
            <form onSubmit={handleSubmit} className="student-registration-form">
                <div className="form-row">
                    <label>Full name</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <label>Major</label>
                    <input name="major" value={form.major} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Year</label>
                    <select name="year" value={form.year} onChange={handleChange} required>
                        <option value="">Select year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Grad Student - Master's">Grad Student - Master's</option>
                        <option value="Grad Student - PhD">Grad Student - PhD</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>Position seeking</label>
                    <select name="role" value={form.role} onChange={handleChange} required>
                        <option value="">Select position</option>
                        <option value="internship">Internship</option>
                        <option value="full-time">Full-time</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>Are you an international student?</label>
                    <select name="isInternational" value={form.isInternational} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>Company Preferences (rank up to 10)</label>
                    {preferences.map((pref, i) => (
                        <div key={i} className="preference-row">
                            <span className="preference-rank">{i + 1}.</span>
                            <select value={pref} onChange={(e) => handlePreferenceChange(i, e.target.value)}>
                                <option value="">No preference</option>
                                {COMPANIES.filter(c => !preferences.includes(c) || c === pref).map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="form-row">
                    <label>Upload PDF (optional)</label>
                    <input type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
                </div>
                <div className="form-row">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Submitting..." : "Register"}
                    </button>
                </div>
            </form>

            {status === "duplicate" && duplicateData && (
                <div className="duplicate-warning">
                    <p>A registration with this email already exists.</p>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(duplicateData.data, null, 2)}</pre>
                    <button onClick={() => submit(true)} className="btn">Overwrite</button>
                    <button onClick={() => setStatus(null)} className="btn">Cancel</button>
                </div>
            )}

            {status === "success" && <div className="success">Registration saved.</div>}
            {status === "error" && <div className="error">An error occurred. Check console.</div>}
        </div>
    );
};

export default StudentRegistration;
