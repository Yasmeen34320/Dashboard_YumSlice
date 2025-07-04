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
        <div className="bg-gray-50 p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price *</label>
              <input
                name="price"
                type="number"
                value={form.price || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                min="0"
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock *</label>
              <input
                name="stock"
                type="number"
                value={form.stock || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                min="0"
              />
              {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
            <input
              name="discountPercentage"
              type="number"
              value={form.discountPercentage || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.discountPercentage ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              min="0"
              max="100"
            />
            {errors.discountPercentage && <p className="text-sm text-red-500">{errors.discountPercentage}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category *</label>
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
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL *</label>
            <input
              name="imageUrl"
              value={form.imageUrl || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.imageUrl || imageError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
            {imageError && <p className="text-sm text-red-500">Invalid image URL or image could not load.</p>}
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
        <label className="block text-sm font-medium text-gray-700">Description *</label>
        <textarea
          name="description"
          rows={3}
          value={form.description || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrAddProductModal;
