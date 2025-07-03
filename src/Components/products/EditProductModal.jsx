import React, { useState, useEffect } from 'react';

const EditProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [form, setForm] = useState(product || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (product) {
      setForm(product);
      setErrors({});
      setImageError(false);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'imageUrl') setImageError(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Product name is required.';
    if (!form.price || Number(form.price) < 0) newErrors.price = 'Price must be at least 0.';
    if (!form.stock || Number(form.stock) < 0) newErrors.stock = 'Stock must be at least 0.';
    if (form.discountPercentage && (form.discountPercentage < 0 || form.discountPercentage > 100))
      newErrors.discountPercentage = 'Discount must be between 0 and 100.';
    if (!form.category) newErrors.category = 'Category is required.';
    if (!form.imageUrl?.trim()) newErrors.imageUrl = 'Image URL is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSave(form);
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
        <div className="bg-gray-50 p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Product
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
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
                  className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  min="0"
                  step="0.01"
                />
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  min="0"
                />
                {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
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
                className={`w-full px-3 py-2 border ${errors.discountPercentage ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                min="0"
                max="100"
              />
              {errors.discountPercentage && <p className="text-sm text-red-500 mt-1">{errors.discountPercentage}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={form.category || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              >
                <option value="">Select a category</option>
                <option value="Birthday">Birthday</option>
                <option value="Wedding">Wedding</option>
                <option value="Cheesecakes">Cheesecakes</option>
                <option value="Cupcakes">Cupcakes</option>
                <option value="Molten Cakes">Molten Cakes</option>
              </select>
              {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
            </div>

            {/* Image URL & Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input
                name="imageUrl"
                value={form.imageUrl || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                placeholder="Enter image URL"
              />
              {errors.imageUrl && <p className="text-sm text-red-500 mt-1">{errors.imageUrl}</p>}
              {imageError && <p className="text-sm text-red-500 mt-1">Invalid image URL or image could not be loaded.</p>}
              {form.imageUrl && !imageError && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                  <div className="border rounded-md p-1 bg-gray-50 flex justify-center">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="max-h-40 object-contain rounded-md"
                      onError={() => setImageError(true)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center justify-center min-w-24 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
