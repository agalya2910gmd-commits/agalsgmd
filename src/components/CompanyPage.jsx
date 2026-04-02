// components/CompanyPage.jsx
import React from "react";
import {
  FaLeaf,
  FaPaintBrush,
  FaUsers,
  FaTruck,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa";

const CompanyPage = () => {
  const team = [
    {
      name: "Emma Chen",
      role: "Founder & Creative Director",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
      name: "Marcus Rivera",
      role: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      name: "Sofia Laurent",
      role: "Sustainability Lead",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    },
    {
      name: "James Kim",
      role: "Production Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
  ];

  const values = [
    {
      icon: <FaLeaf />,
      title: "Sustainability",
      desc: "100% organic materials by 2025, carbon-neutral operations",
    },
    {
      icon: <FaPaintBrush />,
      title: "Craftsmanship",
      desc: "Every piece is thoughtfully designed and meticulously crafted",
    },
    {
      icon: <FaUsers />,
      title: "Community",
      desc: "Built with our customers, for our customers, always",
    },
    {
      icon: <FaTruck />,
      title: "Ethical Production",
      desc: "Fair wages and safe conditions for all workers",
    },
    {
      icon: <FaShieldAlt />,
      title: "Quality Guarantee",
      desc: "Lifetime warranty on all products",
    },
    {
      icon: <FaGlobe />,
      title: "Global Impact",
      desc: "1% of sales donated to environmental causes",
    },
  ];

  const milestones = [
    {
      year: "2018",
      title: "Founded in NYC",
      desc: "Started in a small Brooklyn studio",
    },
    {
      year: "2020",
      title: "First Flagship",
      desc: "Opened our first physical store",
    },
    {
      year: "2022",
      title: "Global Expansion",
      desc: "Reached 12 countries worldwide",
    },
    {
      year: "2024",
      title: "Carbon Neutral",
      desc: "Achieved carbon-neutral operations",
    },
  ];

  return (
    <div className="company-page">
      {/* Hero Section */}
      <div className="company-hero">
        <div className="container">
          <div className="company-hero-content">
            <span className="hero-badge">Since 2018</span>
            <h1 className="hero-title">
              Designing for the
              <br />
              Thoughtful Generation
            </h1>
            <p className="hero-subtitle">
              We believe that great design should be accessible, sustainable,
              and built to last. Nivest exists to create pieces that transcend
              seasons and trends.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <span className="section-badge">Our Mission</span>
              <h2>
                To redefine what
                <br />
                essential means
              </h2>
              <p>
                In a world of fast fashion and disposable trends, we're building
                something different. Every Nivest piece is designed with
                intention, crafted with care, and made to be worn for years, not
                months.
              </p>
              <div className="mission-stats">
                <div className="stat">
                  <span className="stat-number">40+</span>
                  <span className="stat-label">Team Members</span>
                </div>
                <div className="stat">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Countries</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Sustainable</span>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
                alt="Studio"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">What We Stand For</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Our Journey</span>
            <h2>Milestones That Define Us</h2>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">{milestone.year}</div>
                <div className="timeline-content">
                  <h4>{milestone.title}</h4>
                  <p>{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">The Minds Behind It</span>
            <h2>Meet the Team</h2>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="company-cta">
        <div className="container">
          <div className="cta-content">
            <h3>Join Our Journey</h3>
            <p>
              Be part of a community that values thoughtful design and
              sustainable living
            </p>
            <button className="cta-button">Explore Our Story</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .company-page {
          background: linear-gradient(135deg, #e6e6ec, );
          min-height: 100vh;
        }

        .company-hero {
          background: linear-gradient(135deg, #e6e6ec, );
          padding: 140px 20px 100px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero-badge {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #d4a853;
          margin-bottom: 20px;
          font-family: "DM Sans", sans-serif;
        }

        .hero-title {
          font-family: "Playfair Display", serif;
          font-size: 64px;
          font-weight: 400;
          color: #0c0c0b;
          margin-bottom: 24px;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-family: "DM Sans", sans-serif;
          font-size: 18px;
          color: #080808;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .mission-section {
          padding: 100px 0;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .section-badge {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #d4a853;
          margin-bottom: 16px;
          font-family: "DM Sans", sans-serif;
        }

        .mission-content h2 {
          font-family: "Playfair Display", serif;
          font-size: 42px;
          font-weight: 400;
          color: #030303;
          margin-bottom: 24px;
          line-height: 1.2;
        }

        .mission-content p {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          color: #030303;
          line-height: 1.8;
          margin-bottom: 32px;
        }

        .mission-stats {
          display: flex;
          gap: 40px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-family: "Playfair Display", serif;
          font-size: 36px;
          font-weight: 400;
          color: #d4a853;
          margin-bottom: 8px;
        }

        .stat-label {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          color: #030303;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .mission-image {
          border-radius: 16px;
          overflow: hidden;
        }

        .mission-image img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.5s;
        }

        .mission-image:hover img {
          transform: scale(1.05);
        }

        .values-section {
          background: linear-gradient(135deg, #e6e6ec, );
          padding: 100px 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-family: "Playfair Display", serif;
          font-size: 42px;
          font-weight: 400;
          color: #f5f0eb;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 40px;
        }

        .value-card {
          background: #0a0a0a;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid #1a1a1a;
          transition: all 0.3s;
          text-align: center;
        }

        .value-card:hover {
          border-color: #d4a853;
          transform: translateY(-5px);
        }

        .value-icon {
          font-size: 40px;
          color: #d4a853;
          margin-bottom: 20px;
        }

        .value-card h3 {
          font-family: "Playfair Display", serif;
          font-size: 20px;
          font-weight: 400;
          color: #f5f0eb;
          margin-bottom: 12px;
        }

        .value-card p {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #888;
          line-height: 1.6;
        }

        .timeline-section {
          padding: 100px 0;
        }

        .timeline {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .timeline::before {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 100%;
          background: linear-gradient(135deg, #e6e6ec, );
        }

        .timeline-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 60px;
          position: relative;
        }

        .timeline-item:nth-child(even) {
          flex-direction: row-reverse;
        }

        .timeline-year {
          width: 120px;
          font-family: "Playfair Display", serif;
          font-size: 32px;
          color: #d4a853;
          font-weight: 400;
        }

        .timeline-content {
          width: calc(50% - 40px);
          background: #0f0f0f;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #1a1a1a;
        }

        .timeline-content h4 {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 400;
          color: #f5f0eb;
          margin-bottom: 8px;
        }

        .timeline-content p {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #888;
        }

        .team-section {
          background: linear-gradient(135deg, #e6e6ec, #85c2c2, #6f7072);
          padding: 100px 0;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 40px;
        }

        .team-card {
          text-align: center;
        }

        .team-image {
          width: 200px;
          height: 200px;
          margin: 0 auto 20px;
          border-radius: 50%;
          overflow: hidden;
        }

        .team-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .team-card:hover img {
          transform: scale(1.05);
        }

        .team-card h4 {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 400;
          color: #f5f0eb;
          margin-bottom: 8px;
        }

        .team-card p {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          color: #888;
        }

        .company-cta {
          padding: 100px 20px;
          text-align: center;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-content h3 {
          font-family: "Playfair Display", serif;
          font-size: 36px;
          font-weight: 400;
          color: #f5f0eb;
          margin-bottom: 16px;
        }

        .cta-content p {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          color: #888;
          margin-bottom: 32px;
        }

        .cta-button {
          background: #d4a853;
          border: none;
          padding: 14px 36px;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 8px;
        }

        .cta-button:hover {
          background: #c49a3f;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 40px;
          }

          .mission-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .mission-content h2 {
            font-size: 32px;
          }

          .timeline::before {
            left: 30px;
          }

          .timeline-item,
          .timeline-item:nth-child(even) {
            flex-direction: column;
            margin-left: 60px;
          }

          .timeline-year {
            margin-bottom: 16px;
          }

          .timeline-content {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CompanyPage;
