'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import DashboardLayout from '../dashboard/layout';
import './reviews.css';

const ITEMS_PER_PAGE = 5;

const getNewFormState = () => ({
  reviewerName: '',
  reviewDate: new Date().toISOString().split('T')[0],
  rating: 5,
  reviewText: '',
});

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);
  const [formData, setFormData] = useState(getNewFormState());
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // search & pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      showToast('Failed to fetch reviews', 'error');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    if (!searchTerm) return reviews;
    return reviews.filter(r =>
      (r.reviewer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.review_text || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reviews, searchTerm]);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage); };

  // Modal handlers
  const handleOpenModal = async (type, review = null) => {
    setModalType(type);
    setCurrentReview(review);
    setErrors({});
    setIsModalOpen(true);

    if (type === 'add') {
      setFormData(getNewFormState());
    } else if (type === 'edit' && review) {
      try {
        const res = await fetch(`/api/reviews/${review.id}`);
        if (!res.ok) throw new Error('Could not fetch review details');
        const data = await res.json();
        setFormData({
          reviewerName: data.reviewer_name || '',
          reviewDate: data.review_date ? new Date(data.review_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          rating: data.rating || 5,
          reviewText: data.review_text || '',
        });
      } catch (err) {
        showToast(err.message || 'Failed to get review details', 'error');
        return;
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentReview(null);
    setModalType(null);
    setFormData(getNewFormState());
    setErrors({});
  };

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') handleCloseModal(); };
    if (isModalOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const temp = {};
    if (!formData.reviewerName || !formData.reviewerName.trim()) temp.reviewerName = 'Reviewer name is required';
    if (!formData.rating || Number(formData.rating) < 1 || Number(formData.rating) > 5) temp.rating = 'Rating 1-5';
    if (!formData.reviewText || !formData.reviewText.trim()) temp.reviewText = 'Review text is required';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const method = modalType === 'add' ? 'POST' : 'PUT';
    const endpoint = modalType === 'add' ? '/api/reviews' : `/api/reviews/${currentReview.id}`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer_name: formData.reviewerName,
          review_date: formData.reviewDate,
          rating: Number(formData.rating),
          review_text: formData.reviewText,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to save review');
      }
      await fetchReviews();
      handleCloseModal();
      showToast(modalType === 'add' ? 'Review added!' : 'Review updated!');
    } catch (err) {
      showToast(err.message || 'Unexpected error', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/reviews/${currentReview.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete review');
      await fetchReviews();
      handleCloseModal();
      showToast('Review deleted');
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const formatDateTime = (d) => new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

  return (
    <DashboardLayout>
      <div className="reviews-page">
        <header className="page-header">
          <h1>Manage Reviews</h1>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input placeholder="Search ..." value={searchTerm} onChange={handleSearchChange} />
            </div>
          </div>
          <button className="add-button" onClick={() => handleOpenModal('add')}>
            <Plus size={18} /> Add Review
          </button>
        </header>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.length > 0 ? paginatedReviews.map((r, i) => (
                <tr key={r.id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                  <td>{r.reviewer_name}</td>
                  <td>{r.rating} / 5</td>
                  <td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.review_text}</td>
                  <td>{formatDateTime(r.review_date || r.created_at)}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleOpenModal('edit', r)} title="Edit"><Edit size={16} /></button>
                      <button onClick={() => handleOpenModal('delete', r)} className="delete" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ textAlign:'center', padding:'20px' }}>No reviews found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {(modalType === 'add' || modalType === 'edit') && (
                <>
                  <h2>{modalType === 'add' ? 'New Review' : 'Edit Review'}</h2>
                  <div className="modal-body">
                    <div className="form-header-grid">
                      <div className="form-group">
                        <label>Reviewer Name</label>
                        <input value={formData.reviewerName} onChange={e => handleFormChange('reviewerName', e.target.value)} className={errors.reviewerName ? 'input-error' : ''} />
                        {errors.reviewerName && <span className="error-text">{errors.reviewerName}</span>}
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input type="date" value={formData.reviewDate} onChange={e => handleFormChange('reviewDate', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Rating</label>
                        <input type="number" min="1" max="5" value={formData.rating} onChange={e => handleFormChange('rating', e.target.value)} className={errors.rating ? 'input-error' : ''} />
                        {errors.rating && <span className="error-text">{errors.rating}</span>}
                      </div>
                      <div className="form-group full-width">
                        <label>Review</label>
                        <textarea value={formData.reviewText} onChange={e => handleFormChange('reviewText', e.target.value)} rows={4} className={errors.reviewText ? 'input-error' : ''} />
                        {errors.reviewText && <span className="error-text">{errors.reviewText}</span>}
                      </div>
                    </div>

                    <div className="modal-footer">
                      <div></div>
                      <div className="modal-actions">
                        <button className="cancel" onClick={handleCloseModal}>Cancel</button>
                        <button className="save" onClick={handleSave}>Save Review</button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'delete' && (
                <>
                  <h2>Confirm Deletion</h2>
                  <p>Are you sure you want to delete the review by <strong>"{currentReview?.reviewer_name}"</strong>?</p>
                  <p className="warning">This action cannot be undone.</p>
                  <div className="modal-actions">
                    <button onClick={handleCloseModal} className="cancel">Cancel</button>
                    <button onClick={handleDelete} className="delete-confirm">Yes, Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {toast.show && (
          <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
