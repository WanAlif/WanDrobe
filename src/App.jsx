import React, { useState, createContext, useContext } from 'react';
import { ShoppingCart, User, Search, Star, Plus, Minus, X, Check, Eye, Edit, Trash2, BarChart3, Package, Users, DollarSign } from 'lucide-react';

// ==================== CONTEXT & STATE MANAGEMENT ====================
const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// ==================== INITIAL DATA ====================
const initialProducts = [
  {
    id: 1,
    name: "Elegant Lace Telekung",
    price: 89.99,
    image: <img src="jpeg/elegantlacetelekung.jpg" alt="Elegant Lace Telekung" />,
    category: "telekung",
    description: "Beautiful lace-detailed telekung perfect for daily prayers. Made from premium cotton blend.",
    stock: 15,
    rating: 4.8,
    reviews: 24
  },
  {
    id: 2,
    name: "Classic White Telekung",
    price: 65.99,
    image: <img src="jpeg/classicwhitetelekung.jpg" alt="Classic White Telekung" />,
    category: "telekung",
    description: "Simple and elegant white telekung with comfortable fit. Perfect for beginners.",
    stock: 22,
    rating: 4.6,
    reviews: 18
  },
  {
    id: 3,
    name: "Premium Silk Telekung",
    price: 149.99,
    image: <img src="jpeg/premiumsilktelekung.jpg" alt="Premium Silk Telekung" />,
    category: "telekung",
    description: "Luxurious silk telekung with intricate embroidery. Premium quality for special occasions.",
    stock: 8,
    rating: 4.9,
    reviews: 31
  }
];

// ==================== MAIN APP COMPONENT ====================
const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Auth functions
  const login = (email, password) => {
    if (email === 'admin@wandrobe.com' && password === 'admin123') {
      setUser({ id: 1, email, name: 'Admin User', isAdmin: true });
      setIsAdmin(true);
      return true;
    } else if (email && password) {
      setUser({ id: 2, email, name: 'Customer', isAdmin: false });
      setIsAdmin(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentView('home');
  };

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order functions
  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      date: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [...prev, newOrder]);
    clearCart();
    return newOrder;
  };

  // Product management
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      rating: 0,
      reviews: 0
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  // Recommendations
  const getRecommendations = (currentProduct) => {
    return products
      .filter(p => p.id !== currentProduct.id)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);
  };

  const value = {
    products,
    cart,
    user,
    orders,
    currentView,
    searchTerm,
    isAdmin,
    setCurrentView,
    setSearchTerm,
    login,
    logout,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    getRecommendations
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ==================== HEADER COMPONENT ====================
const Header = () => {
  const { cart, user, currentView, setCurrentView, searchTerm, setSearchTerm, logout } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 
              className="text-2xl font-bold text-black-600 cursor-pointer"
              onClick={() => setCurrentView('home')}
            >
              WanDrobe.
            </h1>
            <div className="hidden md:flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'home' ? 'bg-gray-100 text-black-700' : 'text-blaack-600 hover:text-gray-600'
                }`}
                onClick={() => setCurrentView('home')}
              >
                Home
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'products' ? 'bg-gray-100 text-black-700' : 'text-black-600 hover:text-gray-600'
                }`}
                onClick={() => setCurrentView('products')}
              >
                Products
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="relative p-2 text-gray-600 hover:text-black-600"
              onClick={() => setCurrentView('cart')}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-gray-600 hover:text-gray-600"
                  onClick={() => setCurrentView('profile')}
                >
                  <User className="w-6 h-6" />
                </button>
                <span className="text-sm text-gray-600">Hi, {user.name}</span>
                <button
                  className="text-sm text-red-600 hover:text-red-800"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-black-700"
                onClick={() => setCurrentView('login')}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ==================== PRODUCT CARD COMPONENT ====================
const ProductCard = ({ product, onAddToCart, showAdmin = false }) => {
  const { updateProduct, deleteProduct } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...product });

  const handleEdit = () => {
    updateProduct(product.id, editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(product.id);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          placeholder="Product name"
        />
        <input
          type="number"
          value={editData.price}
          onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
          className="w-full p-2 border rounded mb-2"
          placeholder="Price"
        />
        <input
          type="number"
          value={editData.stock}
          onChange={(e) => setEditData({ ...editData, stock: parseInt(e.target.value) })}
          className="w-full p-2 border rounded mb-2"
          placeholder="Stock"
        />
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          placeholder="Description"
        />
        <div className="flex space-x-2">
          <button onClick={handleEdit} className="bg-green-600 text-white px-3 py-1 rounded">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-600 text-white px-3 py-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
          </div>
          <span className="ml-auto text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-black-600">RM {product.price.toFixed(2)}</span>
          {showAdmin ? (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== VIEWS ====================
const HomeView = () => {
  const { products, addToCart } = useApp();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black-600 to-gray-900 text-black py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to WanDrobe.</h1>
          <p className="text-xl md:text-2xl mb-8">Discover Beautiful Telekung Collections</p>
          <button className="bg-white text-black-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop Now!
          </button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductsView = () => {
  const { products, addToCart, searchTerm, getRecommendations } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedProduct) {
    const recommendations = getRecommendations(selectedProduct);
    
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedProduct(null)}
          className="mb-6 text-black-600 hover:text-gray-800"
        >
          ← Back to Products
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black-800">{selectedProduct.name}</h1>
              <div className="flex items-center mt-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-black-600">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-black-600">
              RM {selectedProduct.price.toFixed(2)}
            </div>
            
            <p className="text-black-600">{selectedProduct.description}</p>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-black-500">Stock: {selectedProduct.stock}</span>
              <button
                onClick={() => addToCart(selectedProduct)}
                className="bg-black-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                disabled={selectedProduct.stock === 0}
              >
                {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
        
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
              <ProductCard
                product={product}
                onAddToCart={addToCart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CartView = () => {
  const { cart, updateCartQuantity, removeFromCart, user, setCurrentView } = useApp();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!user) {
      setCurrentView('login');
      return;
    }
    setCurrentView('checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => setCurrentView('products')}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-black-600">RM {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  className="p-1 rounded border hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 border rounded">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded border hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold">RM {(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total: RM {total.toFixed(2)}</span>
          <button
            onClick={handleCheckout}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutView = () => {
  const { cart, createOrder, setCurrentView } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'credit_card'
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      items: cart,
      total,
      shipping: formData,
      paymentMethod: formData.paymentMethod
    };
    
    createOrder(orderData);
    alert('Order placed successfully!');
    setCurrentView('profile');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 h-24"
              required
            />
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="online_banking">Online Banking</option>
            </select>
            <button
              type="submit"
              className="w-full bg-black-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Place Order
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>RM {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>RM {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginView = () => {
  const { login, setCurrentView } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(formData.email, formData.password)) {
      setCurrentView('home');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo credentials:</p>
          <p>Admin: admin@wandrobe.com / admin123</p>
          <p>Customer: any email / any password</p>
        </div>
      </div>
    </div>
  );
};

const ProfileView = () => {
  const { user, orders, isAdmin, setCurrentView } = useApp();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Account Type:</strong> {isAdmin ? 'Admin' : 'Customer'}</p>
        {isAdmin && (
          <button
            onClick={() => setCurrentView('admin')}
            className="mt-4 bg-black-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Go to Admin Dashboard
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">RM {order.total.toFixed(2)}</p>
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {order.items.map(item => (
                    <div key={item.id}>
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminView = () => {
  const { products, orders, addProduct, isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
    category: 'telekung'
  });

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.description) {
      addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 0,
        image: newProduct.image || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
      });
      setNewProduct({
        name: '',
        price: '',
        description: '',
        image: '',
        stock: '',
        category: 'telekung'
      });
      alert('Product added successfully!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'dashboard' ? 'bg-black-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'products' ? 'bg-black-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'orders' ? 'bg-black-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('add-product')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'add-product' ? 'bg-black-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Add Product
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">RM {totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-blue-600">{totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-black-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-black-600">{totalOrders}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                showAdmin={true}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Management</h2>
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Customer: {order.shipping.name}</p>
                      <p className="text-sm text-gray-600">Email: {order.shipping.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">RM {order.total.toFixed(2)}</p>
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Items:</p>
                    {order.items.map(item => (
                      <div key={item.id} className="ml-4">
                        {item.name} x {item.quantity} - RM {(item.price * item.quantity).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'add-product' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <textarea
              placeholder="Product Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 h-24"
              required
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="telekung">Telekung</option>
              <option value="accessories">Accessories</option>
            </select>
            <button
              type="submit"
              className="w-full bg-black-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Add Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN APP ====================
const App = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'products':
        return <ProductsView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'login':
        return <LoginView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {renderView()}
      </main>
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 WanDrobe. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Beautiful Telekung Collections for Every Occasion</p>
        </div>
      </footer>
    </div>
  );
};

export default function WanDrobe() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}