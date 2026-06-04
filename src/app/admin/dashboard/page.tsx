'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
}

interface Bouquet {
  id: number;
  name?: string;
  nameKey?: string;
  price: string;
  category: string;
  src: string;
  description?: string;
  isCustom?: boolean;
}

interface OrderItem {
  bouquetId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  payId: string;
  name: string;
  phone: string;
  district: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Created' | 'Processing' | 'Succeeded' | 'Failed' | 'Expired' | 'Pending';
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Tab switching state
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');

  // Bouquet catalogue state
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [loadingBouquets, setLoadingBouquets] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    description: '',
    category: 'Luxury',
    image: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Edit mode: null means creating, a number means editing that bouquet's id
  const [editingId, setEditingId] = useState<number | null>(null);

  // 1. Session check & fetch bouquets/orders
  useEffect(() => {
    const checkSession = async () => {
      const cookies = document.cookie.split(';');
      const adminSession = cookies.find((c) => c.trim().startsWith('admin_session='));
      if (!adminSession) {
        router.push('/admin');
      } else {
        setHasSession(true);
        setCheckingSession(false);
        fetchCatalog();
        fetchOrders();
      }
    };
    checkSession();
  }, [router]);

  const fetchCatalog = async () => {
    try {
      setLoadingBouquets(true);
      const res = await fetch('/api/bouquets');
      if (res.ok) {
        const data = await res.json();
        setBouquets(data);
      }
    } catch (err) {
      console.error('Failed to load bouquets:', err);
    } finally {
      setLoadingBouquets(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // 2. Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
        router.push('/admin');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // 3. Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError('');

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        setFormError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setFormError('An error occurred during file upload');
    } finally {
      setUploadingImage(false);
    }
  };

  // 4. Form Submit handler — POST (create) or PUT (update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setFormError('Bouquet name is required.');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setFormError('Please enter a valid price.');
      return;
    }
    if (!formData.image) {
      setFormError('Please upload an image for the bouquet.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isEditing = editingId !== null;
      const res = await fetch('/api/bouquets', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { ...formData, id: editingId } : formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(
          isEditing
            ? `"${formData.name}" has been successfully updated!`
            : `"${formData.name}" has been successfully added to the catalog!`
        );
        // Reset form and exit edit mode
        setFormData({ name: '', price: '', description: '', category: 'Luxury', image: '' });
        setEditingId(null);
        fetchCatalog();
      } else {
        setFormError(data.error || (isEditing ? 'Failed to update bouquet' : 'Failed to add bouquet'));
      }
    } catch (err) {
      setFormError('An error occurred while saving the bouquet.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Load a custom bouquet into the form for editing
  const handleEditBouquet = (b: Bouquet) => {
    // Strip the currency symbol so the price input only gets the numeric part
    const numericPrice = b.price.replace(/[^\d.]/g, '').trim();
    setFormData({
      name: b.name || '',
      price: numericPrice,
      description: b.description || '',
      category: b.category || 'Luxury',
      image: b.src,
    });
    setEditingId(b.id);
    setFormError('');
    setSuccessMessage('');
    // Scroll form into view on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 7. Cancel editing — revert to create mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', description: '', category: 'Luxury', image: '' });
    setFormError('');
    setSuccessMessage('');
  };

  // 5. Delete handler
  const handleDeleteBouquet = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/bouquets?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccessMessage(`Successfully deleted bouquet.`);
        fetchCatalog();
      } else {
        const data = await res.json();
        setFormError(data.error || 'Failed to delete bouquet.');
      }
    } catch (err) {
      setFormError('An error occurred while deleting the bouquet.');
      console.error(err);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#c8947a]/20 border-t-[#c8947a] rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-[#c8947a]">Verifying admin credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] text-[#1a1208] font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-[#ddd4c8] bg-white/70 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-display text-2xl font-bold tracking-wide text-[#1a1208] hover:text-[#c8947a] transition-colors">
            LILY ROSE
          </Link>
          <span className="text-xs bg-[#c8947a]/20 text-[#c8947a] px-2 py-0.5 rounded-full font-medium uppercase tracking-widest">
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            href="/flowers" 
            className="text-xs font-semibold text-[#1a1208] hover:text-[#c8947a] transition-colors uppercase tracking-widest hidden sm:inline-block"
          >
            View Shop Catalog
          </Link>
          
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors uppercase tracking-widest border border-rose-200 bg-rose-50 hover:bg-rose-100/50 px-3 py-1.5 rounded-xl"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        
        {/* Tab switch buttons */}
        <div className="flex gap-6 border-b border-[#ddd4c8] mb-8 pb-px">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 ${
              activeTab === 'catalog'
                ? 'border-[#c8947a] text-[#c8947a]'
                : 'border-transparent text-gray-400 hover:text-[#1a1208]'
            }`}
          >
            Bouquet Catalogue
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              fetchOrders();
            }}
            className={`pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 ${
              activeTab === 'orders'
                ? 'border-[#c8947a] text-[#c8947a]'
                : 'border-transparent text-gray-400 hover:text-[#1a1208]'
            }`}
          >
            Customer Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'catalog' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
        
        {/* Left Side: Creation Form (7 Columns on Large Screens) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1a1208]" style={{ fontFamily: "'MS Calibri', 'Georgian Mkhedruli BPG Mod', sans-serif" }}>
                {editingId !== null ? 'Edit Bouquet' : 'Bouquet Management'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {editingId !== null
                  ? 'Update the details for this bouquet listing.'
                  : 'Add a new crafted premium bouquet to the luxury catalog database.'}
              </p>
            </div>
            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1a1208] border border-[#ddd4c8] rounded-xl hover:bg-[#fdf8f3] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Edit
              </button>
            )}
          </div>

          {/* Success and Error notifications */}
          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-800 text-sm flex items-start gap-3 animate-fade-in">
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="font-semibold">Success!</span> {successMessage}
              </div>
            </div>
          )}

          {formError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-800 text-sm flex items-start gap-3 animate-fade-in">
              <svg className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <span className="font-semibold">Action required:</span> {formError}
              </div>
            </div>
          )}

          {/* Creation Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#ddd4c8] rounded-2xl p-6 shadow-sm flex flex-col gap-6"
          >
            {/* Bouquet Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[#1a1208] uppercase tracking-wider mb-2">
                Bouquet Title
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Royal Blush Peonies"
                disabled={uploadingImage || isSubmitting}
                className="w-full px-4 py-3 bg-[#fdf8f3] border border-[#ddd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8947a]/50 focus:border-[#c8947a] transition-all text-sm text-[#1a1208]"
              />
            </div>

            {/* Row: Category & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-xs font-semibold text-[#1a1208] uppercase tracking-wider mb-2">
                  Collection Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  disabled={uploadingImage || isSubmitting}
                  className="w-full px-4 py-3 bg-[#fdf8f3] border border-[#ddd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8947a]/50 focus:border-[#c8947a] transition-all text-sm text-[#1a1208] appearance-none cursor-pointer"
                >
                  <option value="Luxury">Luxury Signature</option>
                  <option value="Classic">Classic Bouquets</option>
                  <option value="Spring">Spring Collection</option>
                  <option value="Minimalist">Minimalist / Mono</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-xs font-semibold text-[#1a1208] uppercase tracking-wider mb-2">
                  Price (₾ GEL)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">₾</span>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="120.00"
                    disabled={uploadingImage || isSubmitting}
                    className="w-full pl-9 pr-4 py-3 bg-[#fdf8f3] border border-[#ddd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8947a]/50 focus:border-[#c8947a] transition-all text-sm text-[#1a1208]"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold text-[#1a1208] uppercase tracking-wider mb-2">
                Short Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the floral structure, wrapping, and details..."
                disabled={uploadingImage || isSubmitting}
                className="w-full px-4 py-3 bg-[#fdf8f3] border border-[#ddd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8947a]/50 focus:border-[#c8947a] transition-all text-sm text-[#1a1208] resize-none"
              />
            </div>

            {/* Image upload */}
            <div>
              <span className="block text-xs font-semibold text-[#1a1208] uppercase tracking-wider mb-2">
                Bouquet Portrait Image
              </span>

              {!formData.image ? (
                <div className={`relative border-2 border-dashed border-[#ddd4c8] hover:border-[#c8947a] rounded-xl p-8 transition-colors text-center bg-[#fdf8f3]/50 flex flex-col items-center justify-center cursor-pointer ${uploadingImage ? 'pointer-events-none opacity-60' : ''}`}>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#c8947a]/20 border-t-[#c8947a] rounded-full animate-spin"></div>
                      <p className="text-sm font-medium text-[#c8947a] animate-pulse">Uploading Image...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#ddd4c8] shadow-sm text-[#c8947a]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p className="font-semibold text-[#1a1208] text-sm">Click to select image file</p>
                        <p className="mt-1">WEBP, JPEG, PNG, GIF or SVG (max. 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative border border-[#ddd4c8] rounded-xl overflow-hidden bg-[#fdf8f3] p-3 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-[#ddd4c8]">
                    <img src={formData.image} alt="Uploaded Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Uploaded Path</p>
                    <p className="text-xs text-[#1a1208] font-mono truncate max-w-xs">{formData.image}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="w-8 h-8 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploadingImage || isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-4 text-white rounded-xl font-medium tracking-wide shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 ${
                editingId !== null
                  ? 'bg-[#c8947a] hover:bg-[#b07d64]'
                  : 'bg-[#1a1208] hover:bg-[#c8947a]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>{editingId !== null ? 'Updating...' : 'Saving to Catalog...'}</span>
                </>
              ) : editingId !== null ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Bouquet Listing</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Preview & Database Listing (5 Columns on Large Screens) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Live Preview */}
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-xl font-semibold tracking-tight text-[#1a1208]">
              Live Preview
            </h2>
            <div className="bg-white border border-[#ddd4c8] rounded-2xl overflow-hidden shadow-sm flex flex-col group">
              <div className="relative aspect-[4/5] bg-[#fdf8f3] overflow-hidden flex items-center justify-center border-b border-[#ddd4c8]">
                {formData.image ? (
                  <img src={formData.image} alt="Live Card Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 flex flex-col items-center gap-4 text-gray-400">
                    <div className="w-16 h-16 rounded-full bg-[#fdf8f3] border border-[#ddd4c8] flex items-center justify-center text-[#c8947a]">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-gray-600">Waiting for Image Upload</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#1a1208] text-white text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                    {formData.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-[#1a1208] text-lg font-medium truncate max-w-[150px]">
                    {formData.name || 'Lily Rose Bouquet'}
                  </h3>
                  <span className="font-display font-semibold text-[#1a1208] text-lg">
                    ₾ {formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Database Catalog List */}
          <div className="flex flex-col gap-4">
            <div className="border-t border-[#ddd4c8] pt-6">
              <h2 className="font-display text-xl font-semibold tracking-tight text-[#1a1208]">
                Catalog Database ({bouquets.length})
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Management list of currently registered bouquets.
              </p>
            </div>

            {loadingBouquets ? (
              <div className="py-8 text-center text-xs text-gray-400 animate-pulse">Loading catalog...</div>
            ) : bouquets.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-[#ddd4c8] rounded-2xl">
                No items in the catalog yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                {bouquets.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-white border border-[#ddd4c8] rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-150 flex-shrink-0 border border-[#ddd4c8]">
                        <img src={b.src} alt={b.name || 'Bouquet'} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1a1208] truncate">
                          {b.nameKey ? `Default (#${b.id})` : b.name}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{b.category} • {b.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.isCustom ? (
                        <>
                          <button
                            onClick={() => handleEditBouquet(b)}
                            className="px-2.5 py-1.5 text-[10px] font-bold text-[#c8947a] hover:bg-[#fdf8f3] border border-[#ddd4c8] rounded-lg transition-colors uppercase tracking-widest"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBouquet(b.id, b.name || '')}
                            className="px-2.5 py-1.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors uppercase tracking-widest"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-[9px] text-gray-400 bg-gray-100 px-2 py-1 rounded border border-gray-200 uppercase tracking-widest">
                          Static System
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
        ) : (
          <div className="bg-white border border-[#ddd4c8] rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#1a1208]">Customer Orders</h2>
                <p className="text-xs text-gray-500 mt-1">Review your shop's e-commerce orders and status updates.</p>
              </div>
              <button
                onClick={fetchOrders}
                className="px-3 py-1.5 text-xs font-semibold text-[#c8947a] hover:bg-[#fdf8f3] border border-[#ddd4c8] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18v3" />
                </svg>
                Refresh
              </button>
            </div>

            {loadingOrders ? (
              <div className="py-20 text-center text-sm text-gray-400 animate-pulse">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-400 border border-dashed border-[#ddd4c8] rounded-2xl">
                No orders placed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#ddd4c8] text-xs font-semibold text-gray-500 uppercase tracking-wider bg-[#fdf8f3]/50">
                      <th className="py-4 px-4">Order Date / ID</th>
                      <th className="py-4 px-4">Customer Details</th>
                      <th className="py-4 px-4">Delivery Address</th>
                      <th className="py-4 px-4">Purchased Items</th>
                      <th className="py-4 px-4 text-right">Total Price</th>
                      <th className="py-4 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ddd4c8]/60">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#fdf8f3]/25 transition-colors">
                        <td className="py-4 px-4 font-medium text-xs">
                          <div className="text-gray-500 mb-1">{new Date(order.createdAt).toLocaleString()}</div>
                          <div className="font-mono text-[10px] bg-[#fdf8f3] border border-[#ddd4c8] px-1.5 py-0.5 rounded inline-block max-w-[150px] truncate" title={order.id}>
                            {order.id}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-800">{order.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{order.phone}</div>
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <div className="font-medium text-gray-700">{order.district}</div>
                          <div className="text-gray-500 max-w-[180px] truncate" title={order.address}>{order.address}</div>
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx}>
                                <span className="font-bold text-[#c8947a]">{item.quantity}x</span> {item.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold font-roboto text-accent">
                          ₾ {order.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Succeeded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Pending' || order.status === 'Processing'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
