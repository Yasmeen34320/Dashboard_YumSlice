import React, { useState, useEffect } from 'react';

const EditOrAddProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [form, setForm] = useState(product || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({ name: '', price: '', stock: '', discountPercentage: '', category: '', imageUrl: '', description: '' });
    }
    setErrors({});
    setImageError(false);
  }, [product]);

  const isEdit = !!form._id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'imageUrl') setImageError(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Product name is required.';
    if (form.price === '' || Number(form.price) < 0) newErrors.price = 'Price must be at least 0.';
    if (form.stock === '' || Number(form.stock) < 0) newErrors.stock = 'Stock must be at least 0.';
    if (form.discountPercentage && (form.discountPercentage < 0 || form.discountPercentage > 100))
      newErrors.discountPercentage = 'Discount must be between 0 and 100.';
    if (!form.category) newErrors.category = 'Category is required.';
    if (!form.imageUrl?.trim()) newErrors.imageUrl = 'Image URL is required.';
    if (!form.description?.trim()) newErrors.description = 'Description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const preparedData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        discountPercentage: form.discountPercentage !== '' ? Number(form.discountPercentage) : 0,
      };

      await onSave(preparedData); 

      if (!isEdit) {
        setForm({
          name: '',
          price: '',
          stock: '',
          discountPercentage: '',
          category: '',
          imageUrl: '',
          description: '',
        });
        setErrors({});
        setImageError(false);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50">
       <div className="absolute inset-0 backdrop-blur-xs" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header with orange-950 background */}
        <div className="bg-orange-950 p-5 border-b border-orange-900">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-orange-200 hover:text-white transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (EGP) *</label>
              <input
                name="price"
                type="number"
                value={form.price || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
                min="0"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                name="stock"
                type="number"
                value={form.stock || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
                min="0"
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input
              name="discountPercentage"
              type="number"
              value={form.discountPercentage || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.discountPercentage ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
              min="0"
              max="100"
            />
            {errors.discountPercentage && <p className="mt-1 text-sm text-red-600">{errors.discountPercentage}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={form.category || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
            >
              <option value="">Select a category</option>
              <option value="Birthday">Birthday</option>
              <option value="Wedding">Wedding</option>
              <option value="Cheesecakes">Cheesecakes</option>
              <option value="Cupcakes">Cupcakes</option>
              <option value="Molten Cakes">Molten Cakes</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
            <input
              name="imageUrl"
              value={form.imageUrl || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.imageUrl || imageError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
            {imageError && <p className="mt-1 text-sm text-red-600">Invalid image URL or image could not load.</p>}
            {form.imageUrl && !imageError && (
              <div className="mt-2">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="max-h-40 object-contain border rounded"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              rows={3}
              value={form.description || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-orange-950 hover:bg-orange-900 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEdit ? 'Saving...' : 'Adding...'}
                </span>
              ) : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrAddProductModal;