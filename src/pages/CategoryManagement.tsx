import React, { useState, useEffect } from 'react';
import { categories, addCategory, deleteCategory, mockExpenses, loadInitialData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Tag, Plus, Trash2, AlertCircle } from 'lucide-react';
import { setupStorageSync } from '../utils/dataSync';

const CategoryManagement: React.FC = () => {
  const { user } = useAuth();
  const [categoryList, setCategoryList] = useState<string[]>(categories);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load initial data from API
    loadInitialData().then(() => {
      setCategoryList([...categories]);
    });

    // Setup sync to detect changes from other devices
    const cleanup = setupStorageSync(() => {
      setCategoryList([...categories]);
    });
    return cleanup;
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    if (categoryList.includes(newCategory.trim())) {
      setError('This category already exists');
      return;
    }

    try {
      const added = await addCategory(newCategory.trim());
      if (added) {
        setCategoryList([...categories]);
        setNewCategory('');
        setSuccess(`Category "${newCategory.trim()}" added successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to add category');
      }
    } catch (error) {
      setError('Error adding category. Please try again.');
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    setError('');
    setSuccess('');

    // Check if category is used in expenses
    const isUsed = mockExpenses.some(expense => expense.category === categoryName);
    if (isUsed) {
      const expenseCount = mockExpenses.filter(expense => expense.category === categoryName).length;
      setError(`Cannot delete "${categoryName}" - it's used in ${expenseCount} expense${expenseCount !== 1 ? 's' : ''}`);
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      try {
        const deleted = await deleteCategory(categoryName);
        if (deleted) {
          setCategoryList([...categories]);
          setSuccess(`Category "${categoryName}" deleted successfully!`);
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to delete category');
        }
      } catch (error) {
        setError('Error deleting category. Please try again.');
        console.error('Error deleting category:', error);
      }
    }
  };

  const getCategoryUsageCount = (categoryName: string) => {
    return mockExpenses.filter(expense => expense.category === categoryName).length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-6 h-6" />
          Category Management
        </h2>
        <p className="text-gray-600 mt-1">Add and manage expense categories</p>
      </div>

      {/* Add Category Form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Category
        </h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleAddCategory} className="flex gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              setError('');
            }}
            placeholder="Enter category name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Existing Categories ({categoryList.length})
        </h3>

        {categoryList.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No categories yet. Add your first category above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryList.map((category) => {
              const usageCount = getCategoryUsageCount(category);
              const isUsed = usageCount > 0;

              return (
                <div
                  key={category}
                  className={`p-4 rounded-lg border ${
                    isUsed
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        {category}
                      </h4>
                      {isUsed && (
                        <p className="text-xs text-yellow-700 mt-1">
                          Used in {usageCount} expense{usageCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      disabled={isUsed}
                      className={`p-2 rounded-lg transition-colors ${
                        isUsed
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      title={isUsed ? 'Cannot delete: category is in use' : 'Delete category'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Note:</p>
            <p>Categories that are used in existing expenses cannot be deleted. You must first remove or change the category from those expenses.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;

