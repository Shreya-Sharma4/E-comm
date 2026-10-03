const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with category filter & search
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    // 1. Category Filter: by ObjectId or Name
    if (category && category !== 'All') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        const foundCat = await Category.findOne({
          name: { $regex: new RegExp(`^${category.trim()}$`, 'i') },
        });
        if (foundCat) {
          filter.category = foundCat._id;
        } else {
          return res.status(200).json({ success: true, count: 0, data: [] });
        }
      }
    }

    // 2. Keyword Search: in name or description
    if (search && search.trim()) {
      const query = search.trim();
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name description');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin Only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || !image || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, image, and category',
      });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product price must be a positive number greater than 0',
      });
    }

    const numStock = stock !== undefined ? Number(stock) : 0;
    if (isNaN(numStock) || numStock < 0 || !Number.isInteger(numStock)) {
      return res.status(400).json({
        success: false,
        message: 'Stock must be a non-negative integer',
      });
    }

    // Verify category exists by ObjectId, object, or category name
    let categoryDoc;
    if (typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
      categoryDoc = await Category.findById(category);
    } else if (typeof category === 'object' && category?._id) {
      categoryDoc = await Category.findById(category._id);
    } else {
      const catSearchName = typeof category === 'object' ? category?.name : category;
      if (catSearchName && typeof catSearchName === 'string') {
        categoryDoc = await Category.findOne({
          name: { $regex: new RegExp(`^${catSearchName.trim()}$`, 'i') },
        });
      }
    }

    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category: specified category does not exist in the database',
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: numPrice,
      image: image.trim(),
      category: categoryDoc._id,
      stock: numStock,
    });

    const populated = await product.populate('category', 'name description');

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin Only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (name) product.name = name.trim();
    if (description) product.description = description.trim();
    if (image) product.image = image.trim();

    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number',
        });
      }
      product.price = numPrice;
    }

    if (stock !== undefined) {
      const numStock = Number(stock);
      if (isNaN(numStock) || numStock < 0 || !Number.isInteger(numStock)) {
        return res.status(400).json({
          success: false,
          message: 'Stock must be a non-negative integer',
        });
      }
      product.stock = numStock;
    }

    if (category) {
      let catExists;
      if (typeof category === 'string' && category.match(/^[0-9a-fA-F]{24}$/)) {
        catExists = await Category.findById(category);
      } else if (typeof category === 'object' && category?._id) {
        catExists = await Category.findById(category._id);
      } else {
        const catSearchName = typeof category === 'object' ? category?.name : category;
        if (catSearchName && typeof catSearchName === 'string') {
          catExists = await Category.findOne({
            name: { $regex: new RegExp(`^${catSearchName.trim()}$`, 'i') },
          });
        }
      }

      if (!catExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category: category does not exist in database',
        });
      }
      product.category = catExists._id;
    }

    const updated = await product.save();
    const populated = await updated.populate('category', 'name description');

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};
