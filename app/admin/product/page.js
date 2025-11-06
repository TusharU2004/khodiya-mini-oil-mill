'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Package, Plus, Edit, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import DashboardLayout from '../dashboard/layout'; // Make sure this path is correct
import './products.css';

const ITEMS_PER_PAGE = 5; // You can adjust how many items to show per page

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productName, setProductName] = useState('');
    const [error, setError] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // --- New State for Search and Pagination ---
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Toast handler
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    // ✅ Fetch products
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            showToast('Failed to fetch products', 'error');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --- Memoized Filtering and Pagination Logic ---
    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

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

    // --- Modal and CRUD Handlers (Unchanged) ---
    const handleOpenModal = (type, product = null) => {
        setModalType(type);
        setCurrentProduct(product);
        setIsModalOpen(true);
        setProductName(product ? product.name : '');
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        if (!productName.trim()) {
            setError('Product name cannot be empty!');
            return;
        }
        setError('');
        try {
            const response = await fetch('/api/products', {
                method: modalType === 'add' ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(modalType === 'add' ? { name: productName } : { id: currentProduct.id, name: productName }),
            });
            if (!response.ok) throw new Error('Failed to save product');
            await fetchProducts();
            handleCloseModal();
            showToast(modalType === 'add' ? 'Product added successfully!' : 'Product updated successfully!');
        } catch (err) {
            showToast('Failed to save product', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentProduct.id }),
            });
            if (!response.ok) throw new Error('Failed to delete product');
            await fetchProducts();
            handleCloseModal();
            showToast('Product deleted successfully!');
        } catch (err) {
            showToast('Failed to delete product', 'error');
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
                    <h1>Manage Products</h1>
                    {/* --- Search Box --- */}
                    <div className="header-actions">
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                    </div>
                    <button className="add-button" onClick={() => handleOpenModal('add')}>
                        <Plus size={18} />
                        Add Product
                    </button>
                </header>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Name</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.length > 0 ? (
                                paginatedProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        {/* --- Serial Number Calculation --- */}
                                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                        <td>
                                            <div className="product-name">
                                                <Package size={20} />
                                                <span>{product.name}</span>
                                            </div>
                                        </td>
                                        <td>{formatDate(product.created_at)}</td>
                                        <td>{formatDate(product.updated_at)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => handleOpenModal('edit', product)} title="Edit"><Edit size={16} /></button>
                                                <button onClick={() => handleOpenModal('delete', product)} title="Delete" className="delete"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        No products found.
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
                                    <h2>{modalType === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
                                    <div className="form-group">
                                        <label htmlFor="productName">Product Name</label>
                                        <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Groundnut Oil" />
                                        {error && <p className="error-message">{error}</p>}
                                    </div>
                                    <div className="modal-actions">
                                        <button onClick={handleCloseModal} className="cancel">Cancel</button>
                                        <button onClick={handleSave} className="save">Save Changes</button>
                                    </div>
                                </>
                            )}
                            {modalType === 'delete' && (
                                <>
                                    <h2>Confirm Deletion</h2>
                                    <p>Are you sure you want to delete: <strong>"{currentProduct.name}"</strong>?</p>
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

                {/* --- Toast Notification (Unchanged) --- */}
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