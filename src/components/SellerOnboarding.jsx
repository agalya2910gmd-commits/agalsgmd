// components/SellerOnboarding.jsx
import React, { useState, useRef, useEffect } from "react";

const onboardingCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes stepSlideIn {
    from { opacity:0; transform:translateX(30px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes stepSlideOut {
    from { opacity:1; transform:translateX(0); }
    to   { opacity:0; transform:translateX(-30px); }
  }

  .ob-wrap * { box-sizing:border-box; }
  .ob-wrap {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    min-height: 100vh;
    background: #f4f6f9;
    display: flex;
    flex-direction: column;
  }

  /* TOP NAV */
  .ob-topnav {
    background: #fff;
    border-bottom: 1px solid #e9ecef;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 0 #e9ecef;
  }
  .ob-logo {
    font-size: 24px;
    font-weight: 800;
    color: #b3934e;
    letter-spacing: -0.5px;
  }
  .ob-nav-sub {
    margin-left: 16px;
    font-size: 13px;
    color: #94a3b8;
    font-weight: 500;
  }
  .ob-nav-right {
    margin-left: auto;
    font-size: 13px;
    color: #64748b;
  }

  /* PROGRESS STEPPER */
  .ob-stepper {
    background: #fff;
    border-bottom: 1px solid #e9ecef;
    padding: 0 32px;
    display: flex;
    align-items: center;
    gap: 0;
    overflow-x: auto;
  }
  .ob-step {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px 16px 0;
    cursor: default;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ob-step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    border: 2px solid #e2e8f0;
    background: #fff;
    color: #94a3b8;
    transition: all 0.25s ease;
    flex-shrink: 0;
  }
  .ob-step-num.done   { background: #b3934e; border-color: #b3934e; color: #fff; }
  .ob-step-num.active { background: #fff; border-color: #b3934e; color: #b3934e; }
  .ob-step-label {
    font-size: 12.5px;
    font-weight: 600;
    color: #94a3b8;
    transition: color 0.25s;
  }
  .ob-step-label.active { color: #b3934e; }
  .ob-step-label.done  { color: #1e293b; }
  .ob-step-arrow {
    margin-right: 20px;
    color: #e2e8f0;
    font-size: 14px;
    font-weight: 500;
  }

  /* CONTENT AREA */
  .ob-content {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 36px 20px 60px;
  }
  .ob-card {
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 18px;
    width: 100%;
    max-width: 680px;
    box-shadow: 0 2px 14px rgba(0,0,0,0.05);
    animation: fadeInUp 0.35s ease-out;
    overflow: hidden;
  }
  .ob-card-header {
    padding: 24px 32px 20px;
    border-bottom: 1px solid #f1f5f9;
    background: linear-gradient(135deg, #fffbf5, #fff7ed);
  }
  .ob-card-step-tag {
    font-size: 11px;
    font-weight: 700;
    color: #b3934e;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }
  .ob-card-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px;
    letter-spacing: -0.3px;
  }
  .ob-card-subtitle {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }
  .ob-card-body {
    padding: 28px 32px;
    animation: stepSlideIn 0.3s ease-out;
  }

  /* FORM ELEMENTS */
  .ob-section-title {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }
  .ob-grid { display: grid; gap: 18px; }
  .ob-grid-2 { grid-template-columns: 1fr 1fr; }
  .ob-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
  .ob-field { display: flex; flex-direction: column; gap: 6px; }
  .ob-field.full { grid-column: 1 / -1; }
  .ob-label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .ob-label span { color: #ef4444; margin-left: 2px; }
  .ob-inp {
    padding: 10px 13px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13.5px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .ob-inp:focus {
    border-color: #b3934e;
    box-shadow: 0 0 0 3px rgba(179,147,78,0.1);
  }
  .ob-inp::placeholder { color: #c0ccda; }
  .ob-inp.error { border-color: #ef4444; }
  .ob-sel {
    padding: 10px 13px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13.5px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    background: #fff;
    outline: none;
    cursor: pointer;
    width: 100%;
    transition: border-color 0.2s;
  }
  .ob-sel:focus { border-color: #b3934e; box-shadow: 0 0 0 3px rgba(179,147,78,0.1); }
  .ob-textarea {
    padding: 10px 13px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13.5px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    background: #fff;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
    resize: vertical;
    min-height: 80px;
  }
  .ob-textarea:focus { border-color: #b3934e; box-shadow: 0 0 0 3px rgba(179,147,78,0.1); }
  .ob-err-msg { font-size: 11px; color: #ef4444; margin-top: 3px; font-weight: 600; }

  /* RADIO / CHECKBOX GROUP */
  .ob-radio-group { display: flex; flex-wrap: wrap; gap: 10px; }
  .ob-radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    transition: all 0.18s;
    background: #fff;
    user-select: none;
  }
  .ob-radio-option:hover { border-color: #b3934e; background: #fffbf5; }
  .ob-radio-option.selected { border-color: #b3934e; background: #fff7ed; color: #b3934e; }
  .ob-radio-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.18s;
  }
  .ob-radio-option.selected .ob-radio-dot {
    border-color: #b3934e;
    background: #b3934e;
  }
  .ob-radio-dot-inner {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }

  /* KYC DOC UPLOAD */
  .ob-upload-box {
    border: 2px dashed #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafbfc;
  }
  .ob-upload-box:hover { border-color: #b3934e; background: #fffbf5; }
  .ob-upload-box.uploaded { border-color: #10b981; background: #f0fdf4; }
  .ob-upload-icon { font-size: 28px; margin-bottom: 8px; }
  .ob-upload-text { font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 4px; }
  .ob-upload-sub  { font-size: 11px; color: #94a3b8; }
  .ob-upload-input { display: none; }

  /* CHECKBOX */
  .ob-checkbox-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.18s;
    background: #fff;
  }
  .ob-checkbox-row:hover { border-color: #b3934e; background: #fffbf5; }
  .ob-checkbox-row.checked { border-color: #b3934e; background: #fff7ed; }
  .ob-checkbox-box {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 2px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    transition: all 0.18s;
    font-size: 11px;
    color: transparent;
    background: #fff;
  }
  .ob-checkbox-row.checked .ob-checkbox-box {
    border-color: #b3934e;
    background: #b3934e;
    color: #fff;
  }
  .ob-checkbox-label {
    font-size: 13px;
    color: #1e293b;
    font-weight: 500;
    line-height: 1.5;
  }
  .ob-checkbox-sub { font-size: 12px; color: #64748b; margin-top: 2px; }

  /* FOOTER NAV */
  .ob-footer {
    padding: 20px 32px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fafbfc;
  }
  .ob-footer-left { font-size: 12px; color: #94a3b8; font-weight: 500; }

  /* BUTTONS */
  .btn-ob-gold {
    background: linear-gradient(135deg, #b3934e, #d4af6a);
    border: none;
    color: #fff;
    font-weight: 700;
    padding: 11px 26px;
    border-radius: 11px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(179,147,78,0.3);
    transition: all 0.22s ease;
  }
  .btn-ob-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(179,147,78,0.38); }
  .btn-ob-gold:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .btn-ob-back {
    background: transparent;
    border: 1.5px solid #e2e8f0;
    color: #64748b;
    font-weight: 600;
    padding: 11px 22px;
    border-radius: 11px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.18s;
  }
  .btn-ob-back:hover { background: #f8f9fa; border-color: #b3934e; color: #b3934e; }

  /* INFO BOX */
  .ob-info-box {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-left: 4px solid #3b82f6;
    border-radius: 0 10px 10px 0;
    padding: 13px 16px;
    font-size: 13px;
    color: #1e40af;
    font-weight: 500;
    margin-bottom: 20px;
    line-height: 1.5;
  }
  .ob-warn-box {
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-left: 4px solid #f59e0b;
    border-radius: 0 10px 10px 0;
    padding: 13px 16px;
    font-size: 13px;
    color: #92400e;
    font-weight: 500;
    margin-bottom: 20px;
  }

  /* SUCCESS */
  .ob-success {
    text-align: center;
    padding: 60px 40px;
    animation: fadeInUp 0.4s ease-out;
  }
  .ob-success-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin: 0 auto 20px;
    border: 2px solid #6ee7b7;
  }
  .ob-success-title { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 10px; }
  .ob-success-sub   { font-size: 14px; color: #64748b; margin-bottom: 28px; line-height: 1.6; }

  /* DIVIDER */
  .ob-divider { margin: 24px 0; border: none; border-top: 1px solid #f1f5f9; }

  /* TAG */
  .ob-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
  }
  .ob-tag-opt { background: #f1f5f9; color: #64748b; margin-left: 6px; }

  /* OTP specific styles */
  .ob-otp-row {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .ob-otp-row .ob-field {
    flex: 1;
  }
  .btn-ob-otp {
    background: linear-gradient(135deg, #b3934e, #d4af6a);
    border: none;
    color: #fff;
    font-weight: 700;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.22s ease;
    white-space: nowrap;
    height: 42px;
    margin-top: 22px;
  }
  .btn-ob-otp:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .btn-ob-otp:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(179,147,78,0.3);
  }
  .btn-ob-verify {
    background: #10b981;
    border: none;
    color: #fff;
    font-weight: 700;
    padding: 10px 18px;
    border-radius: 10px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.22s ease;
    white-space: nowrap;
    height: 42px;
    margin-top: 22px;
  }
  .btn-ob-verify:hover {
    background: #059669;
  }
  .ob-otp-timer {
    font-size: 12px;
    color: #64748b;
    margin-top: 5px;
    font-weight: 600;
  }
  .ob-otp-success {
    color: #10b981;
    font-size: 12px;
    font-weight: 600;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .ob-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeInUp 0.2s ease;
  }
  .ob-modal {
    background: white;
    border-radius: 20px;
    width: 90%;
    max-width: 420px;
    overflow: hidden;
    animation: fadeInUp 0.3s ease;
  }
  .ob-modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ob-modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }
  .ob-modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #94a3b8;
  }
  .ob-modal-body {
    padding: 24px;
  }
  .ob-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  .ob-otp-input-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin: 20px 0;
  }
  .ob-otp-digit {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }
  .ob-otp-digit:focus {
    border-color: #b3934e;
    outline: none;
    box-shadow: 0 0 0 3px rgba(179,147,78,0.1);
  }
  .ob-otp-digit.error {
    border-color: #ef4444;
  }

  @media (max-width: 600px) {
    .ob-card-body { padding: 20px 18px; }
    .ob-card-header { padding: 18px 18px 16px; }
    .ob-footer { padding: 16px 18px; }
    .ob-grid-2, .ob-grid-3 { grid-template-columns: 1fr; }
    .ob-stepper { padding: 0 16px; }
    .ob-step-label { display: none; }
  }
`;

if (!document.getElementById("ob-css-v1")) {
  const s = document.createElement("style");
  s.id = "ob-css-v1";
  s.textContent = onboardingCSS;
  document.head.appendChild(s);
}

// ─── STEPS CONFIG ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Business Info" },
  { id: 3, label: "KYC" },
  { id: 4, label: "Bank Details" },
  { id: 5, label: "Store Setup" },
  { id: 6, label: "Compliance" },
];

// ─── FIELD COMPONENT ──────────────────────────────────────────────────────────
const Field = ({ label, required, children, error }) => (
  <div className="ob-field">
    <label className="ob-label">
      {label}
      {required && <span>*</span>}
    </label>
    {children}
    {error && <div className="ob-err-msg">{error}</div>}
  </div>
);

const RadioGroup = ({ options, value, onChange }) => (
  <div className="ob-radio-group">
    {options.map((opt) => (
      <div
        key={opt}
        className={`ob-radio-option ${value === opt ? "selected" : ""}`}
        onClick={() => onChange(opt)}
      >
        <div className="ob-radio-dot">
          {value === opt && <div className="ob-radio-dot-inner" />}
        </div>
        {opt}
      </div>
    ))}
  </div>
);

const UploadBox = ({ label, value, onChange }) => {
  const ref = React.useRef();
  return (
    <div>
      <div
        className={`ob-upload-box ${value ? "uploaded" : ""}`}
        onClick={() => ref.current.click()}
      >
        <div className="ob-upload-icon">{value ? "✅" : "📄"}</div>
        <div className="ob-upload-text">
          {value ? value : `Upload ${label}`}
        </div>
        <div className="ob-upload-sub">
          {value ? "Click to replace" : "JPG, PNG or PDF — max 5MB"}
        </div>
        <input
          ref={ref}
          type="file"
          className="ob-upload-input"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) =>
            e.target.files[0] && onChange(e.target.files[0].name)
          }
        />
      </div>
    </div>
  );
};

// ─── OTP MODAL COMPONENT ──────────────────────────────────────────────────────
const OTPModal = ({ mobile, onVerify, onClose, isOpen }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_or_email: mobile, otp_code: otpCode }),
      });
      const data = await response.json();

      if (response.ok && data.verified) {
        onVerify(true);
        onClose();
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:5000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_or_email: mobile }),
      });
      setTimer(60);
      setCanResend(false);
      setError("");
      alert(`OTP resent to ${mobile}`);
    } catch (err) {
      alert("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ob-modal-overlay" onClick={onClose}>
      <div className="ob-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ob-modal-header">
          <h3>Verify Mobile Number</h3>
          <button className="ob-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="ob-modal-body">
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
            We've sent a 6-digit verification code to <strong>{mobile}</strong>
          </p>
          <div className="ob-otp-input-group">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength="1"
                className={`ob-otp-digit ${error ? "error" : ""}`}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                autoFocus={idx === 0}
              />
            ))}
          </div>
          {error && (
            <div className="ob-err-msg" style={{ textAlign: "center" }}>
              {error}
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            {canResend ? (
              <button
                className="btn-ob-back"
                onClick={handleResend}
                disabled={loading}
                style={{ fontSize: 12 }}
              >
                Resend OTP
              </button>
            ) : (
              <div className="ob-otp-timer">Resend code in {timer} seconds</div>
            )}
          </div>
        </div>
        <div className="ob-modal-footer">
          <button className="btn-ob-back" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-ob-gold"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── STEP 1: BASIC SELLER INFO (WITH OTP) ─────────────────────────────────────
const Step1 = ({
  data,
  setData,
  errors,
  onSendOtp,
  otpVerified,
  isOtpSent,
}) => (
  <div>
    <div className="ob-info-box">
      Fill in your personal details. An OTP will be sent to verify your mobile
      number.
    </div>
    <div className="ob-grid ob-grid-2">
      <Field label="Full Name" required error={errors.fullName}>
        <input
          className={`ob-inp ${errors.fullName ? "error" : ""}`}
          placeholder="e.g. Rahul Sharma"
          value={data.fullName}
          onChange={(e) => setData({ ...data, fullName: e.target.value })}
        />
      </Field>
      <Field label="Email Address" required error={errors.email}>
        <input
          type="email"
          className={`ob-inp ${errors.email ? "error" : ""}`}
          placeholder="seller@example.com"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </Field>
      <div className="ob-otp-row">
        <Field label="Mobile Number" required error={errors.mobile}>
          <input
            className={`ob-inp ${errors.mobile ? "error" : ""}`}
            placeholder="+91 98765 43210"
            value={data.mobile}
            onChange={(e) =>
              setData({ ...data, mobile: e.target.value, otpVerified: false })
            }
            disabled={otpVerified}
          />
        </Field>
        {!otpVerified ? (
          <button
            className="btn-ob-otp"
            onClick={() => onSendOtp(data.mobile)}
            disabled={!data.mobile || data.mobile.length < 10}
          >
            Send OTP
          </button>
        ) : (
          <button className="btn-ob-verify" disabled style={{ opacity: 0.7 }}>
            ✓ Verified
          </button>
        )}
      </div>
      {isOtpSent && !otpVerified && (
        <div
          className="ob-otp-timer"
          style={{ marginTop: -10, marginBottom: 10 }}
        >
          OTP sent! Please check your phone.
        </div>
      )}
      {otpVerified && (
        <div className="ob-otp-success">
          ✓ Mobile number verified successfully!
        </div>
      )}
      <Field label="Password" required error={errors.password}>
        <input
          type="password"
          className={`ob-inp ${errors.password ? "error" : ""}`}
          placeholder="Min. 8 characters"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </Field>
    </div>
  </div>
);

// ─── STEP 2: BUSINESS INFORMATION ────────────────────────────────────────────
const Step2 = ({ data, setData, errors }) => (
  <div>
    <div className="ob-section-title">Business Type</div>
    <div style={{ marginBottom: 24 }}>
      <Field label="Select Business Type" required error={errors.businessType}>
        <RadioGroup
          options={[
            "Individual",
            "Sole Proprietor",
            "Partnership",
            "Pvt Ltd / LLP",
          ]}
          value={data.businessType}
          onChange={(v) => setData({ ...data, businessType: v })}
        />
      </Field>
    </div>
    <div className="ob-section-title">Business Details</div>
    <div className="ob-grid ob-grid-2">
      <Field label="Business Name" required error={errors.businessName}>
        <input
          className={`ob-inp ${errors.businessName ? "error" : ""}`}
          placeholder="Your business name"
          value={data.businessName}
          onChange={(e) => setData({ ...data, businessName: e.target.value })}
        />
      </Field>
      <Field label="Business Address" required error={errors.businessAddress}>
        <input
          className={`ob-inp ${errors.businessAddress ? "error" : ""}`}
          placeholder="Street address"
          value={data.businessAddress}
          onChange={(e) =>
            setData({ ...data, businessAddress: e.target.value })
          }
        />
      </Field>
      <Field label="City" required error={errors.city}>
        <input
          className={`ob-inp ${errors.city ? "error" : ""}`}
          placeholder="Mumbai"
          value={data.city}
          onChange={(e) => setData({ ...data, city: e.target.value })}
        />
      </Field>
      <Field label="State" required error={errors.state}>
        <select
          className="ob-sel"
          value={data.state}
          onChange={(e) => setData({ ...data, state: e.target.value })}
        >
          <option value="">Select State</option>
          {[
            "Andhra Pradesh",
            "Assam",
            "Bihar",
            "Delhi",
            "Goa",
            "Gujarat",
            "Haryana",
            "Himachal Pradesh",
            "Jharkhand",
            "Karnataka",
            "Kerala",
            "Madhya Pradesh",
            "Maharashtra",
            "Odisha",
            "Punjab",
            "Rajasthan",
            "Tamil Nadu",
            "Telangana",
            "Uttar Pradesh",
            "Uttarakhand",
            "West Bengal",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="Pincode" required error={errors.pincode}>
        <input
          className={`ob-inp ${errors.pincode ? "error" : ""}`}
          placeholder="400001"
          maxLength={6}
          value={data.pincode}
          onChange={(e) => setData({ ...data, pincode: e.target.value })}
        />
      </Field>
      <Field label="Country" required>
        <select
          className="ob-sel"
          value={data.country}
          onChange={(e) => setData({ ...data, country: e.target.value })}
        >
          <option>India</option>
          <option>USA</option>
          <option>UK</option>
          <option>UAE</option>
        </select>
      </Field>
    </div>
  </div>
);

// ─── STEP 3: KYC VERIFICATION ────────────────────────────────────────────────
const Step3 = ({ data, setData, errors }) => {
  const isIndividual = data.kycType === "Individual";
  return (
    <div>
      <div className="ob-warn-box">
        All documents are encrypted and stored securely. Required for seller
        verification as per govt. regulations.
      </div>
      <div style={{ marginBottom: 22 }}>
        <Field label="KYC Type" required>
          <RadioGroup
            options={["Individual", "Business"]}
            value={data.kycType}
            onChange={(v) => setData({ ...data, kycType: v })}
          />
        </Field>
      </div>
      {isIndividual ? (
        <div>
          <div className="ob-section-title">Individual KYC — India</div>
          <div className="ob-grid ob-grid-2" style={{ marginBottom: 18 }}>
            <Field label="PAN Card Number" required error={errors.panNumber}>
              <input
                className={`ob-inp ${errors.panNumber ? "error" : ""}`}
                placeholder="ABCDE1234F"
                maxLength={10}
                value={data.panNumber}
                onChange={(e) =>
                  setData({ ...data, panNumber: e.target.value.toUpperCase() })
                }
              />
            </Field>
            <Field label="Aadhaar Number" required error={errors.aadhaarNumber}>
              <input
                className={`ob-inp ${errors.aadhaarNumber ? "error" : ""}`}
                placeholder="1234 5678 9012"
                maxLength={14}
                value={data.aadhaarNumber}
                onChange={(e) =>
                  setData({ ...data, aadhaarNumber: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="ob-grid ob-grid-2">
            <div>
              <div className="ob-label" style={{ marginBottom: 8 }}>
                PAN Card — Upload{" "}
                <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>
              </div>
              <UploadBox
                label="PAN Card"
                value={data.panDoc}
                onChange={(v) => setData({ ...data, panDoc: v })}
              />
            </div>
            <div>
              <div className="ob-label" style={{ marginBottom: 8 }}>
                Aadhaar — Upload{" "}
                <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>
              </div>
              <UploadBox
                label="Aadhaar Card"
                value={data.aadhaarDoc}
                onChange={(v) => setData({ ...data, aadhaarDoc: v })}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="ob-section-title">Business KYC</div>
          <div className="ob-grid ob-grid-2" style={{ marginBottom: 18 }}>
            <Field
              label="Business PAN Number"
              required
              error={errors.businessPan}
            >
              <input
                className={`ob-inp ${errors.businessPan ? "error" : ""}`}
                placeholder="AAAPL1234C"
                maxLength={10}
                value={data.businessPan}
                onChange={(e) =>
                  setData({
                    ...data,
                    businessPan: e.target.value.toUpperCase(),
                  })
                }
              />
            </Field>
            <Field label="GSTIN Number" required error={errors.gstin}>
              <input
                className={`ob-inp ${errors.gstin ? "error" : ""}`}
                placeholder="22AAAPL1234C1Z5"
                maxLength={15}
                value={data.gstin}
                onChange={(e) =>
                  setData({ ...data, gstin: e.target.value.toUpperCase() })
                }
              />
            </Field>
          </div>
          <div className="ob-grid ob-grid-2">
            <div>
              <div className="ob-label" style={{ marginBottom: 8 }}>
                PAN Document{" "}
                <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>
              </div>
              <UploadBox
                label="Business PAN"
                value={data.businessPanDoc}
                onChange={(v) => setData({ ...data, businessPanDoc: v })}
              />
            </div>
            <div>
              <div className="ob-label" style={{ marginBottom: 8 }}>
                GSTIN Certificate{" "}
                <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>
              </div>
              <UploadBox
                label="GSTIN Certificate"
                value={data.gstinDoc}
                onChange={(v) => setData({ ...data, gstinDoc: v })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── STEP 4: BANK DETAILS ────────────────────────────────────────────────────
const Step4 = ({ data, setData, errors }) => (
  <div>
    <div className="ob-info-box">
      Your bank account must be in the same name as your business / KYC. Payouts
      are processed every 7 days.
    </div>
    <div className="ob-grid ob-grid-2">
      <Field label="Account Holder Name" required error={errors.accHolder}>
        <input
          className={`ob-inp ${errors.accHolder ? "error" : ""}`}
          placeholder="Full name as on bank account"
          value={data.accHolder}
          onChange={(e) => setData({ ...data, accHolder: e.target.value })}
        />
      </Field>
      <Field label="Bank Name" required error={errors.bankName}>
        <input
          className={`ob-inp ${errors.bankName ? "error" : ""}`}
          placeholder="e.g. HDFC Bank"
          value={data.bankName}
          onChange={(e) => setData({ ...data, bankName: e.target.value })}
        />
      </Field>
      <Field label="Account Number" required error={errors.accNumber}>
        <input
          className={`ob-inp ${errors.accNumber ? "error" : ""}`}
          placeholder="Enter account number"
          value={data.accNumber}
          onChange={(e) => setData({ ...data, accNumber: e.target.value })}
        />
      </Field>
      <Field
        label="Confirm Account Number"
        required
        error={errors.accNumberConfirm}
      >
        <input
          className={`ob-inp ${errors.accNumberConfirm ? "error" : ""}`}
          placeholder="Re-enter account number"
          value={data.accNumberConfirm}
          onChange={(e) =>
            setData({ ...data, accNumberConfirm: e.target.value })
          }
        />
      </Field>
      <Field label="IFSC Code" required error={errors.ifsc}>
        <input
          className={`ob-inp ${errors.ifsc ? "error" : ""}`}
          placeholder="e.g. HDFC0001234"
          maxLength={11}
          value={data.ifsc}
          onChange={(e) =>
            setData({ ...data, ifsc: e.target.value.toUpperCase() })
          }
        />
      </Field>
      <Field label="Account Type" required>
        <select
          className="ob-sel"
          value={data.accType}
          onChange={(e) => setData({ ...data, accType: e.target.value })}
        >
          <option>Savings</option>
          <option>Current</option>
        </select>
      </Field>
    </div>
  </div>
);

// ─── STEP 5: STORE SETUP ──────────────────────────────────────────────────────
const Step5 = ({ data, setData, errors }) => (
  <div>
    <div className="ob-section-title">Store Information</div>
    <div className="ob-grid" style={{ marginBottom: 24 }}>
      <Field label="Store Name" required error={errors.storeName}>
        <input
          className={`ob-inp ${errors.storeName ? "error" : ""}`}
          placeholder="Your store name (visible to customers)"
          value={data.storeName}
          onChange={(e) => setData({ ...data, storeName: e.target.value })}
        />
      </Field>
      <Field label="Store Description" required error={errors.storeDesc}>
        <textarea
          className="ob-textarea"
          placeholder="Describe what your store sells..."
          value={data.storeDesc}
          onChange={(e) => setData({ ...data, storeDesc: e.target.value })}
        />
      </Field>
    </div>
    <div className="ob-grid ob-grid-2" style={{ marginBottom: 24 }}>
      <Field label="Pickup Address" required error={errors.pickupAddress}>
        <input
          className={`ob-inp ${errors.pickupAddress ? "error" : ""}`}
          placeholder="Address for order pickup"
          value={data.pickupAddress}
          onChange={(e) => setData({ ...data, pickupAddress: e.target.value })}
        />
      </Field>
      <Field label="Return Address" required error={errors.returnAddress}>
        <input
          className={`ob-inp ${errors.returnAddress ? "error" : ""}`}
          placeholder="Address for returns"
          value={data.returnAddress}
          onChange={(e) => setData({ ...data, returnAddress: e.target.value })}
        />
      </Field>
    </div>
    <div className="ob-section-title">
      Optional — Branding
      <span className="ob-tag ob-tag-opt">Optional</span>
    </div>
    <div className="ob-grid ob-grid-2">
      <div>
        <div className="ob-label" style={{ marginBottom: 8 }}>
          Store Logo
        </div>
        <UploadBox
          label="Store Logo"
          value={data.storeLogo}
          onChange={(v) => setData({ ...data, storeLogo: v })}
        />
      </div>
      <div>
        <div className="ob-label" style={{ marginBottom: 8 }}>
          Branding Banner
        </div>
        <UploadBox
          label="Banner Image"
          value={data.bannerImage}
          onChange={(v) => setData({ ...data, bannerImage: v })}
        />
      </div>
      <Field label="Instagram / Social Link">
        <input
          className="ob-inp"
          placeholder="https://instagram.com/yourstore"
          value={data.socialLink}
          onChange={(e) => setData({ ...data, socialLink: e.target.value })}
        />
      </Field>
    </div>
  </div>
);

// ─── STEP 6: COMPLIANCE ───────────────────────────────────────────────────────
const Step6 = ({ data, setData, errors }) => {
  const toggle = (key) => setData({ ...data, [key]: !data[key] });
  return (
    <div>
      <div className="ob-warn-box">
        Please read and agree to all policies before proceeding. Your seller
        account will be activated after admin verification.
      </div>
      <div className="ob-grid" style={{ gap: 12 }}>
        {[
          {
            key: "agreeTerms",
            title: "Seller Terms & Conditions",
            sub: "I agree to NIVEST seller terms, commission structure, and marketplace policies.",
          },
          {
            key: "agreePrivacy",
            title: "Privacy Policy",
            sub: "I consent to NIVEST collecting and processing my business data.",
          },
          {
            key: "agreeReturn",
            title: "Return & Refund Policy",
            sub: "I agree to honour the platform's return and refund policies for customers.",
          },
          {
            key: "agreeShipping",
            title: "Shipping SLA",
            sub: "I will dispatch orders within the agreed shipping timeline (typically 2–3 days).",
          },
          {
            key: "agreeQuality",
            title: "Product Quality Standards",
            sub: "My products meet quality standards and are accurately described.",
          },
        ].map(({ key, title, sub }) => (
          <div
            key={key}
            className={`ob-checkbox-row ${data[key] ? "checked" : ""}`}
            onClick={() => toggle(key)}
          >
            <div className="ob-checkbox-box">{data[key] ? "✓" : ""}</div>
            <div>
              <div className="ob-checkbox-label">{title}</div>
              <div className="ob-checkbox-sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>
      {errors.compliance && (
        <div className="ob-err-msg" style={{ marginTop: 12 }}>
          {errors.compliance}
        </div>
      )}
    </div>
  );
};

// ─── MAIN ONBOARDING COMPONENT ────────────────────────────────────────────────
const SellerOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // ── Per-step state ──
  const [step1, setStep1] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    otpVerified: false,
  });
  const [step2, setStep2] = useState({
    businessType: "",
    businessName: "",
    businessAddress: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [step3, setStep3] = useState({
    kycType: "Individual",
    panNumber: "",
    aadhaarNumber: "",
    panDoc: "",
    aadhaarDoc: "",
    businessPan: "",
    gstin: "",
    businessPanDoc: "",
    gstinDoc: "",
  });
  const [step4, setStep4] = useState({
    accHolder: "",
    bankName: "",
    accNumber: "",
    accNumberConfirm: "",
    ifsc: "",
    accType: "Savings",
  });
  const [step5, setStep5] = useState({
    storeName: "",
    storeDesc: "",
    pickupAddress: "",
    returnAddress: "",
    storeLogo: "",
    bannerImage: "",
    socialLink: "",
  });
  const [step6, setStep6] = useState({
    agreeTerms: false,
    agreePrivacy: false,
    agreeReturn: false,
    agreeShipping: false,
    agreeQuality: false,
  });

  // ── Send OTP Handler ──
  const handleSendOtp = async (mobile) => {
    if (!mobile || mobile.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_or_email: mobile }),
      });
      
      if (response.ok) {
        setIsOtpSent(true);
        setShowOtpModal(true);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      alert("Server connection failed");
    }
  };

  // ── Verify OTP Handler ──
  const handleVerifyOtp = (verified) => {
    if (verified) {
      setStep1((prev) => ({ ...prev, otpVerified: true }));
      setIsOtpSent(false);
    }
  };

  // ── Validation ──
  const validate = () => {
    const errs = {};
    if (step === 1) {
      if (!step1.fullName.trim()) errs.fullName = "Full name is required";
      if (!step1.email.includes("@")) errs.email = "Enter a valid email";
      if (!step1.mobile || step1.mobile.length < 10)
        errs.mobile = "Enter a valid mobile number";
      // OTP verification is now optional
      // if (!step1.otpVerified)
      //   errs.mobile = "Please verify your mobile number with OTP";
      if (step1.password.length < 8)
        errs.password = "Password must be 8+ characters";
    }
    if (step === 2) {
      if (!step2.businessType) errs.businessType = "Select a business type";
      if (!step2.businessName.trim())
        errs.businessName = "Business name required";
      if (!step2.businessAddress.trim())
        errs.businessAddress = "Address required";
      if (!step2.city.trim()) errs.city = "City required";
      if (!step2.state) errs.state = "State required";
      if (!step2.pincode || step2.pincode.length !== 6)
        errs.pincode = "Enter valid 6-digit pincode";
    }
    if (step === 3) {
      if (step3.kycType === "Individual") {
        if (!step3.panNumber || step3.panNumber.length !== 10)
          errs.panNumber = "Enter valid PAN (10 chars)";
        if (
          !step3.aadhaarNumber ||
          step3.aadhaarNumber.replace(/\s/g, "").length !== 12
        )
          errs.aadhaarNumber = "Enter valid 12-digit Aadhaar";
      } else {
        if (!step3.businessPan || step3.businessPan.length !== 10)
          errs.businessPan = "Enter valid PAN (10 chars)";
        if (!step3.gstin || step3.gstin.length !== 15)
          errs.gstin = "Enter valid 15-char GSTIN";
      }
    }
    if (step === 4) {
      if (!step4.accHolder.trim())
        errs.accHolder = "Account holder name required";
      if (!step4.bankName.trim()) errs.bankName = "Bank name required";
      if (!step4.accNumber) errs.accNumber = "Account number required";
      if (step4.accNumber !== step4.accNumberConfirm)
        errs.accNumberConfirm = "Account numbers don't match";
      if (!step4.ifsc || step4.ifsc.length !== 11)
        errs.ifsc = "Enter valid 11-char IFSC code";
    }
    if (step === 5) {
      if (!step5.storeName.trim()) errs.storeName = "Store name required";
      if (!step5.storeDesc.trim())
        errs.storeDesc = "Store description required";
      if (!step5.pickupAddress.trim())
        errs.pickupAddress = "Pickup address required";
      if (!step5.returnAddress.trim())
        errs.returnAddress = "Return address required";
    }
    if (step === 6) {
      const all =
        step6.agreeTerms &&
        step6.agreePrivacy &&
        step6.agreeReturn &&
        step6.agreeShipping &&
        step6.agreeQuality;
      if (!all) errs.compliance = "Please agree to all policies to continue";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < 6) {
      setErrors({});
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCompleted(true);
      setTimeout(() => {
        if (onComplete)
          onComplete({ step1, step2, step3, step4, step5, step6 });
      }, 1800);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepInfo = [
    {
      title: "Basic Seller Info",
      sub: "Personal contact details and account credentials",
    },
    {
      title: "Business Information",
      sub: "Your business type, name, and registered address",
    },
    { title: "KYC Verification", sub: "Identity documents required by law" },
    { title: "Bank Details", sub: "Bank account for payment settlements" },
    {
      title: "Store / Profile Setup",
      sub: "How customers will see your store",
    },
    {
      title: "Compliance & Agreements",
      sub: "Review and agree to platform policies",
    },
  ];

  if (completed) {
    return (
      <div className="ob-wrap">
        <div className="ob-topnav">
          <div className="ob-logo">NIVEST</div>
          <span className="ob-nav-sub">Seller Onboarding</span>
        </div>
        <div className="ob-content">
          <div className="ob-card">
            <div className="ob-success">
              <div className="ob-success-icon">✓</div>
              <div className="ob-success-title">Application Submitted!</div>
              <div className="ob-success-sub">
                Your seller account is under review. Our team will verify your
                documents within 24–48 hours. You'll receive an email at{" "}
                <strong>{step1.email}</strong> once approved.
              </div>
              <button
                className="btn-ob-gold"
                onClick={() => {
                  if (onComplete)
                    onComplete({ step1, step2, step3, step4, step5, step6 });
                }}
                style={{ margin: "0 auto" }}
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ob-wrap">
      <OTPModal
        mobile={step1.mobile}
        onVerify={handleVerifyOtp}
        onClose={() => {
          setShowOtpModal(false);
          setIsOtpSent(false);
        }}
        isOpen={showOtpModal}
      />

      {/* TOP NAV */}
      <div className="ob-topnav">
        <div className="ob-logo">NIVEST</div>
        <span className="ob-nav-sub">Seller Onboarding</span>
        <div className="ob-nav-right">
          Step {step} of {STEPS.length}
        </div>
      </div>

      {/* STEPPER */}
      <div className="ob-stepper">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="ob-step">
              <div
                className={`ob-step-num ${step > s.id ? "done" : step === s.id ? "active" : ""}`}
              >
                {step > s.id ? "✓" : s.id}
              </div>
              <div
                className={`ob-step-label ${step > s.id ? "done" : step === s.id ? "active" : ""}`}
              >
                {s.label}
              </div>
            </div>
            {i < STEPS.length - 1 && <div className="ob-step-arrow">›</div>}
          </React.Fragment>
        ))}
      </div>

      {/* CONTENT */}
      <div className="ob-content">
        <div className="ob-card">
          <div className="ob-card-header">
            <div className="ob-card-step-tag">
              Step {step} of {STEPS.length}
            </div>
            <div className="ob-card-title">{stepInfo[step - 1].title}</div>
            <div className="ob-card-subtitle">{stepInfo[step - 1].sub}</div>
          </div>
          <div className="ob-card-body">
            {step === 1 && (
              <Step1
                data={step1}
                setData={setStep1}
                errors={errors}
                onSendOtp={handleSendOtp}
                otpVerified={step1.otpVerified}
                isOtpSent={isOtpSent}
              />
            )}
            {step === 2 && (
              <Step2 data={step2} setData={setStep2} errors={errors} />
            )}
            {step === 3 && (
              <Step3 data={step3} setData={setStep3} errors={errors} />
            )}
            {step === 4 && (
              <Step4 data={step4} setData={setStep4} errors={errors} />
            )}
            {step === 5 && (
              <Step5 data={step5} setData={setStep5} errors={errors} />
            )}
            {step === 6 && (
              <Step6 data={step6} setData={setStep6} errors={errors} />
            )}
          </div>
          <div className="ob-footer">
            <div className="ob-footer-left">
              {step === 1
                ? "All fields marked * are required"
                : `${step - 1} of ${STEPS.length} steps completed`}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {step > 1 && (
                <button className="btn-ob-back" onClick={handleBack}>
                  ← Back
                </button>
              )}
              <button className="btn-ob-gold" onClick={handleNext}>
                {step === 6 ? "Submit Application" : "Continue"} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding;
