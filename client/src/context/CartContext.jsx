import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ecomm_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  /**
   * Add a product to the cart with strict stock limit validation.
   * Returns an object { success: boolean, message: string }
   */
  const addToCart = (product, qtyToAdd = 1) => {
    if (!product || !product._id) {
      return { success: false, message: 'Invalid product' };
    }

    const availableStock = product.stock ?? 0;
    if (availableStock <= 0) {
      return { success: false, message: 'Sorry, this product is out of stock.' };
    }

    let message = 'Item added to cart';
    let success = true;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product._id === product._id);

      if (existingIndex > -1) {
        const existingItem = prevItems[existingIndex];
        const newTotalQty = existingItem.quantity + qtyToAdd;

        if (newTotalQty > availableStock) {
          message = `Only ${availableStock} units available in stock. Quantity adjusted.`;
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...existingItem,
            product, // update to latest product snapshot
            quantity: availableStock,
          };
          return updated;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existingItem,
          product,
          quantity: newTotalQty,
        };
        message = `Updated ${product.name} quantity to ${newTotalQty}.`;
        return updated;
      }

      // If not already in cart
      const initialQty = Math.min(qtyToAdd, availableStock);
      if (qtyToAdd > availableStock) {
        message = `Only ${availableStock} units available. Added ${initialQty} to cart.`;
      } else {
        message = `Added ${product.name} to cart.`;
      }

      return [...prevItems, { product, quantity: initialQty }];
    });

    return { success, message };
  };

  /**
   * Update quantity of a product in the cart.
   * Bounded strictly between 1 and available stock.
   */
  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return { success: true, message: 'Item removed from cart' };
    }

    let message = 'Quantity updated';
    let success = true;

    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product._id === productId) {
          const availableStock = item.product.stock ?? 0;
          if (newQty > availableStock) {
            message = `Cannot add more than available stock (${availableStock}).`;
            success = false;
            return { ...item, quantity: availableStock };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });

    return { success, message };
  };

  /**
   * Remove a single line item from the cart.
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
  };

  /**
   * Clear all items from the cart.
   */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('ecomm_cart');
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price || 0) * item.quantity, 0);
  const shippingFee = 0; // Free Cash on Delivery
  const totalPrice = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        shippingFee,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
