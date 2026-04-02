// components/BlogPage.jsx
import React, { useState } from "react";
import { FaUser, FaCalendar, FaTag } from "react-icons/fa";

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: "How to Build a Capsule Wardrobe in 10 Pieces",
      excerpt:
        "The art of owning less but wearing more. We break down the ten foundational items every wardrobe needs for timeless style.",
      date: "March 20, 2025",
      author: "Emma Chen",
      category: "Style",
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
      featured: true,
    },
    {
      id: 2,
      title: "Why We Chose Portuguese Mills Over Fast Fashion",
      excerpt:
        "A behind-the-scenes look at our supply chain and the people who make your clothes with care and expertise.",
      date: "March 14, 2025",
      author: "Marcus Rivera",
      category: "Sustainability",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1537832816519-689ad163238b?w=800",
      featured: false,
    },
    {
      id: 3,
      title: "The Rise of Quiet Luxury: What Does It Mean?",
      excerpt:
        "Subtlety is the new status. We explore the shift away from logo-heavy fashion toward understated elegance.",
      date: "March 5, 2025",
      author: "Sofia Laurent",
      category: "Culture",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
      featured: false,
    },
    {
      id: 4,
      title: "Sustainable Materials: A Complete Guide",
      excerpt:
        "From organic cotton to recycled polyester, learn about the materials that are shaping the future of fashion.",
      date: "February 28, 2025",
      author: "James Kim",
      category: "Sustainability",
      readTime: "10 min read",
      image:
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800",
      featured: false,
    },
    {
      id: 5,
      title: "Behind the Collection: Spring/Summer 2025",
      excerpt:
        "An intimate look at the inspiration, process, and craftsmanship behind our latest collection.",
      date: "February 20, 2025",
      author: "Emma Chen",
      category: "Behind the Scenes",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
      featured: false,
    },
    {
      id: 6,
      title: "The Art of Layering: Winter Style Guide",
      excerpt:
        "Master the art of layering with these expert tips for staying warm and stylish all season long.",
      date: "February 12, 2025",
      author: "Marcus Rivera",
      category: "Style",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
      featured: false,
    },
  ];

  const featuredPost = posts.find((p) => p.featured);

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="container">
          <div className="blog-hero-content">
            <span className="hero-badge">Stories & Ideas</span>
            <h1 className="hero-title">The Nivest Journal</h1>
            <p className="hero-subtitle">
              Thoughts on style, craft, sustainability, and the world we dress
              for
            </p>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="featured-post">
          <div className="container">
            <div className="featured-card">
              <div className="featured-image">
                <img src={featuredPost.image} alt={featuredPost.title} />
                <span className="featured-badge">Featured Story</span>
              </div>
              <div className="featured-content">
                <div className="post-meta">
                  <span>
                    <FaCalendar /> {featuredPost.date}
                  </span>
                  <span>
                    <FaUser /> {featuredPost.author}
                  </span>
                  <span>
                    <FaTag /> {featuredPost.category}
                  </span>
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <div className="post-footer">
                  <span className="read-time">{featuredPost.readTime}</span>
                  <button className="read-more-btn">Read Full Story →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="posts-grid-section">
        <div className="container">
          <div className="posts-grid">
            {posts
              .filter((p) => !p.featured)
              .map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-image">
                    <img src={post.image} alt={post.title} />
                    <span className="post-category">{post.category}</span>
                  </div>
                  <div className="post-content">
                    <div className="post-meta">
                      <span>
                        <FaCalendar /> {post.date}
                      </span>
                      <span>
                        <FaUser /> {post.author}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="post-footer">
                      <span className="read-time">{post.readTime}</span>
                      <button className="read-more-link">Read More →</button>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section - Never Miss a Story */}
      <div className="blog-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h3>Never Miss a Story</h3>
            <p>
              Subscribe to our newsletter and get the latest articles delivered
              to your inbox
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-page {
          background: linear-gradient(135deg,, #cad4d4,);
          min-height: 100vh;
        }

        .blog-hero {
          background: linear-gradient(135deg, #f0ecec 0%, );
          padding: 140px 20px 80px;
          text-align: center;
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
          color: #070707;
          margin-bottom: 20px;
        }

        .hero-subtitle {
          font-family: "DM Sans", sans-serif;
          font-size: 18px;
          color: #0a0a0a;
          max-width: 600px;
          margin: 0 auto;
        }

        .featured-post {
          padding: 60px 0;
        }

        .featured-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          background: #0f0f0f;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #1a1a1a;
        }

        .featured-image {
          position: relative;
          overflow: hidden;
        }

        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .featured-card:hover .featured-image img {
          transform: scale(1.05);
        }

        .featured-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #d4a853;
          color: #0a0a0a;
          padding: 6px 14px;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-family: "DM Sans", sans-serif;
        }

        .featured-content {
          padding: 40px;
        }

        .post-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          color: #666;
        }

        .post-meta span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .featured-content h2 {
          font-family: "Playfair Display", serif;
          font-size: 32px;
          font-weight: 400;
          color: #f5f0eb;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .featured-content p {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          color: #888;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .read-time {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          color: #666;
        }

        .read-more-btn,
        .read-more-link {
          background: none;
          border: none;
          color: #d4a853;
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: all 0.3s;
        }

        .read-more-btn:hover,
        .read-more-link:hover {
          color: #c49a3f;
          transform: translateX(5px);
        }

        .posts-grid-section {
          padding: 60px 0 80px;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 40px;
        }

        .post-card {
          background: #0f0f0f;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #1a1a1a;
          transition: all 0.3s;
        }

        .post-card:hover {
          transform: translateY(-5px);
          border-color: #2a2a2a;
        }

        .post-image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .post-card:hover .post-image img {
          transform: scale(1.05);
        }

        .post-category {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: #d4a853;
          color: #0a0a0a;
          padding: 4px 12px;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: "DM Sans", sans-serif;
        }

        .post-content {
          padding: 24px;
        }

        .post-content .post-meta {
          margin-bottom: 12px;
        }

        .post-content h3 {
          font-family: "Playfair Display", serif;
          font-size: 20px;
          font-weight: 400;
          color: #f5f0eb;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .post-content p {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .blog-newsletter {
          background: linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%);
          padding: 80px 20px;
          border-top: 1px solid #1a1a1a;
        }

        .newsletter-content {
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
        }

        .newsletter-content h3 {
          font-family: "Playfair Display", serif;
          font-size: 32px;
          font-weight: 400;
          color: #f5f0eb;
          margin-bottom: 12px;
        }

        .newsletter-content p {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #888;
          margin-bottom: 28px;
        }

        .newsletter-form {
          display: flex;
          gap: 12px;
        }

        .newsletter-form input {
          flex: 1;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          padding: 14px 18px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #f5f0eb;
          border-radius: 8px;
          outline: none;
        }

        .newsletter-form input:focus {
          border-color: #d4a853;
        }

        .newsletter-form button {
          background: #d4a853;
          border: none;
          padding: 14px 28px;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 8px;
        }

        .newsletter-form button:hover {
          background: #c49a3f;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 40px;
          }

          .featured-card {
            grid-template-columns: 1fr;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .post-meta {
            flex-wrap: wrap;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogPage;
