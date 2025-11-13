'use client';

import { useRef, useMemo, useEffect, useState } from 'react';

// Inline star component (no extra file needed)
function StarRow({ rating }) {
  const full = Math.round(Number(rating) || 0);
  return <p className="stars">{'★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full)}</p>;
}

function formatDate(d) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

  // Fetch reviews dynamically
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Failed to fetch reviews');

        const data = await res.json();

        const mapped = (Array.isArray(data) ? data : []).map(item => ({
          author_name: item.reviewer_name ?? '',
          text: item.review_text ?? '',
          date: item.review_date ?? item.created_at,
          rating: item.rating ?? 0,
        }));

        if (!cancelled) setReviews(mapped);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => (cancelled = true);
  }, []);

  // Sort newest first
  const sorted = useMemo(() => {
    return [...reviews].sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    );
  }, [reviews]);

  const total = sorted.length;
  const avg = total === 0 ? 0 :
    Math.round((sorted.reduce((s, r) => s + (Number(r.rating) || 0), 0) / total) * 10) / 10;

  const scrollByCards = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;

    const card = el.querySelector('.testimonial-card');
    const gap = 16;
    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width + gap;
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  return (
    <section className="testimonials-section text-center">
      <div className="container">
        <h2>Pure Quality, Proven by Our Customers</h2>

        {total > 0 && (
          <p className="overall">
            Rating: <strong>{avg.toFixed(1)}</strong> / 5 ({total} reviews)
          </p>
        )}

        <div className="carousel">
          <button className="nav-btn prev" onClick={() => scrollByCards(-1)}>‹</button>

          <div className="track" ref={trackRef}>
            {sorted.map((r, i) => (
              <div className="testimonial-card" key={i}>
                <StarRow rating={r.rating} />
                <h4>{r.author_name}</h4>
                <p className="date">{formatDate(r.date)}</p>
                {r.text ? <p>“{r.text}”</p> : null}
              </div>
            ))}

            {/* Fallback static cards if no reviews */}
            {sorted.length === 0 && !loading && (
              <>
                <div className="testimonial-card">
                  <p className="stars">★★★★★</p>
                  <h4>Tushar</h4>
                  <p className="date">7 July 2025</p>
                </div>
                <div className="testimonial-card">
                  <p className="stars">★★★★★</p>
                  <h4>King</h4>
                  <p className="date">7 July 2025</p>
                </div>
                <div className="testimonial-card">
                  <p className="stars">★★★★★</p>
                  <h4>Jenil Umaretiya</h4>
                  <p className="date">10 June 2025</p>
                  <p>“I have best experience in shop”</p>
                </div>
              </>
            )}
          </div>

          <button className="nav-btn next" onClick={() => scrollByCards(1)}>›</button>
        </div>
      </div>
    </section>
  );
}
