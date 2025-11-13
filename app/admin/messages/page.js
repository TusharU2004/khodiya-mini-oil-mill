'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import DashboardLayout from '../dashboard/layout';
import './messages.css'; // reuse existing CSS (or create messages.css)

const ITEMS_PER_PAGE = 10;

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', contact: '', subject: '', message_text: '', status: 0 });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      showToast('Failed to fetch messages', 'error');
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return messages;
    return messages.filter(m =>
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.message_text || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleOpenModal = async (type, msg = null) => {
    setModalType(type);
    setCurrentMessage(msg);
    setErrors({});
    setIsModalOpen(true);

    if (type === 'view' && msg) {
      // fetch full message if needed
      try {
        const res = await fetch(`/api/messages/${msg.id}`);
        if (!res.ok) throw new Error('Could not fetch message');
        const data = await res.json();
        setFormData({
          name: data.name,
          email: data.email,
          contact: data.contact || '',
          subject: data.subject || '',
          message_text: data.message_text || '',
          status: data.status ?? 0
        });

        // Optionally mark as read automatically (uncomment if desired)
        // await fetch(`/api/messages/${msg.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: 1 }) });

      } catch (err) {
        showToast(err.message || 'Failed to load message', 'error');
      }
    } else if (type === 'delete') {
      setFormData({}); // no form needed
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setCurrentMessage(null);
    setFormData({ name: '', email: '', contact: '', subject: '', message_text: '', status: 0 });
    setErrors({});
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/messages/${currentMessage.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete message');
      await fetchMessages();
      handleCloseModal();
      showToast('Message deleted');
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleMarkStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      await fetchMessages();
      showToast(status === 1 ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      showToast(err.message || 'Failed to update', 'error');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour:'2-digit', minute:'2-digit' });

  return (
    <DashboardLayout>
      <div className="products-page">
        <header className="page-header">
          <h1>Contact Messages</h1>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input placeholder="Search ..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
          </div>
        </header>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? paginated.map((m, i) => (
                <tr key={m.id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.contact}</td>
                  <td>{m.subject || '—'}</td>
                  <td style={{ maxWidth: 300, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.message_text}</td>
                  <td>{formatDate(m.created_at)}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleOpenModal('view', m)} title="View"><Edit size={16} /></button>
                      <button onClick={() => handleOpenModal('delete', m)} className="delete" title="Delete"><Trash2 size={16} /></button>
                      <button onClick={() => handleMarkStatus(m.id, m.status === 1 ? 0 : 1)} title={m.status === 1 ? 'Mark as Unread' : 'Mark as Read'}>
                        {m.status === 1 ? 'Unread' : 'Read'}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" style={{ textAlign:'center', padding:'20px' }}>No messages found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}

        {isModalOpen && modalType === 'view' && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Message from {formData.name}</h2>
              <div className="modal-body">
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Contact:</strong> {formData.contact}</p>
                <p><strong>Subject:</strong> {formData.subject}</p>
                <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{formData.message_text}</p>
              </div>
              <div className="modal-actions">
                <button className="cancel" onClick={handleCloseModal}>Close</button>
                <button className="save" onClick={async () => { await handleMarkStatus(currentMessage.id, 1); handleCloseModal(); }}>Mark as Read</button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && modalType === 'delete' && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete message from <strong>{currentMessage?.name}</strong>?</p>
              <div className="modal-actions">
                <button className="cancel" onClick={handleCloseModal}>Cancel</button>
                <button className="delete-confirm" onClick={handleDelete}>Yes, Delete</button>
              </div>
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
