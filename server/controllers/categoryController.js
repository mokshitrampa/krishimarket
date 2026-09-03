const Category = require('../models/Category');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true }).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Protected (Admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Category created.',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Protected (Admin)
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, active } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (active !== undefined) category.active = !!active;

    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated.',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Protected (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};