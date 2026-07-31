-- ============================================
-- Meharbaan Indian Cuisine - Database Schema & Seed Data
-- Generated: 2026-07-31T10:04:42.698Z
-- ============================================

-- 1. Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id VARCHAR(128) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Menu Products
CREATE TABLE IF NOT EXISTS menu_products (
  id VARCHAR(191) PRIMARY KEY,
  category_id VARCHAR(128) NOT NULL,
  name VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image VARCHAR(500) NOT NULL DEFAULT '/butter-chicken.webp',
  size_options JSON NOT NULL,
  spice_options JSON NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX menu_products_category_idx (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. App Settings
CREATE TABLE IF NOT EXISTS app_settings (
  setting_key VARCHAR(80) PRIMARY KEY,
  setting_value JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Delivery Settings
CREATE TABLE IF NOT EXISTS delivery_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  suburbs JSON NOT NULL,
  time_slots JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Orders
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(80) PRIMARY KEY,
  mode ENUM('delivery', 'pickup') NOT NULL,
  customer_name VARCHAR(180) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  address VARCHAR(255) NOT NULL DEFAULT '',
  zipcode VARCHAR(20) NOT NULL DEFAULT '',
  suburb VARCHAR(120),
  delivery_time VARCHAR(40),
  notes TEXT,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  order_snapshot JSON,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SEED DATA
-- ============================================

-- Clear existing data
DELETE FROM menu_products;
DELETE FROM menu_categories;

-- Insert Categories
INSERT INTO menu_categories (id, name, sort_order) VALUES ('entree', 'Entree', 1);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('mains-lamb', 'Mains Lamb', 2);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('mains-chicken', 'Mains Chicken', 3);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('naturally-vegan', 'Naturally Vegan', 4);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('mains-goat', 'Mains Goat', 5);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('mains-vegetarian', 'Mains - Vegetarian', 6);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('momo', 'Momo', 7);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('pasta', 'Pasta', 8);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('soups', 'Soups', 9);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('meharbaan-specials', 'Meharbaan Specials', 10);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('indo-chinese-dishes', 'Indo-Chinese Dishes', 11);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('biryani', 'Biryani', 12);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('tandoor-naan-bread', 'Tandoor & Naan Bread', 13);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('sides', 'Sides', 14);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('kids-menu', 'Kids Menu', 15);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('dessert', 'Dessert', 16);
INSERT INTO menu_categories (id, name, sort_order) VALUES ('drinks', 'Drinks', 17);

-- Insert Products
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-onion-bhaji-1', 'entree', 'Onion Bhaji', 'Sliced onions rolled in chickpea flour and deep fried.', 5.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-samosa-2pcs-2', 'entree', 'Samosa - 2Pcs', 'Authentic punjabi style potato and peas samosa served with tamarind sauce', 5.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-vegetable-pakora-3', 'entree', 'Vegetable Pakora', 'Cauliflower, potatoes, onion and spinach coated in gram flour batter and mixed spices.', 7.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-paneer-pakora-4', 'entree', 'Paneer Pakora', 'Soft paneer pieces are deep fried after being coated in a spiced gram flour batter.', 8.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-tandoori-mushroom-5', 'entree', 'Tandoori Mushroom', 'Fresh mushrooms marinated in yogurt, ginger and garlic or fried with chickpea batter and herbs.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-fried-mushroom-6', 'entree', 'Fried Mushroom', 'Fresh mushrooms marinated in yogurt, ginger and garlic or fried with chickpea batter and herbs.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-paneer-65-7', 'entree', 'Paneer 65', 'Paneer cubes cooked in curry leaves and yoghurt.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-paneer-tikka-8', 'entree', 'Paneer Tikka', 'Homemade cheese marinated in yogurt, herbs and spices, grilled in tandoor.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-vegetarian-platter-9', 'entree', 'Vegetarian Platter', 'Samosa, pakora, paneer pakora and onion bhaji assortment.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-chicken-65-10', 'entree', 'Chicken 65', 'Chicken cubes cooked in curry leaves and yoghurt.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-chicken-malai-kebab-11', 'entree', 'Chicken Malai Kebab', 'Marinated boneless chicken roasted in tandoor.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-chicken-tikka-12', 'entree', 'Chicken Tikka', 'Boneless chicken marinated overnight and cooked in tandoor.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-tangari-kabab-13', 'entree', 'Tangari Kabab', 'With Bone chicken marinated overnight and cooked in tandoor.', 16.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-tandoori-chicken-half-14', 'entree', 'Tandoori Chicken - Half', 'Chicken marinated in spices and yoghurt, served with mint sauce.', 11.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-tandoori-chicken-full-15', 'entree', 'Tandoori Chicken - Full', 'Chicken marinated in spices and yoghurt, served with mint sauce.', 20.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-tandoori-prawns-16', 'entree', 'Tandoori Prawns', 'Prawns marinated in yogurt garlic sauce and cooked in tandoor.', 24.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-tandoori-fish-17', 'entree', 'Tandoori Fish', 'Fish marinated in yogurt garlic sauce and cooked in tandoor.', 22.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-amritsari-fried-fish-18', 'entree', 'Amritsari Fried Fish', 'Fish marinated in yogurt garlic sauce and fried with chickpea batter.', 22.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-lamb-seekh-kebab-19', 'entree', 'Lamb Seekh Kebab', 'Minced lamb flavoured with spices, skewered and cooked in tandoor.', 16.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-prawn-chilli-garlic-20', 'entree', 'Prawn Chilli Garlic', 'Cooked in garlic and chilli, served with sliced mushrooms.', 17.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-mixed-platter-21', 'entree', 'Mixed Platter', 'Selection of samosa, pakora, chicken tikka and seekh kebab.', 22.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('entree-meharbaan-special-platter-22', 'entree', 'Meharbaan Special Platter', 'Combination of tandoori chicken, malai kebabs, seekh kebab and prawns.', 25.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-korma-23', 'mains-lamb', 'Lamb Korma', 'Lamb cooked in cashew nut gravy.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-saag-24', 'mains-lamb', 'Lamb Saag', 'Lamb cooked with spinach puree.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-madras-25', 'mains-lamb', 'Lamb Madras', 'Medium spicy coconut-based lamb curry.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-tikka-masala-26', 'mains-lamb', 'Lamb Tikka Masala', 'Tandoori lamb cooked in spicy gravy with onions and capsicum.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-nawabi-27', 'mains-lamb', 'Lamb Nawabi', 'Lamb cooked with onions, tomatoes and cream.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-rogan-josh-28', 'mains-lamb', 'Lamb Rogan Josh', 'Lamb cooked with onion, tomato, garlic and spices.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-do-pyaza-29', 'mains-lamb', 'Lamb Do Pyaza', 'Lamb cooked in onion-based gravy with mild spices.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-vindaloo-30', 'mains-lamb', 'Lamb Vindaloo', 'Spicy Goan-style lamb curry.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-jalfrezi-31', 'mains-lamb', 'Lamb Jalfrezi', 'Tangy lamb cooked with capsicum and onion.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-jalfrezi-32', 'mains-lamb', 'Lamb Jalfrezi', 'Tangy lamb cooked with capsicum and onion.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-kadhai-ghost-33', 'mains-lamb', 'Lamb Kadhai Ghost', 'Lamb cooked with onion, capsicum and coriander.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-lamb-lamb-bhuna-34', 'mains-lamb', 'Lamb Bhuna', 'Lamb cooked in onion-based gravy with ginger, garlic and tomato.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-butter-chicken-35', 'mains-chicken', 'Butter Chicken', 'Tandoori chicken finished in creamy tomato gravy.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-saag-36', 'mains-chicken', 'Chicken Saag', 'Chicken cooked in spinach puree.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-jalfrezi-37', 'mains-chicken', 'Chicken Jalfrezi', 'Chicken cooked in medium spicy sour sauce with capsicum and tomatoes.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-korma-38', 'mains-chicken', 'Chicken Korma', 'Chicken cooked in cashew nut gravy.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-madras-39', 'mains-chicken', 'Chicken Madras', 'Medium spicy coconut-based curry.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-mughalai-40', 'mains-chicken', 'Chicken Mughalai', 'Chicken cooked in onion and cashew nut gravy.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-bhuna-41', 'mains-chicken', 'Chicken Bhuna', 'Chicken cooked in onion-based gravy with ginger, garlic and tomato.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-kadhai-chicken-42', 'mains-chicken', 'Kadhai Chicken', 'Chicken cooked with onion, capsicum and red chilli.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-tikka-masala-43', 'mains-chicken', 'Chicken Tikka Masala', 'Tandoori chicken cooked in spicy gravy with capsicum and onions.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-balti-44', 'mains-chicken', 'Chicken Balti', 'Chicken cooked in medium spicy gravy with green pepper.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-vindaloo-45', 'mains-chicken', 'Chicken Vindaloo', 'Spicy Goan-style chicken curry.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-mango-chicken-46', 'mains-chicken', 'Mango Chicken', 'Chicken cooked in creamy mango flavoured sauce.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-hyderabadi-47', 'mains-chicken', 'Chicken Hyderabadi', 'Chicken cooked with mint, spices, onion and tomatoes.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-punjab-48', 'mains-chicken', 'Chicken Punjab', 'Punjabi-style chicken curry with onion, ginger, garlic and tomatoes.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-tawa-chicken-49', 'mains-chicken', 'Tawa Chicken', 'Tawa-style chicken topped with capsicum, onion and spices.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-handi-chicken-50', 'mains-chicken', 'Handi Chicken', 'Chicken cooked in chef\'s special recipe.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-chicken-rara-51', 'mains-chicken', 'Chicken Rara', 'Rich and aromatic dry boneless chicken curry.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-chicken-delhi-style-butter-chicken-52', 'mains-chicken', 'Delhi Style Butter Chicken', 'Bone-in tandoori chicken cooked in butter sauce.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-poppadum-4pc-53', 'naturally-vegan', 'Vegan Poppadum 4Pc', 'Crispy lentil wafers.', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-onion-bhaji-54', 'naturally-vegan', 'Vegan Onion Bhaji', 'Onions rolled in chickpea flour and deep fried.', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-vegetable-samosa-55', 'naturally-vegan', 'Vegan Vegetable Samosa', 'Pastry filled with spiced potatoes and peas.', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-aloo-mattar-56', 'naturally-vegan', 'Vegan Aloo Mattar', 'Potatoes and peas cooked in spiced gravy.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-mumbai-aloo-57', 'naturally-vegan', 'Vegan Mumbai Aloo', 'Potatoes cooked with tomato and cumin.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-saag-aloo-58', 'naturally-vegan', 'Vegan Saag Aloo', 'Potatoes cooked in spinach puree.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-aloo-gobhi-59', 'naturally-vegan', 'Vegan Aloo Gobhi', 'Potato and cauliflower cooked with spices.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-jalfrezi-60', 'naturally-vegan', 'Vegan Jalfrezi', 'Mixed vegetables cooked in capsicum and onion gravy.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-yellow-dhal-tadka-61', 'naturally-vegan', 'Vegan Yellow Dhal Tadka', 'Yellow lentils cooked with spices and garlic.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-chana-masala-62', 'naturally-vegan', 'Vegan Chana Masala', 'Chickpeas cooked in onion and tomato gravy.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('naturally-vegan-vegan-roti-63', 'naturally-vegan', 'Vegan Roti', 'Wholemeal bread cooked in tandoor.', 3.5, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-goat-goat-mutton-curry-64', 'mains-goat', 'Goat (Mutton) Curry', 'Bone-in goat cooked in home-style sauce.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-goat-goat-mutton-kadhai-65', 'mains-goat', 'Goat (Mutton) Kadhai', 'Bone-in goat cooked in home-style sauce.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-goat-goat-mutton-meharbaan-special-66', 'mains-goat', 'Goat (Mutton) Meharbaan Special', 'Bone-in goat cooked in home-style sauce.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-mix-veg-korma-67', 'mains-vegetarian', 'Mix Veg Korma', 'Mixed vegetables cooked in a creamy, mildly sweet cashew-based gravy with aromatic spices.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-aloo-matar-68', 'mains-vegetarian', 'Aloo Matar', 'Potatoes and peas cooked in a mildly spiced onion-tomato gravy for a homestyle favourite.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-mumbai-aloo-69', 'mains-vegetarian', 'Mumbai Aloo', 'Potatoes cooked with tomatoes and cumin seeds.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-saag-aloo-70', 'mains-vegetarian', 'Saag Aloo', 'Potatoes cooked in spinach puree.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-aloo-gobhi-71', 'mains-vegetarian', 'Aloo Gobhi', 'Cauliflower and potatoes sauteed with turmeric, ginger, and spices for a dry-style, flavourful dish.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-vegetable-jalfrezi-72', 'mains-vegetarian', 'Vegetable Jalfrezi', 'Mixed vegetables cooked with capsicum and onion gravy.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-chana-masala-73', 'mains-vegetarian', 'Chana Masala', 'Chickpeas cooked in onion and tomato gravy.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-yellow-daal-tadka-74', 'mains-vegetarian', 'Yellow Daal Tadka', 'Light yellow lentils finished with a fragrant garlic cumin, chilli tempering.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-daal-makhani-75', 'mains-vegetarian', 'Daal Makhani', 'Slow cooked black lentils simmered with cream, butter and gentle spices for a rich, velvety flavour.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-malai-kofta-76', 'mains-vegetarian', 'Malai Kofta', 'Soft paneer and potato dumplings served in a rich, creamy, mildly sweet gravy.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-methi-matar-mushroom-77', 'mains-vegetarian', 'Methi Matar Mushroom', 'Green peas and mushroom cooked together in a flavourful onion-tomato gravy.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-methi-matar-paneer-78', 'mains-vegetarian', 'Methi Matar Paneer', 'Paneer with peas cooked in creamy onion gravy with fenugreek.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-mattar-paneer-79', 'mains-vegetarian', 'Mattar Paneer', 'Paneer cubes cooked with green peas in a mildly spiced comforting gravy.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-paneer-saag-80', 'mains-vegetarian', 'Paneer Saag', 'Fresh spinach blended with spices and cooked with soft paneer cubes for a smooth, nutritious curry.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-paneer-tikka-masala-81', 'mains-vegetarian', 'Paneer Tikka Masala', 'Grilled paneer tikka simmered in a bold, tangy, creamy masala gravy.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-paneer-makhani-82', 'mains-vegetarian', 'Paneer Makhani', 'Soft paneer cubes simmered in a smooth buttery tomato gravy with mild spices.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-kadhai-paneer-83', 'mains-vegetarian', 'Kadhai Paneer', 'Paneer cooked with onion and capsicum in tomato gravy.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('mains-vegetarian-shahi-paneer-84', 'mains-vegetarian', 'Shahi Paneer', 'Paneer cooked in a luxurious, creamy, cashew-based royal gravy with gentle spices.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('momo-veg-steam-momos-85', 'momo', 'Veg Steam Momos', '', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('momo-crispy-fried-momos-86', 'momo', 'Crispy Fried Momos', '', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('momo-tandoori-momos-87', 'momo', 'Tandoori Momos', '', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('momo-chilli-momos-88', 'momo', 'Chilli Momos', '', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('pasta-white-sauce-pasta-89', 'pasta', 'White Sauce Pasta', '', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('pasta-white-sauce-pasta-chicken-90', 'pasta', 'White Sauce Pasta (Chicken)', '', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('pasta-red-sauce-pasta-91', 'pasta', 'Red Sauce Pasta', '', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('pasta-red-sauce-pasta-chicken-92', 'pasta', 'Red Sauce Pasta (Chicken)', '', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('soups-manchow-soup-93', 'soups', 'Manchow Soup', '', 8.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('soups-hot-sour-soup-94', 'soups', 'Hot & Sour Soup', '', 8.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('soups-hot-sour-soup-chicken-95', 'soups', 'Hot & Sour Soup (Chicken)', '', 10.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('soups-sweet-corn-soup-96', 'soups', 'Sweet Corn Soup', '', 8.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('soups-tomato-soup-97', 'soups', 'Tomato Soup', '', 9.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-tikki-chana-chaat-98', 'meharbaan-specials', 'Tikki Chana Chaat', '', 9.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-samosa-chana-chaat-99', 'meharbaan-specials', 'Samosa Chana Chaat', '', 7.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-pani-wale-gol-gappe-100', 'meharbaan-specials', 'Pani Wale Gol Gappe', '', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-dahi-wale-gol-gappe-101', 'meharbaan-specials', 'Dahi Wale Gol Gappe', '', 8.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-amritsari-naan-with-chana-102', 'meharbaan-specials', 'Amritsari Naan with Chana', '', 12.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-tikki-burger-103', 'meharbaan-specials', 'Tikki Burger', '', 9.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-noodle-burger-104', 'meharbaan-specials', 'Noodle Burger', '', 11.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-soya-chaap-105', 'meharbaan-specials', 'Soya Chaap', '', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-afghani-chaap-106', 'meharbaan-specials', 'Afghani Chaap', '', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('meharbaan-specials-achari-chaap-107', 'meharbaan-specials', 'Achari Chaap', '', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-veg-fried-rice-108', 'indo-chinese-dishes', 'Veg Fried Rice', 'Indian Chinese style fried rice with vegetables.', 12.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-egg-fried-rice-109', 'indo-chinese-dishes', 'Egg Fried Rice', 'Indian Chinese style fried rice with egg.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-chicken-fried-rice-110', 'indo-chinese-dishes', 'Chicken Fried Rice', 'Indian Chinese style fried rice with chicken.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-vegetable-chowmein-111', 'indo-chinese-dishes', 'Vegetable Chowmein', 'Noodles cooked with vegetables.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-vegetable-manchurian-112', 'indo-chinese-dishes', 'Vegetable Manchurian', 'Vegetable balls cooked in garlic, ginger and soy sauce.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-chilli-paneer-113', 'indo-chinese-dishes', 'Chilli Paneer', 'Paneer sautéed with soy sauce.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-chicken-chowmein-114', 'indo-chinese-dishes', 'Chicken Chowmein', 'Noodles cooked with boneless chicken.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-chicken-manchurian-115', 'indo-chinese-dishes', 'Chicken Manchurian', 'Chicken cooked with garlic, ginger, chilli and soy sauce.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-chilli-chicken-116', 'indo-chinese-dishes', 'Chilli Chicken', 'Chicken sautéed with soy sauce.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('indo-chinese-dishes-honey-chilli-potato-117', 'indo-chinese-dishes', 'Honey Chilli Potato', 'Crispy potato fingers tossed in a sweet spicy honey chilli glaze, finished with sesame seeds for the perfect crunch.', 12.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('biryani-peas-pulao-118', 'biryani', 'Peas Pulao', 'Rice cooked with peas and spices.', 7.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('biryani-kashmiri-pulao-119', 'biryani', 'Kashmiri Pulao', 'Rice cooked with vegetables, fruits and nuts.', 9.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('biryani-veg-biryani-120', 'biryani', 'Veg Biryani', 'Rice cooked with vegetables.', 13.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('biryani-non-veg-biryani-121', 'biryani', 'Non-Veg Biryani', 'Rice cooked with chicken with spices.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('biryani-lamb-biryani-122', 'biryani', 'Lamb Biryani', 'Rice cooked with lamb with spices.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('biryani-prawn-biryani-123', 'biryani', 'Prawn Biryani', 'Rice and prawns cooked with herbs and gravy.', 20.5, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-roti-124', 'tandoor-naan-bread', 'Roti', 'Wholemeal bread.', 2.9, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-plain-naan-125', 'tandoor-naan-bread', 'Plain Naan', 'Plain flour bread.', 2.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-butter-naan-126', 'tandoor-naan-bread', 'Butter Naan', 'Plain flour bread with butter.', 2.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-garlic-naan-127', 'tandoor-naan-bread', 'Garlic Naan', 'Naan garnished with garlic.', 3.15, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-cheese-naan-128', 'tandoor-naan-bread', 'Cheese Naan', 'Naan stuffed with cheese.', 3.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-cheese-garlic-naan-129', 'tandoor-naan-bread', 'Cheese Garlic Naan', 'Naan with garlic and cheese.', 4.5, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-spinach-and-cheese-naan-130', 'tandoor-naan-bread', 'Spinach and Cheese Naan', 'Naan stuffed with spinach and cheese.', 5.5, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-chef-special-naan-131', 'tandoor-naan-bread', 'Chef Special Naan', 'Naan stuffed with onions, capsicum and cheese.', 5.5, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-paneer-kulcha-132', 'tandoor-naan-bread', 'Paneer Kulcha', 'Bread stuffed with spiced paneer.', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-aloo-paratha-133', 'tandoor-naan-bread', 'Aloo Paratha', 'Bread stuffed with potato and herbs.', 5.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-lachha-paratha-134', 'tandoor-naan-bread', 'Lachha Paratha', 'Layered wheat flatbread.', 4.5, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-methi-lachha-paratha-135', 'tandoor-naan-bread', 'Methi Lachha Paratha', 'Layered wheat flatbread with fenugreek.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-chocolate-naan-136', 'tandoor-naan-bread', 'Chocolate Naan', 'Naan stuffed with chocolate.', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-peshwari-naan-137', 'tandoor-naan-bread', 'Peshwari Naan', 'Sweet naan stuffed with dried fruits and nuts.', 3.5, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-chicken-naan-138', 'tandoor-naan-bread', 'Chicken Naan', 'Naan stuffed with chicken.', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-keema-naan-139', 'tandoor-naan-bread', 'Keema Naan', 'Naan stuffed with spiced minced meat.', 7.5, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('tandoor-naan-bread-bread-basket-140', 'tandoor-naan-bread', 'Bread Basket', 'Butter naan, Cheese naan, Garlic naan, Peshwari naan.', 15.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-poppadum-4-pcs-141', 'sides', 'Poppadum 4 Pcs', 'Crispy lentil wafers.', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-sweet-mango-chutney-142', 'sides', 'Sweet Mango Chutney', 'Sweet mango sauce.', 1.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-tamarind-sauce-143', 'sides', 'Tamarind Sauce', 'Tangy tamarind sauce.', 1.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-mint-chutney-144', 'sides', 'Mint Chutney', 'Mint flavoured sauce.', 1.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-pickles-145', 'sides', 'Pickles', 'Indian mixed pickles.', 1.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-raita-146', 'sides', 'Raita', 'Yoghurt with cucumber.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-onion-salad-147', 'sides', 'Onion Salad', 'Fresh onion salad.', 3.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-kachumber-148', 'sides', 'Kachumber', 'Cucumber, tomato and onion salad with chaat masala.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-indian-salad-149', 'sides', 'Indian Salad', 'Mixed Indian-style salad.', 7.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-poppadum-platter-150', 'sides', 'Poppadum Platter', 'Poppadums served with chutneys.', 8.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-6-side-dish-platter-151', 'sides', '6 Side Dish Platter', 'Poppadums with chutneys, raita and pickles.', 14.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-plain-rice-152', 'sides', 'Plain Rice', 'Steamed rice.', 3.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('sides-jeera-rice-153', 'sides', 'Jeera Rice', 'Rice cooked with cumin seeds.', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('kids-menu-kids-butter-chicken-154', 'kids-menu', 'Kids Butter Chicken', 'Mild butter chicken for kids.', 11.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('kids-menu-kids-chicken-nuggets-chips-155', 'kids-menu', 'Kids Chicken Nuggets & Chips', 'Chicken nuggets served with chips.', 10.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('kids-menu-kids-chicken-nuggets-156', 'kids-menu', 'Kids Chicken Nuggets', 'Fried chicken nuggets.', 7.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('kids-menu-kids-chips-157', 'kids-menu', 'Kids Chips', 'French fries.', 6.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-gulab-jamun-2pcs-158', 'dessert', 'Gulab Jamun - 2Pcs', 'Deep fried milk dumplings in sugar syrup.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-mango-kulfi-159', 'dessert', 'Mango Kulfi', 'Traditional mango ice cream.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-pineapple-kulfi-160', 'dessert', 'Pineapple Kulfi', 'Traditional mango ice cream.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-badam-kulfi-161', 'dessert', 'Badam Kulfi', 'Traditional mango ice cream.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-kasar-kulfi-162', 'dessert', 'Kasar Kulfi', 'Traditional mango ice cream.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-vanilla-kulfi-163', 'dessert', 'Vanilla Kulfi', 'Traditional mango ice cream.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-pan-kulfi-164', 'dessert', 'Pan Kulfi', 'Traditional mango ice cream.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-vanilla-ice-cream-2-scoop-165', 'dessert', 'Vanilla Ice Cream 2 Scoop', '', 5.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-chocolate-ice-cream-2-scoop-166', 'dessert', 'Chocolate Ice Cream 2 Scoop', '', 5.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-strawberry-ice-cream-2-scoop-167', 'dessert', 'Strawberry Ice Cream 2 Scoop', '', 5.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('dessert-rose-faluda-168', 'dessert', 'Rose Faluda', '', 10.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('drinks-soft-drinks-169', 'drinks', 'Soft Drinks', 'Assorted canned and bottled beverages.', 3.5, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('drinks-mango-lassi-170', 'drinks', 'Mango Lassi', 'Sweet mango yoghurt drink.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('drinks-sweet-lassi-171', 'drinks', 'Sweet Lassi', 'Sweet yoghurt drink.', 4.99, '', '[]', '[]', 1, 1);
INSERT INTO menu_products (id, category_id, name, description, price, image, size_options, spice_options, active, is_active) VALUES ('drinks-salt-lassi-172', 'drinks', 'Salt Lassi', 'Salted yoghurt drink.', 4.99, '', '[]', '[]', 1, 1);

-- Insert Settings
INSERT INTO app_settings (setting_key, setting_value) VALUES ('order_options', '{"delivery":true,"pickup":true}') ON DUPLICATE KEY UPDATE setting_key = setting_key;
INSERT INTO app_settings (setting_key, setting_value) VALUES ('menu_catalog_version', '"excel-2026-07-29"') ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Insert Delivery Settings (only if empty)
INSERT INTO delivery_settings (suburbs, time_slots) SELECT '["Papatoetoe","Manukau","Ōtāhuhu","Māngere","Flat Bush","East Tāmaki"]', '{"Sunday":["11:30","12:00","12:30","13:00","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],"Monday":["11:30","12:00","12:30","13:00","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],"Tuesday":["11:30","12:00","12:30","13:00","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],"Wednesday":["11:30","12:00","12:30","13:00","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],"Thursday":["11:30","12:00","12:30","13:00","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],"Friday":["11:30","12:00","12:30","13:00","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"],"Saturday":["11:30","12:00","12:30","13:00","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"]}' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM delivery_settings LIMIT 1);

-- Done!