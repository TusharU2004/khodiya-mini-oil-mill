'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Package, Plus, Edit, Trash2, CheckCircle, XCircle, Search, PlusCircle } from 'lucide-react';
import DashboardLayout from '../dashboard/layout'; // Make sure this path is correct
import './purchases.css';

const ITEMS_PER_PAGE = 5; // You can adjust how many items to show per page

const getNewFormState = () => ({
    partyName: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    billNo: 'Fetching...',
    voucherNo: '',
    paymentType: 'credit',
    remarks: '',
    items: [{ product_id: '', quantity: 1, rate: 0, packing: '' }], // Always starts with one clean item
    discount: 0,
});



export default function PurchasesPage() {
    const [purchases, setPurchases] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [currentPurchase, setCurrentPurchase] = useState(null);
    const [formData, setFormData] = useState(getNewFormState()); // <-- Use the function here
    const [productName, setProductName] = useState('');
    const [errors, setErrors] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // --- New State for Search and Pagination ---
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Toast handler
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    // ✅ Fetch purchase 
    const fetchPurchases = async () => {
        try {
            const res = await fetch('/api/purchases');
            if (!res.ok) throw new Error('Failed to fetch purchases');
            const data = await res.json();
            setPurchases(data);
        } catch (err) {
            showToast('Failed to fetch purchases', 'error');
        }
    };

    // ✅ Fetch products for the dropdown with error handling
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setAvailableProducts(data);
        } catch (err) {
            showToast('Failed to load products for dropdown.', 'error');
        }
    };

    useEffect(() => {
        fetchPurchases();
        fetchProducts();
    }, []);


    // --- Memoized Filtering and Pagination Logic ---
    const filteredPurchases = useMemo(() => {
        if (!searchTerm) return purchases;
        return purchases.filter(p =>
            p.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.bill_no.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [purchases, searchTerm]);


    const paginatedPurchases = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPurchases.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPurchases, currentPage]);

    const totalPages = Math.ceil(filteredPurchases.length / ITEMS_PER_PAGE);

    // --- Handlers for Search and Pagination ---
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    // --- Modal Handlers ---
    const handleOpenModal = async (type, purchase = null) => {
        setModalType(type);
        setCurrentPurchase(purchase);
        setErrors({}); // Reset errors on modal open
        setIsModalOpen(true); // Open the modal immediately to show loading state


        if (type === 'add') {
            try {
                // Set a placeholder while the real number is fetched
                setFormData({ ...getNewFormState(), billNo: 'Generating...' });

                const res = await fetch('/api/purchases/next-bill-number');
                if (!res.ok) throw new Error('Could not generate bill number.');

                const data = await res.json(); // Expects something like { billNo: "KOMI/25-26/0042" }

                // Update the form with the real bill number from the server
                setFormData(prev => ({ ...prev, billNo: data.billNo }));

            } catch (err) {
                showToast(err.message, 'error');
                handleCloseModal(); // Close the modal if the API call fails
            }
        } else if (type === 'edit' && purchase) {
            try {
                const res = await fetch(`/api/purchases/${purchase.id}`);
                if (!res.ok) throw new Error('Could not fetch purchase details');
                const data = await res.json();
                setFormData({
                    partyName: data.party_name,
                    purchaseDate: new Date(data.purchase_date).toISOString().split('T')[0],
                    billNo: data.bill_no,
                    voucherNo: data.voucher_no,
                    paymentType: data.payment_type,
                    remarks: data.remarks,
                    items: data.items.map(item => ({ ...item, product_id: item.product_id.toString() }))
                });
            } catch (err) {
                showToast(err.message, 'error');
                return; // Don't open modal if data fetch fails
            }
        }
        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPurchase(null);
        setModalType(null);
        setFormData(getNewFormState()); // <-- Use the function here
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

    // --- Form-specific Handlers ---
    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItemRow = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { product_id: '', quantity: 1, rate: 0, packing: '' }]
        }));
    };

    const removeItemRow = (index) => {
        if (formData.items.length <= 1) {
            showToast('A purchase must have at least one item.', 'error');
            return;
        }
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };
    // Calculate the sum of all items before discount
    const subtotal = useMemo(() =>
        formData.items.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0)
        , [formData.items]);

    // Calculate the final total after applying the discount
    const grandTotal = useMemo(() => {
        const discountAmount = Number(formData.discount) || 0;
        return (subtotal - discountAmount).toFixed(2);
    }, [subtotal, formData.discount]);


    // --- Form Validation ---
    const validateForm = () => {
        const tempErrors = {};
        if (!formData.partyName.trim()) tempErrors.partyName = 'Party Name is required';
        if (!formData.billNo.trim()) tempErrors.billNo = 'Bill No is required';

        formData.items.forEach((item, idx) => {
            if (!item.product_id) tempErrors[`product_${idx}`] = 'Select a product';
            if (!item.quantity || Number(item.quantity) <= 0) tempErrors[`quantity_${idx}`] = 'Qty must be > 0';
        });

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return; // Stop the function if validation fails.
        }

        const method = modalType === 'add' ? 'POST' : 'PUT';
        const endpoint = modalType === 'add' ? '/api/purchases' : `/api/purchases/${currentPurchase.id}`;

        // Step 2: Send the correct formData, not productName.
        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // Use the main form data
        });
        try {
            if (!response.ok) {
                // Try to get a more specific error from the API if possible
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save the purchase.');
            }

            // Step 3: Refresh the purchases list, not the products list.
            await fetchPurchases();
            handleCloseModal();
            showToast(
                modalType === 'add' ? 'Purchase added successfully!' : 'Purchase updated successfully!'
            );

        } catch (err) {
            showToast(err.message || 'An unexpected error occurred.', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/purchases/${currentPurchase.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete purchase');
            await fetchPurchases();
            handleCloseModal();
            showToast('Purchase deleted successfully!');
        } catch (err) {
            showToast('Failed to delete purchase', 'error');
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
                    <h1>Manage Purchases Invoice</h1>
                    {/* --- Search Box --- */}
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
                        <Plus size={18} />
                        Add Invoice
                    </button>
                </header>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Bill No.</th>
                                <th>Party Name</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Total Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPurchases.length > 0 ? (
                                paginatedPurchases.map((p, i) => (
                                    <tr key={p.id}>
                                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                                        <td>{p.bill_no}</td>
                                        <td>{p.party_name}</td>
                                        <td>{new Date(p.purchase_date).toLocaleDateString('en-IN')}</td>
                                        <td><span className={`status-badge status-${p.payment_type}`}>{p.payment_type}</span></td>
                                        <td>₹{Number(p.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => handleOpenModal('edit', p)} title="Edit"><Edit size={16} /></button>
                                                <button onClick={() => handleOpenModal('delete', p)} className="delete" title="Delete"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                        No purchases found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination Controls --- */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                )}

                {/* --- Modal (Unchanged) --- */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            {(modalType === 'add' || modalType === 'edit') && (
                                <>
                                    <h2>{modalType === 'add' ? 'New Purchase' : 'Edit Purchase'}</h2>
                                    <div className="modal-body">
                                        <div className="purchase-form-container">
                                            {/* Form Header */}
                                            <div className="form-header-grid">
                                                <div className="form-group">
                                                    <label>Party Name</label>
                                                    <input
                                                        value={formData.partyName}
                                                        onChange={e => handleFormChange('partyName', e.target.value)}
                                                        className={errors.partyName ? 'input-error' : ''}
                                                    />
                                                    {errors.partyName && <span className="error-text">{errors.partyName}</span>}
                                                </div>
                                                <div className="form-group"><label>Date</label><input type="date" value={formData.purchaseDate} onChange={e => handleFormChange('purchaseDate', e.target.value)} /></div>
                                                <div className="form-group">
                                                    <label>Bill No.</label>
                                                    <input
                                                        value={formData.billNo}
                                                        onChange={e => handleFormChange('billNo', e.target.value)}
                                                        className={errors.billNo ? 'input-error' : ''}
                                                    />
                                                    {errors.billNo && <span className="error-text">{errors.billNo}</span>}
                                                </div>                                                <div className="form-group"><label>Voucher No.</label><input value={formData.voucherNo} onChange={e => handleFormChange('voucherNo', e.target.value)} /></div>
                                                <div className="form-group"><label>Payment</label><select value={formData.paymentType} onChange={e => handleFormChange('paymentType', e.target.value)}><option value="credit">Credit</option><option value="cash">Cash</option></select></div>
                                                <div className="form-group full-width"><label>Remarks</label><input value={formData.remarks} onChange={e => handleFormChange('remarks', e.target.value)} /></div>
                                            </div>
                                            {/* Items Table */}
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
                                                                    {errors[`product_${idx}`] && <span className="error-text">{errors[`product_${idx}`]}</span>}
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
                                                <button className="save" onClick={handleSave}>Save Purchase</button>
                                            </div>
                                        </div>

                                    </div>
                                </>
                            )}
                            {modalType === 'delete' && (
                                <>
                                    <h2>Confirm Deletion</h2>
                                    <p>Are you sure you want to delete the purchase from <strong>"{currentPurchase?.party_name}"</strong> (Bill: {currentPurchase?.bill_no})?</p>
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

                {/* ✅ Consistent Toast Notification */}
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