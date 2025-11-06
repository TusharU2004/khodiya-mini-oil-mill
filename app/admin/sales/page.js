'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Package, Plus, Edit, Trash2, CheckCircle, XCircle, Search, PlusCircle } from 'lucide-react';
import DashboardLayout from '../dashboard/layout';
import './sales.css'; // same as purchases.css

const ITEMS_PER_PAGE = 5;

const getNewFormState = () => ({
    partyName: '',
    partyMobile: '',
    partyAddress: '',
    salesDate: new Date().toISOString().split('T')[0],
    billNo: 'Fetching...',
    voucherNo: '',
    paymentType: 'credit',
    remarks: '',
    items: [{ product_id: '', quantity: 1, rate: 0, packing: '' }],
    discount: 0,
});

export default function SalesPage() {
    const [sales, setSales] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [currentSale, setCurrentSale] = useState(null);
    const [formData, setFormData] = useState(getNewFormState());
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const fetchSales = async () => {
        try {
            const res = await fetch('/api/sales');
            if (!res.ok) throw new Error('Failed to fetch sales');
            const data = await res.json();
            setSales(data);
        } catch {
            showToast('Failed to fetch sales', 'error');
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setAvailableProducts(data);
        } catch {
            showToast('Failed to load products', 'error');
        }
    };

    useEffect(() => {
        fetchSales();
        fetchProducts();
    }, []);

    const filteredSales = useMemo(() => {
        if (!searchTerm) return sales;
        return sales.filter(
            (s) =>
                s.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.bill_no.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sales, searchTerm]);

    const paginatedSales = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredSales.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredSales, currentPage]);

    const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    const handleOpenModal = async (type, sale = null) => {
        setModalType(type);
        setCurrentSale(sale);
        setErrors({});
        setIsModalOpen(true);

        if (type === 'add') {
            try {
                setFormData({ ...getNewFormState(), billNo: 'Generating...' });
                const res = await fetch('/api/sales/next-bill-number');
                const data = await res.json();
                setFormData((prev) => ({ ...prev, billNo: data.billNo }));
            } catch {
                showToast('Failed to generate bill number', 'error');
            }
        } else if (type === 'edit' && sale) {
            try {
                const res = await fetch(`/api/sales/${sale.id}`);
                const data = await res.json();
                setFormData({
                    partyName: data.party_name,
                    partyMobile: data.party_mobile || '',
                    partyAddress: data.party_address || '',
                    salesDate: new Date(data.sales_date).toISOString().split('T')[0],
                    billNo: data.bill_no,
                    voucherNo: data.voucher_no,
                    paymentType: data.payment_type,
                    remarks: data.remarks,
                    items: data.items.map((i) => ({ ...i, product_id: i.product_id.toString() })),
                    discount: data.discount || 0,
                });
            } catch {
                showToast('Failed to fetch sale details', 'error');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSale(null);
        setModalType(null);
        setFormData(getNewFormState());
        setErrors({});
    };

    useEffect(() => {
        // Function to be called when a key is pressed
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleCloseModal();
            }
        };

        // Add the event listener only when the modal is open
        if (isModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // It removes the event listener when the modal is closed or the component unmounts.
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen]); // This effect depends on the isModalOpen state


    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData((prev) => ({ ...prev, items: newItems }));
    };

    const addItemRow = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, { product_id: '', quantity: 1, rate: 0, packing: '' }],
        }));
    };

    const removeItemRow = (index) => {
        if (formData.items.length === 1) return showToast('At least one item required', 'error');
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const subtotal = useMemo(
        () =>
            formData.items.reduce(
                (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
                0
            ),
        [formData.items]
    );

    const grandTotal = useMemo(() => {
        const discountAmount = Number(formData.discount) || 0;
        return (subtotal - discountAmount).toFixed(2);
    }, [subtotal, formData.discount]);

    const validateForm = () => {
        const tempErrors = {};
        if (!formData.partyName.trim()) tempErrors.partyName = 'Party name required';
        if (!formData.billNo.trim()) tempErrors.billNo = 'Bill no required';

        formData.items.forEach((item, idx) => {
            if (!item.product_id) tempErrors[`product_${idx}`] = 'Select a product';
            if (!item.quantity || Number(item.quantity) <= 0) tempErrors[`quantity_${idx}`] = 'Qty must be > 0';
        });

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        const method = modalType === 'add' ? 'POST' : 'PUT';
        const endpoint = modalType === 'add' ? '/api/sales' : `/api/sales/${currentSale.id}`;
        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save the sales.');
            }
            await fetchSales();
            handleCloseModal();
            showToast(modalType === 'add' ? 'Sale added successfully!' : 'Sale updated successfully!');
        } catch (err) {
            showToast(err.message || 'An unexpected error occurred.', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/sales/${currentSale.id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            await fetchSales();
            handleCloseModal();
            showToast('Sale deleted successfully!');
        } catch (err) {
            showToast('Failed to delete successfully', 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <DashboardLayout>
            <div className="products-page">
                <header className="page-header">
                    <h1>Manage Sales Invoice</h1>
                    <div className="header-actions">
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search ..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <button className="add-button" onClick={() => handleOpenModal('add')}>
                        <Plus size={18} /> Add Invoice
                    </button>
                </header>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                <th>Bill No.</th>
                                <th>Party</th>
                                <th>Mobile</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSales.length > 0 ? (
                                paginatedSales.map((s, i) => (
                                    <tr key={s.id}>
                                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                                        <td>{s.bill_no}</td>
                                        <td>{s.party_name}</td>
                                        <td>{s.party_mobile || '-'}</td>
                                        <td>{new Date(s.sales_date).toLocaleDateString('en-IN')}</td>
                                        <td>
                                            <span className={`status-badge status-${s.payment_type}`}>
                                                {s.payment_type}
                                            </span>
                                        </td>
                                        <td>₹{Number(s.grand_total).toLocaleString('en-IN')}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => handleOpenModal('edit', s)}><Edit size={16} /></button>
                                                <button onClick={() => handleOpenModal('delete', s)} className="delete"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                        No sales found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                )}

                {isModalOpen && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            {(modalType === 'add' || modalType === 'edit') && (
                                <>
                                    <h2>{modalType === 'add' ? 'New Sale' : 'Edit Sale'}</h2>
                                    <div className="modal-body">
                                        <div className="purchase-form-container">

                                            <div className="form-header-grid">
                                                <div className="form-group">
                                                    <label>Party Name</label>
                                                    <input
                                                        value={formData.partyName}
                                                        onChange={(e) => handleFormChange('partyName', e.target.value)}
                                                        className={errors.partyName ? 'input-error' : ''}
                                                    />
                                                    {errors.partyName && <span className="error-text">{errors.partyName}</span>}

                                                </div>
                                                <div className="form-group"><label>Mobile</label><input value={formData.partyMobile} onChange={(e) => handleFormChange('partyMobile', e.target.value)} /></div>
                                                <div className="form-group"><label>Address</label><input value={formData.partyAddress} onChange={(e) => handleFormChange('partyAddress', e.target.value)} /></div>
                                                <div className="form-group"><label>Date</label><input type="date" value={formData.salesDate} onChange={(e) => handleFormChange('salesDate', e.target.value)} /></div>
                                                <div className="form-group">
                                                    <label>Bill No.</label>
                                                    <input
                                                        value={formData.billNo}
                                                        onChange={e => handleFormChange('billNo', e.target.value)}
                                                        className={errors.billNo ? 'input-error' : ''}
                                                    />
                                                    {errors.billNo && <span className="error-text">{errors.billNo}</span>}

                                                </div>
                                                <div className="form-group"><label>Payment</label><select value={formData.paymentType} onChange={(e) => handleFormChange('paymentType', e.target.value)}><option value="credit">Credit</option><option value="cash">Cash</option></select></div>
                                                <div className="form-group full-width"><label>Remarks</label><input value={formData.remarks} onChange={(e) => handleFormChange('remarks', e.target.value)} /></div>
                                            </div>


                                            <div className="items-table-container">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th><th className="product-col">Product</th><th>Packing</th><th>Qty</th><th>Rate</th><th>Amount</th><th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.items.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td>{idx + 1}</td>
                                                                <td>
                                                                    <select
                                                                        value={item.product_id}
                                                                        onChange={e => handleItemChange(idx, 'product_id', e.target.value)}
                                                                        className={errors[`product_${idx}`] ? 'input-error' : ''}
                                                                    >
                                                                        <option value="">Select Product</option>
                                                                        {availableProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                                    </select>
                                                                </td>
                                                                <td><input placeholder="e.g., 15kg Tin" value={item.packing} onChange={e => handleItemChange(idx, 'packing', e.target.value)} /></td>
                                                                <td><input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} />{errors[`quantity_${idx}`] && <span className="error-text">{errors[`quantity_${idx}`]}</span>}</td>
                                                                <td><input type="number" value={item.rate} onChange={e => handleItemChange(idx, 'rate', e.target.value)} /></td>
                                                                <td>{((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}</td>
                                                                <td><button type="button" className="delete-row-btn" onClick={() => removeItemRow(idx)}><Trash2 size={16} /></button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <button type="button" className="add-row-btn" onClick={addItemRow}><PlusCircle size={16} /> Add Item</button>
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="modal-footer">
                                            {/* NEW: Section for totals */}
                                            <div className="totals-section">
                                                <div className="total-row">
                                                    <h4>Subtotal:</h4>
                                                    <span>₹{subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="total-row discount-row">
                                                    <h4>Discount:</h4>
                                                    <div className="discount-input-wrapper">
                                                        <span>₹</span>
                                                        <input
                                                            type="number"
                                                            className="discount-input"
                                                            value={formData.discount}
                                                            onChange={e => handleFormChange('discount', e.target.value)}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="total-row grand-total-row">
                                                    <h3>Grand Total:</h3>
                                                    <span>₹{grandTotal}</span>
                                                </div>
                                            </div>

                                            {/* Actions remain at the bottom */}
                                            <div className="modal-actions">
                                                <button className="cancel" onClick={handleCloseModal}>Cancel</button>
                                                <button className="save" onClick={handleSave}>Save Invoice</button>
                                            </div>
                                        </div>

                                    </div>
                                    {/* items and totals same as purchase */}
                                </>
                            )}

                            {modalType === 'delete' && (
                                <>
                                    <h2>Confirm Deletion</h2>
                                    <p>Delete sale from <b>{currentSale?.party_name}</b> (Bill: {currentSale?.bill_no})?</p>
                                    <div className="modal-actions">
                                        <button onClick={handleCloseModal}>Cancel</button>
                                        <button onClick={handleDelete} className="delete-confirm">Delete</button>
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
