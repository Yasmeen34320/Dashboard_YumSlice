import React, { useState, useEffect } from 'react';

const EditOrAddPromoModal = ({ isOpen, onClose, onSave, promo }) => {
  const [form, setForm] = useState({
    code: '',
    discountPercentage: '',
    validUntil: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (promo) {
        setForm({
          ...promo,
          validUntil: promo.validUntil?.slice(0, 10),
          isActive: promo.isActive ?? true,
        });
      } else {
        // Reset form when adding new promo
        setForm({
          code: '',
          discountPercentage: '',
          validUntil: '',
          isActive: true,
        });
      }
      setErrors({});
    }
  }, [isOpen, promo]); // Added isOpen to dependency array

  const validate = () => {
    const errs = {};
    if (!form.code.trim()) errs.code = 'Code is required.';
    if (!form.discountPercentage) errs.discountPercentage = 'Discount is required.';
    else if (form.discountPercentage < 1 || form.discountPercentage > 100)
      errs.discountPercentage = 'Must be between 1 and 100.';
    if (!form.validUntil) errs.validUntil = 'Expiration date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        ...form,
        discountPercentage: Number(form.discountPercentage),
        validUntil: new Date(form.validUntil),
        _id: promo?._id,
      });
      // Don't reset form here - let the parent component handle the close
    } catch (error) {
      console.error('Error saving promo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50">
      <div className="absolute inset-0 backdrop-blur-xs" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-orange-950 p-5 border-b border-orange-900">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {promo ? 'Edit Promo Code' : 'Add New Promo Code'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-orange-200 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              className={`w-full px-3 py-2 border ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
            />
            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%) *</label>
            <input
              type="number"
              name="discountPercentage"
              value={form.discountPercentage}
              onChange={(e) => setForm((f) => ({ ...f, discountPercentage: e.target.value }))}
              className={`w-full px-3 py-2 border ${
                errors.discountPercentage ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
              min="1"
              max="100"
            />
            {errors.discountPercentage && (
              <p className="mt-1 text-sm text-red-600">{errors.discountPercentage}</p>
            )}
          </div>

          {/* Valid Until */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until *</label>
            <input
              type="date"
              name="validUntil"
              value={form.validUntil}
              onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
              className={`w-full px-3 py-2 border ${
                errors.validUntil ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-2 focus:ring-orange-950 focus:border-orange-950 transition-colors`}
            />
            {errors.validUntil && <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>}
          </div>

          {/* Active Switch */}
          {/* <div className="flex items-center gap-3 pt-1">
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-950 transition-all duration-300" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-full transition duration-300" />
            </label>
          </div> */}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-orange-950 hover:bg-orange-900 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {promo ? 'Saving...' : 'Adding...'}
                </span>
              ) : promo ? 'Save Changes' : 'Add Promo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrAddPromoModal;