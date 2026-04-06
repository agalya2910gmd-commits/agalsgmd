import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPinterest,
} from "react-icons/fa";

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');

  :root {
    --ft-bg:        #696b70;
    --ft-surface:   #88898d;
    --ft-border:    rgba(128, 122, 122, 0.06);
    --ft-blue:      #0b111d;
    --ft-blue-dim:  rgba(59,130,246,0.12);
    --ft-white:     #EDF2FF;
    --ft-grey:      #080808;
    --ft-grey-lt:   #050505;
    --ft-muted:     #111111;
  }

  .ft-root {
     background: linear-gradient(135deg, #e6e6ec, , #6f7072);
    font-family: 'Outfit', sans-serif;
    color: var(--ft-white);
    position: relative;
    overflow: hidden;
  }

  /* subtle grid texture */
  .ft-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* top blue accent line */
  .ft-topbar {
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--ft-blue), transparent);
    opacity: 0.8;
  }

  .ft-inner {
    padding: 70px 0 0;
    position: relative;
    z-index: 1;
  }

  /* ── Brand col ── */
  .ft-brand-logo {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-weight: 600;
    color: var(--ft-white);
    letter-spacing: -0.5px;
    margin-bottom: 10px;
    line-height: 1;
  }
  .ft-brand-logo span {
    color: var(--ft-blue);
    font-style: italic;
    font-weight: 400;
  }

  .ft-brand-tag {
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--ft-blue);
    margin-bottom: 20px;
    opacity: 0.9;
  }

  .ft-brand-desc {
    font-size: 15px;
    color: var(--ft-grey);
    font-weight: 400;
    line-height: 1.8;
    max-width: 280px;
    margin-bottom: 28px;
  }

  .ft-socials {
    display: flex;
    gap: 12px;
  }
  .ft-social-btn {
    width: 42px;
    height: 42px;
    background: #b3934e;
    border: 0.5px solid var(--ft-border);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    color: #0c0c0b;
    text-decoration: none;
  }
  .ft-social-btn svg {
    font-size: 18px;
  }
  .ft-social-btn:hover {
    background: var(--ft-blue-dim);
    border-color: rgba(131, 133, 138, 0.35);
    color: var(--ft-blue);
    transform: translateY(-2px);
  }

  /* ── Column headings ── */
  .ft-col-head {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--ft-blue);
    margin-bottom: 24px;
    display: inline-block;
    position: relative;
  }
  
  .ft-col-head::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background: var(--ft-blue);
    opacity: 0.5;
  }

  /* ── Links Container ── */
  .ft-links-container {
    margin-top: 8px;
  }
  
  .ft-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .ft-links li a,
  .ft-links li span {
    font-size: 15px;
    color: var(--ft-grey-lt);
    text-decoration: none;
    font-weight: 400;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: color 0.2s, gap 0.2s;
  }
  .ft-links li a:hover,
  .ft-links li span:hover {
    color: var(--ft-white);
    gap: 14px;
  }
  .ft-links li a::before,
  .ft-links li span::before {
    content: '→';
    font-size: 12px;
    color: var(--ft-blue);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .ft-links li a:hover::before,
  .ft-links li span:hover::before {
    opacity: 1;
  }

  /* ── Subscribe ── */
  .ft-sub-desc {
    font-size: 15px;
    color: var(--ft-grey);
    font-weight: 400;
    line-height: 1.7;
    margin-bottom: 20px;
  }

  .ft-input-wrap {
    position: relative;
    margin-bottom: 12px;
  }
  .ft-input {
    width: 100%;
    background: #b3934e;
    border: 1px solid var(--ft-border);
    border-radius: 10px;
    padding: 14px 16px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    color: var(--ft-white);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ft-input::placeholder { 
    color: var(--ft-muted);
    font-size: 14px;
  }
  .ft-input:focus {
    border-color: rgba(59,130,246,0.5);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
  }

  .ft-sub-btn {
    width: 100%;
    padding: 14px 0;
    
    background:#b3934e ;
    border: none;
    border-radius: 10px;
    color: #f5f2f2;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.22s, box-shadow 0.22s;
  }
  .ft-sub-btn:hover {
    background: #b3934e;
    box-shadow: 0 4px 20px rgba(59,130,246,0.3);
    transform: translateY(-2px);
  }
  .ft-sub-btn:disabled {
    background: var(--ft-muted);
    cursor: default;
    box-shadow: none;
  }

  .ft-sub-note {
    font-size: 12px;
    color: var(--ft-muted);
    margin-top: 10px;
    line-height: 1.5;
  }

  /* ── Trust Badges ── */
  .ft-badges {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 24px;
  }
  .ft-badge {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 6px 14px;
    border-radius: 8px;
    background: rgba(255,255,255,0.08);
    border: 0.5px solid rgba(255,255,255,0.12);
    color: var(--ft-grey);
  }

  /* ── Divider ── */
  .ft-divider {
    height: 1px;
    background: var(--ft-border);
    margin: 50px 0 0;
  }

  /* ── Bottom bar ── */
  .ft-bottom {
    padding: 24px 0;
    position: relative;
    z-index: 1;
  }
  .ft-copy {
    font-size: 14px;
    color: black;
    font-weight: 400;
    margin: 0;
  }
  .ft-copy span { 
    color: var(--ft-blue);
    font-weight: 600;
  }

  .ft-legal {
    display: flex;
    gap: 24px;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  .ft-legal a {
    font-size: 13px;
    color: var(--ft-muted);
    text-decoration: none;
    transition: color 0.2s;
    cursor: pointer;
    font-weight: 400;
  }
  .ft-legal a:hover { 
    color: var(--ft-grey-lt);
    text-decoration: underline;
  }

  /* Column alignment fix */
  .col-shop, .col-help {
    text-align: left;
  }
  
  .ft-link-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ft-inner { 
      padding: 50px 0 0; 
    }
    .ft-brand-desc { 
      max-width: 100%; 
    }
    .ft-legal { 
      justify-content: center; 
      margin-top: 12px; 
      gap: 16px;
    }
    .ft-copy { 
      text-align: center; 
    }
    .ft-col-head {
      font-size: 13px;
      margin-top: 20px;
    }
    .ft-col-head::after {
      width: 30px;
    }
    .ft-links li a,
    .ft-links li span {
      font-size: 14px;
    }
    .col-shop, .col-help {
      text-align: left;
    }
  }
`;

const quickLinks = ["Home", "Shop", "New Arrivals", "Sale", "About Us"];
const helpLinks = [
  "My Account",
  "Track Order",
  "Returns & Exchanges",
  "Size Guide",
  "Contact Us",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      <style>{footerStyles}</style>
      <footer className="ft-root">
        <div className="ft-topbar" />

        <div className="ft-inner">
          <Container>
            <Row className="g-5 mb-0">
              {/* ── Brand ── */}
              <Col xs={12} md={6} lg={3}>
                <div className="ft-brand-logo">
                  <span>Shop</span>
                </div>
                <div className="ft-brand-tag">Fashion & Lifestyle</div>
                <p className="ft-brand-desc">
                  Crafted for the modern individual — where quality meets style
                  and every detail is intentional.
                </p>
                <div className="ft-socials">
                  {[
                    { icon: <FaFacebook size={18} />, label: "Facebook" },
                    { icon: <FaInstagram size={18} />, label: "Instagram" },
                    { icon: <FaTwitter size={18} />, label: "Twitter" },
                    { icon: <FaPinterest size={18} />, label: "Pinterest" },
                  ].map(({ icon, label }) => (
                    <a key={label} className="ft-social-btn" aria-label={label}>
                      {icon}
                    </a>
                  ))}
                </div>
              </Col>

              {/* ── Quick Links ── */}
              <Col xs={6} md={3} lg={2} className="col-shop">
                <div className="ft-link-section">
                  <div className="ft-col-head">Shop</div>
                  <div className="ft-links-container">
                    <ul className="ft-links">
                      {quickLinks.map((link) => (
                        <li key={link}>
                          <span>{link}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>

              {/* ── Help ── */}
              <Col xs={6} md={3} lg={2} className="col-help">
                <div className="ft-link-section">
                  <div className="ft-col-head">Help</div>
                  <div className="ft-links-container">
                    <ul className="ft-links">
                      {helpLinks.map((link) => (
                        <li key={link}>
                          <span>{link}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>

              {/* ── Subscribe ── */}
              <Col xs={12} md={6} lg={5}>
                <div className="ft-col-head">Newsletter</div>
                <p className="ft-sub-desc">
                  Get early access to new arrivals, exclusive drops, and
                  members-only offers. No spam, ever.
                </p>

                {subscribed ? (
                  <div
                    style={{
                      padding: "18px",
                      background: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.25)",
                      borderRadius: "10px",
                      fontSize: "14px",
                      color: "#60AAFF",
                      lineHeight: 1.6,
                      fontWeight: 500,
                    }}
                  >
                    ✓ &nbsp;You're on the list! Expect great things in your
                    inbox.
                  </div>
                ) : (
                  <>
                    <div className="ft-input-wrap">
                      <input
                        className="ft-input"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSubscribe()
                        }
                      />
                    </div>
                    <button className="ft-sub-btn" onClick={handleSubscribe}>
                      Subscribe Now
                    </button>
                    <p className="ft-sub-note">
                      By subscribing you agree to our Privacy Policy.
                      Unsubscribe anytime.
                    </p>
                  </>
                )}

                {/* Trust badges */}
                <div className="ft-badges">
                  {["Free Shipping", "Easy Returns", "Secure Pay"].map((b) => (
                    <span key={b} className="ft-badge">
                      {b}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>

            <div className="ft-divider" />

            {/* Bottom bar */}
            <Row className="ft-bottom align-items-center">
              <Col xs={12} md={6}>
                <p className="ft-copy">
                  © 2026 <span>MyShop</span>. All rights reserved. Crafted with
                  care.
                </p>
              </Col>
              <Col xs={12} md={6}>
                <div className="ft-legal">
                  <a>Privacy Policy</a>
                  <a>Terms of Use</a>
                  <a>Cookie Settings</a>
                  <a>Sitemap</a>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </footer>
    </>
  );
}
