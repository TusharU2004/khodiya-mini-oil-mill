"use client";

import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    subject: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!form.name || !form.email || !form.contact || !form.subject) {
      setErrorMsg("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // ✅ check the same response structure as your other APIs
      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Failed to send message.");
      }

      // ✅ success case
      setSuccessVisible(true);
      setForm({
        name: "",
        email: "",
        contact: "",
        subject: "",
        reason: "",
      });

      // hide success message after 3 seconds
      setTimeout(() => setSuccessVisible(false), 3000);
    } catch (err) {
      console.error("Contact form error:", err);
      setErrorMsg(err.message || "Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="contact-section">
        <div className="container">
          <h2>📍 Get in Touch With Us</h2>
          <p>
            We’d love to hear from you! Whether you have a question about our
            products, services, or anything else, our team is ready to answer
            all your questions.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  value={form.name}
                  onChange={onChange}
                  type="text"
                  id="name"
                  name="name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  value={form.email}
                  onChange={onChange}
                  type="email"
                  id="email"
                  name="email"
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contact">Contact Number</label>
                <input
                  value={form.contact}
                  onChange={onChange}
                  type="tel"
                  id="contact"
                  name="contact"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  value={form.subject}
                  onChange={onChange}
                  type="text"
                  id="subject"
                  name="subject"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="reason">Reason (Optional)</label>
              <textarea
                value={form.reason}
                onChange={onChange}
                id="reason"
                name="reason"
                rows="5"
              ></textarea>
            </div>

            <div className="form-group">
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>

            {errorMsg && (
              <p className="text-red-600 mt-2 text-sm">{errorMsg}</p>
            )}

            {successVisible && (
              <div
                className="contact-success"
                role="status"
                aria-live="polite"
                style={{ marginTop: 12 }}
              >
                <div className="success-box">
                  <strong>Thank you!</strong> Your message has been sent. We
                  will contact you soon.
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
