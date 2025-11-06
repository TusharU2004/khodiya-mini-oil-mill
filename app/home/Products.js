// app/components/home/Products.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Products = () => {
    // keep your original data and structure exactly
    const productData = [
        {
            img: '/products/product-1l.png',
            name: '1 Liter Bottle',
            desc: 'Perfect for small families and daily use',
            details: 'Freshly packed groundnut oil in 1L bottle - pure, natural, and ready for your kitchen.'
        },
        {
            img: '/products/product-5l.png',
            name: '5 Liter Can',
            desc: 'Best seller for homes in gujarat',
            details: 'Ideal for monthly cooking needs - pure groundnut oil with rich taste & nutrients.'
        },
        {
            img: '/products/product-15kg.png',
            name: '15 Kg Tin (Bulk Pack)',
            desc: 'For restaurants, shops & bulk buyers',
            details: 'Traditional steam-heated groundnut oil in an economical 15Kg - trusted by businesses & families.'
        }
    ];

    // modal state
    const [isOpen, setIsOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen]);

    const openModal = (product) => {
        setActiveProduct(product);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setActiveProduct(null);
    };

    return (
        <section className="products-section text-center">
            <div className="container">
                <h2>Products</h2>
                <div className="product-grid">
                    {productData.map((product) => (
                        <div className="product-card" key={product.name}>
                            <div className="product-image-container">
                                {/* keep Image sizing like your original file */}
                                <Image src={product.img} alt={product.name} width={250} height={250} style={{ objectFit: 'contain' }} />
                            </div>
                            <h3>{product.name}</h3>
                            <p>{product.desc}</p>
                            <p className="product-details">{product.details}</p>

                            {/* keep the same class names; change Link to button so we can open modal */}
                            <button
                                type="button"
                                onClick={() => openModal(product)}
                                className="btn product-btn"
                                aria-haspopup="dialog"
                                aria-controls="payment-modal"
                            >
                                BUY NOW
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal (keeps separate classes so it will not affect your existing CSS) */}
            {isOpen && (
                <div className="km-modal-overlay" role="dialog" aria-modal="true" id="payment-modal">
                    <div className="km-modal-backdrop" onClick={closeModal} />

                    <div className="km-modal">
                        <div className="km-modal-header">
                            <h3>{activeProduct ? activeProduct.name : "Purchase"}</h3>
                            <button className="km-modal-close" onClick={closeModal} aria-label="Close">×</button>
                        </div>

                        <div className="km-modal-body">
                            <p>
                                We're sorry — we can't accept online payments right now.
                            </p>
                            <p style={{ marginTop: '0.5rem', color: '#555' }}>
                                Please contact us to place your order. We can take orders by phone or WhatsApp and will guide you through payment options.
                            </p>
                        </div>

                        <div className="km-modal-actions">

                            {/* Optional: WhatsApp contact button; replace number if you want */}
                            <a
                                href={`https://wa.me/7043169204?text=${encodeURIComponent(
                                    `Hello! I want to buy the ${activeProduct?.name} from Khodiya Mini Oil Mill.`
                                )}`} target="_blank"
                                rel="noreferrer"
                                className="km-btn km-btn-primary"
                                onClick={closeModal}
                            >
                                Contact on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Minimal styles for the modal so it works without touching your existing CSS.
          You can move these rules into your global CSS file (e.g., globals.css) instead if you prefer.
      */}
            <style>{`
        .km-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .km-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
        }
        .km-modal {
          position: relative;
          z-index: 10000;
          background: #fff;
          width: 92%;
          max-width: 520px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .km-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        }
        .km-modal-header h3 {
          margin: 0;
          font-size: 1.125rem;
        }
        .km-modal-close {
          background: transparent;
          border: none;
          font-size: 1.25rem;
          line-height: 1;
          cursor: pointer;
        }
        .km-modal-body {
          margin-top: 12px;
          font-size: 0.95rem;
        }
        .km-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 16px;
        }
        .km-btn {
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
              font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease-in-out;
        }
        .km-btn:hover {
            background: var(--dark-color);
            color: #fff;
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
            }
       
        .km-btn-primary {
            background: var(--primary-color);
            color: #fff;
            border: 1px solid rgba(0,0,0,0.05);
        }

        /* small responsive tweak */
        @media (max-width: 480px) {
          .km-modal { padding: 16px; }
          .km-modal-actions { flex-direction: column-reverse; gap: 8px; align-items: stretch; }
        }
      `}</style>
        </section>
    );
};

export default Products;
