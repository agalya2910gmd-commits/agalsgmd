// components/ContactPage.jsx
import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaCheckCircle,
  FaRegSmile,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      details: ["123 Fashion Avenue", "New York, NY 10001", "United States"],
      color: "#ff6b35",
    },
    {
      icon: FaPhoneAlt,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      color: "#ff6b35",
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: ["hello@nivest.com", "support@nivest.com"],
      color: "#ff6b35",
    },
    {
      icon: FaClock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9AM - 8PM",
        "Saturday: 10AM - 6PM",
        "Sunday: Closed",
      ],
      color: "#ff6b35",
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, url: "https://facebook.com", label: "Facebook" },
    { icon: FaTwitter, url: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, url: "https://instagram.com", label: "Instagram" },
    { icon: FaLinkedin, url: "https://linkedin.com", label: "LinkedIn" },
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unused items in original packaging. Contact our support team to initiate a return.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track it in your account dashboard.",
    },
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Get in Touch</h1>
          <p>
            We'd love to hear from you. Whether you have a question about our
            products, need assistance with an order, or just want to say hello,
            we're here to help.
          </p>
          <div className="hero-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Contact</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Success Message */}
        {isSubmitted && (
          <div className="success-message">
            <FaCheckCircle className="success-icon" />
            <div className="success-content">
              <h4>Message Sent Successfully!</h4>
              <p>
                Thank you for reaching out. We'll get back to you within 24
                hours.
              </p>
            </div>
          </div>
        )}

        {/* Contact Info Cards */}
        <div className="contact-info-grid">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="info-card">
                <div
                  className="info-icon"
                  style={{ background: `${info.color}15` }}
                >
                  <Icon style={{ color: info.color }} />
                </div>
                <h3>{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i}>{detail}</p>
                ))}
              </div>
            );
          })}
        </div>

        {/* Contact Form and Map Section */}
        <div className="form-map-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Send Us a Message</h2>
              <p>
                Have a question or feedback? Fill out the form below and we'll
                respond as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "error" : ""}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? "error" : ""}
                  placeholder="How can we help you?"
                />
                {errors.subject && (
                  <span className="error-message">{errors.subject}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? "error" : ""}
                  placeholder="Tell us more about your inquiry..."
                />
                {errors.message && (
                  <span className="error-message">{errors.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="map-container">
            <iframe
              title="Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316c7c5e9f%3A0xc89d5fe1c9e7d2b!2sFashion%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>
              Find quick answers to common questions about our products and
              services.
            </p>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Connect Section */}
        <div className="social-section">
          <div className="social-content">
            <FaRegSmile className="smile-icon" />
            <h3>Connect With Us</h3>
            <p>
              Follow us on social media for the latest updates, promotions, and
              style inspiration.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          background: linear-gradient(135deg, #fffaf7 0%, #ffffff 100%);
          min-height: 100vh;
          padding-top: 100px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg,  #e0d996 100%);
          padding: 80px 24px 60px;
          text-align: center;
          margin-bottom: 60px;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-section h1 {
          font-family: "Playfair Display", serif;
          font-size: 56px;
          font-weight: 700;
          color: #070707;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .hero-section p {
          font-family: "DM Sans", sans-serif;
          font-size: 18px;
          color: rgba(10, 10, 10, 0.95);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .hero-breadcrumb {
          display: flex;
          justify-content: center;
          gap: 12px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
        }

        .hero-breadcrumb a {
          color: rgba(7, 7, 7, 0.8);
          text-decoration: none;
          transition: color 0.3s;
        }

        .hero-breadcrumb a:hover {
          color: #ffffff;
        }

        .hero-breadcrumb span {
          color: rgba(255, 255, 255, 0.6);
        }

        .hero-breadcrumb .current {
          color: #ffffff;
        }

        /* Success Message */
        .success-message {
          position: fixed;
          top: 120px;
          right: 24px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px -5px rgba(76, 175, 80, 0.3);
          z-index: 1000;
          animation: slideInRight 0.3s ease-out;
          max-width: 350px;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .success-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .success-content h4 {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .success-content p {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          margin: 0;
          opacity: 0.9;
        }

        /* Contact Info Grid */
        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
          margin-bottom: 80px;
        }

        .info-card {
          text-align: center;
          padding: 32px 24px;
          background: #ffffff;
          border-radius: 24px;
          transition: all 0.3s;
          border: 1px solid rgba(255, 107, 53, 0.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .info-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(255, 107, 53, 0.1);
          border-color: rgba(255, 107, 53, 0.2);
        }

        .info-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .info-card h3 {
          font-family: "Playfair Display", serif;
          font-size: 20px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 16px;
        }

        .info-card p {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #6c6c6c;
          line-height: 1.6;
          margin: 8px 0;
        }

        /* Form and Map Section */
        .form-map-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 80px;
        }

        .form-container {
          background: #ffffff;
          padding: 40px;
          border-radius: 24px;
          border: 1px solid rgba(255, 107, 53, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .form-header {
          margin-bottom: 32px;
          text-align: left;
        }

        .form-header h2 {
          font-family: "Playfair Display", serif;
          font-size: 32px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 12px;
        }

        .form-header p {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          color: #6c6c6c;
          line-height: 1.5;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #2d2d2d;
        }

        .form-group input,
        .form-group textarea {
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          transition: all 0.3s;
          outline: none;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #ff4444;
        }

        .error-message {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          color: #ff4444;
        }

        .submit-btn {
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
          color: #ffffff;
          border: none;
          padding: 14px 28px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 600;
          border-radius: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .map-container {
          background: #f5f5f5;
          border-radius: 24px;
          overflow: hidden;
          height: 100%;
          min-height: 500px;
          border: 1px solid rgba(255, 107, 53, 0.1);
        }

        /* FAQ Section */
        .faq-section {
          margin-bottom: 80px;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .faq-header h2 {
          font-family: "Playfair Display", serif;
          font-size: 36px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 12px;
        }

        .faq-header p {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          color: #6c6c6c;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .faq-card {
          background: #ffffff;
          padding: 28px;
          border-radius: 20px;
          border: 1px solid rgba(255, 107, 53, 0.1);
          transition: all 0.3s;
        }

        .faq-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          border-color: rgba(255, 107, 53, 0.2);
        }

        .faq-card h3 {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 600;
          color: #ff6b35;
          margin-bottom: 12px;
        }

        .faq-card p {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #6c6c6c;
          line-height: 1.6;
        }

        /* Social Section */
        .social-section {
          background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%);
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          margin-bottom: 60px;
          border: 1px solid rgba(255, 107, 53, 0.1);
        }

        .social-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .smile-icon {
          font-size: 48px;
          color: #ff6b35;
          margin-bottom: 20px;
        }

        .social-section h3 {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 12px;
        }

        .social-section p {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          color: #6c6c6c;
          margin-bottom: 32px;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .social-link {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff6b35;
          font-size: 20px;
          transition: all 0.3s;
          border: 1px solid rgba(255, 107, 53, 0.2);
          text-decoration: none;
        }

        .social-link:hover {
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
          color: #ffffff;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .form-map-section {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .contact-info-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }

          .hero-section h1 {
            font-size: 42px;
          }

          .hero-section p {
            font-size: 16px;
          }

          .form-container {
            padding: 28px;
          }

          .map-container {
            min-height: 400px;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 20px;
          }

          .hero-section {
            padding: 60px 20px 40px;
          }

          .hero-section h1 {
            font-size: 36px;
          }

          .form-header h2 {
            font-size: 28px;
          }

          .social-section {
            padding: 40px 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
