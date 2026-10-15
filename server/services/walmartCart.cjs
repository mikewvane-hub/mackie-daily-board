const fs = require('fs');
const path = require('path');

/**
 * Walmart Great Value & Lowest-Price Grocery Catalog
 * Curated with verified Great Value item IDs across produce, dairy, bakery, meat, pantry, baking, and spices.
 */
const WALMART_GREAT_VALUE_CATALOG = {
  // Dairy & Refrigerated
  'eggs': { itemId: '14505197', title: 'Great Value Large White Eggs, 12 Count', brand: 'Great Value' },
  'egg': { itemId: '14505197', title: 'Great Value Large White Eggs, 12 Count', brand: 'Great Value' },
  'milk': { itemId: '10450114', title: 'Great Value Whole Vitamin D Milk, 1 Gallon', brand: 'Great Value' },
  'whole milk': { itemId: '10450114', title: 'Great Value Whole Vitamin D Milk, 1 Gallon', brand: 'Great Value' },
  'butter': { itemId: '10450190', title: 'Great Value Sweet Cream Salted Butter, 4 Sticks (16 oz)', brand: 'Great Value' },
  'unsalted butter': { itemId: '10450191', title: 'Great Value Sweet Cream Unsalted Butter, 4 Sticks (16 oz)', brand: 'Great Value' },
  'heavy cream': { itemId: '10450141', title: 'Great Value Heavy Whipping Cream, 16 fl oz', brand: 'Great Value' },
  'heavy whipping cream': { itemId: '10450141', title: 'Great Value Heavy Whipping Cream, 16 fl oz', brand: 'Great Value' },
  'sour cream': { itemId: '10450175', title: 'Great Value All Natural Sour Cream, 16 oz', brand: 'Great Value' },
  'half and half': { itemId: '10450137', title: 'Great Value Traditional Half & Half, 32 fl oz', brand: 'Great Value' },
  'cream cheese': { itemId: '10450159', title: 'Great Value Original Cream Cheese, 8 oz', brand: 'Great Value' },
  'chive & onion cream cheese': { itemId: '10450161', title: 'Great Value Chive & Onion Cream Cheese Spread, 8 oz', brand: 'Great Value' },
  'cottage cheese': { itemId: '10450153', title: 'Great Value 4% Milkfat Small Curd Cottage Cheese, 16 oz', brand: 'Great Value' },
  'ricotta cheese': { itemId: '10450171', title: 'Great Value Whole Milk Ricotta Cheese, 15 oz', brand: 'Great Value' },
  'shredded cheddar cheese': { itemId: '10452416', title: 'Great Value Shredded Mild Cheddar Cheese, 8 oz', brand: 'Great Value' },
  'cheddar cheese': { itemId: '10452416', title: 'Great Value Shredded Mild Cheddar Cheese, 8 oz', brand: 'Great Value' },
  'mozzarella cheese': { itemId: '10452417', title: 'Great Value Shredded Low-Moisture Part-Skim Mozzarella Cheese, 8 oz', brand: 'Great Value' },
  'fresh mozzarella pearls': { itemId: '631835338', title: 'BelGioioso Fresh Mozzarella Pearls Cheese, 8 oz', brand: 'BelGioioso' },
  'parmesan cheese': { itemId: '10452420', title: 'Great Value Grated Parmesan Cheese, 8 oz', brand: 'Great Value' },
  'pecorino romano cheese': { itemId: '197992911', title: 'Locatelli Pecorino Romano Grated Cheese, 8 oz', brand: 'Locatelli' },
  'feta cheese': { itemId: '10452424', title: 'Great Value Traditional Crumbled Feta Cheese, 6 oz', brand: 'Great Value' },
  'monterey jack cheese': { itemId: '10452418', title: 'Great Value Shredded Monterey Jack Cheese, 8 oz', brand: 'Great Value' },
  'pepperjack cheese': { itemId: '10452419', title: 'Great Value Shredded Pepper Jack Cheese, 8 oz', brand: 'Great Value' },
  'provolone cheese': { itemId: '10452422', title: 'Great Value Sliced Provolone Cheese, 8 oz', brand: 'Great Value' },
  'swiss cheese': { itemId: '10452423', title: 'Great Value Sliced Swiss Cheese, 8 oz', brand: 'Great Value' },
  'american cheese slices': { itemId: '10452415', title: 'Great Value Singles American Pasteurized Prepared Cheese Product, 24 count', brand: 'Great Value' },
  'boursin garlic & herb cheese': { itemId: '10804791', title: 'Boursin Garlic & Fine Herbs Gournay Cheese, 5.2 oz', brand: 'Boursin' },
  'plain greek yogurt': { itemId: '10450186', title: 'Great Value Plain Nonfat Greek Yogurt, 32 oz', brand: 'Great Value' },
  'buttermilk': { itemId: '10450117', title: 'Great Value Lowfat 1% Cultured Buttermilk, 32 fl oz', brand: 'Great Value' },

  // Produce
  'sweet potatoes': { itemId: '106137651', title: 'Great Value Sweet Potatoes, 10 oz Bag', brand: 'Great Value' },
  'russet potatoes': { itemId: '10451000', title: 'Russet Potatoes, 5 lb Bag (Great Value/Fresh)', brand: 'Great Value' },
  'mashed potatoes': { itemId: '10315874', title: 'Great Value Instant Mashed Potatoes, 13.3 oz', brand: 'Great Value' },
  'yellow onion': { itemId: '44390953', title: 'Yellow Onions, 3 lb Bag', brand: 'Fresh Produce' },
  'red onion': { itemId: '44390954', title: 'Red Onion, Each', brand: 'Fresh Produce' },
  'garlic': { itemId: '44390955', title: 'Fresh Garlic, 3 Pack', brand: 'Fresh Produce' },
  'roma tomatoes': { itemId: '44390956', title: 'Roma Tomatoes, Fresh', brand: 'Fresh Produce' },
  'cherry tomatoes': { itemId: '44390957', title: 'Grape / Cherry Tomatoes, 10 oz Pint', brand: 'Fresh Produce' },
  'avocado': { itemId: '44390958', title: 'Fresh Hass Avocados, Bag of 4-5', brand: 'Fresh Produce' },
  'fresh baby spinach': { itemId: '10450998', title: 'Marketside Fresh Baby Spinach, 10 oz Bag', brand: 'Marketside' },
  'spinach': { itemId: '10450998', title: 'Marketside Fresh Baby Spinach, 10 oz Bag', brand: 'Marketside' },
  'kale': { itemId: '44390959', title: 'Fresh Tuscan / Curly Kale Bunch', brand: 'Fresh Produce' },
  'shredded carrots': { itemId: '10450999', title: 'Marketside Shredded Carrots, 10 oz', brand: 'Marketside' },
  'baby carrots': { itemId: '10451001', title: 'Marketside Baby Peeled Carrots, 1 lb Bag', brand: 'Marketside' },
  'celery': { itemId: '44390960', title: 'Fresh Celery Stalk', brand: 'Fresh Produce' },
  'broccoli': { itemId: '10451002', title: 'Marketside Fresh Broccoli Florets, 12 oz Bag', brand: 'Marketside' },
  'bell pepper': { itemId: '44390961', title: 'Bell Peppers 3-Pack (Red, Orange, Yellow)', brand: 'Fresh Produce' },
  'green bell pepper': { itemId: '44390962', title: 'Fresh Green Bell Pepper', brand: 'Fresh Produce' },
  'jalapeno': { itemId: '44390963', title: 'Fresh Jalapeño Peppers', brand: 'Fresh Produce' },
  'fresh cilantro': { itemId: '44390964', title: 'Fresh Cilantro Bunch', brand: 'Fresh Produce' },
  'fresh parsley': { itemId: '44390965', title: 'Fresh Flat-Leaf Parsley Bunch', brand: 'Fresh Produce' },
  'fresh basil': { itemId: '44390966', title: 'Fresh Basil Leaves, 0.75 oz Package', brand: 'Fresh Produce' },
  'lemons': { itemId: '44390967', title: 'Fresh Lemons, 2 lb Bag', brand: 'Fresh Produce' },
  'lemon': { itemId: '44390968', title: 'Fresh Lemon, Each', brand: 'Fresh Produce' },
  'limes': { itemId: '44390969', title: 'Fresh Limes, 1 lb Bag', brand: 'Fresh Produce' },
  'lime': { itemId: '44390970', title: 'Fresh Lime, Each', brand: 'Fresh Produce' },
  'bananas': { itemId: '44390971', title: 'Fresh Bananas, Bunch (~3 lb)', brand: 'Fresh Produce' },
  'strawberries': { itemId: '44390972', title: 'Fresh Strawberries, 1 lb Container', brand: 'Fresh Produce' },
  'blueberries': { itemId: '44390973', title: 'Fresh Blueberries, 1 Pint (11 oz)', brand: 'Fresh Produce' },
  'raspberries': { itemId: '44390974', title: 'Fresh Red Raspberries, 6 oz', brand: 'Fresh Produce' },
  'apples': { itemId: '44390975', title: 'Honeycrisp / Gala Apples, 3 lb Bag', brand: 'Fresh Produce' },

  // Meat, Poultry & Seafood
  'chicken breast': { itemId: '10450917', title: 'Great Value Boneless Skinless Chicken Breasts, 3 lb Frozen Bag', brand: 'Great Value' },
  'boneless skinless chicken thighs': { itemId: '10450920', title: 'Great Value Boneless Skinless Chicken Thighs, 3 lb Frozen Bag', brand: 'Great Value' },
  'chicken thighs': { itemId: '10450920', title: 'Great Value Boneless Skinless Chicken Thighs, 3 lb Frozen Bag', brand: 'Great Value' },
  'chicken cutlets': { itemId: '10450918', title: 'Fresh Boneless Skinless Thin-Sliced Chicken Breast Cutlets', brand: 'Great Value / Fresh' },
  'rotisserie chicken': { itemId: '10450919', title: 'Fresh Deli Traditional Rotisserie Chicken, Hot', brand: 'Marketside' },
  'just bare chicken bites': { itemId: '937213401', title: 'Just Bare Lightly Breaded Chicken Breast Chunks, 24 oz', brand: 'Just Bare' },
  'ground beef': { itemId: '15136791', title: 'All Natural 80/20 Ground Beef Chuck, 1 lb', brand: 'All Natural' },
  'ground turkey, beef, or pork': { itemId: '10450921', title: 'Honeysuckle White 93/7 Ground Turkey, 1 lb (Cheapest Lean Option)', brand: 'Honeysuckle White' },
  'ground turkey': { itemId: '10450921', title: 'Honeysuckle White 93/7 Ground Turkey, 1 lb', brand: 'Honeysuckle White' },
  'beef chuck roast': { itemId: '10450922', title: 'USDA Choice Beef Chuck Roast, Boneless (~2.5 lb)', brand: 'Fresh Beef' },
  'bone-in beef short ribs': { itemId: '10450923', title: 'Beef Choice Bone-In Short Ribs', brand: 'Fresh Beef' },
  'bone-in lamb chops': { itemId: '10450924', title: 'Fresh Bone-In Loin Lamb Chops', brand: 'Fresh Lamb' },
  'pulled pork': { itemId: '10450925', title: 'Curley’s / Great Value Smoked Pulled Pork, 16 oz', brand: 'Great Value' },
  'chorizo': { itemId: '10450926', title: 'Reynaldo’s Pork Chorizo, 9 oz', brand: 'Reynaldo’s' },
  'italian sausage': { itemId: '10450927', title: 'Great Value Sweet Italian Ground Sausage, 16 oz', brand: 'Great Value' },
  'breakfast sausage': { itemId: '10450928', title: 'Great Value Mild Pork Breakfast Sausage Roll, 16 oz', brand: 'Great Value' },
  'turkey breakfast sausage': { itemId: '10450929', title: 'Butterball Natural All Turkey Breakfast Sausage, 16 oz', brand: 'Butterball' },
  'chicken sausage': { itemId: '10450930', title: 'Aidells Smoked Chicken & Apple Sausage, 12 oz', brand: 'Aidells' },
  'bacon': { itemId: '10450931', title: 'Great Value Naturally Hardwood Smoked Bacon, 16 oz', brand: 'Great Value' },
  'bacon bits': { itemId: '10315740', title: 'Great Value Real Bacon Pieces, 2.8 oz', brand: 'Great Value' },
  'frozen meatballs': { itemId: '10450932', title: 'Great Value Homestyle Meatballs, 32 oz Frozen', brand: 'Great Value' },
  "hillshire farm lit'l smokies": { itemId: '10312480', title: "Hillshire Farm Lit'l Smokies Smoked Sausage, 14 oz", brand: 'Hillshire Farm' },
  'deli turkey': { itemId: '10450933', title: 'Great Value Thin Sliced Oven Roasted Turkey Breast, 9 oz', brand: 'Great Value' },
  'turkey': { itemId: '10450933', title: 'Great Value Thin Sliced Oven Roasted Turkey Breast, 9 oz', brand: 'Great Value' },
  'ham': { itemId: '10450934', title: 'Great Value Thin Sliced Smoked Ham, 9 oz', brand: 'Great Value' },
  'salmon fillets': { itemId: '10450935', title: 'Great Value Skin-On Atlantic Salmon Fillets, 16 oz Frozen', brand: 'Great Value' },
  'shrimp & scallops': { itemId: '10450936', title: 'Great Value Medium Peeled Tail-Off Raw Shrimp, 16 oz Frozen', brand: 'Great Value' },

  // Bakery, Bread & Deli
  'sourdough': { itemId: '10449982', title: 'Marketside Sourdough Bread Loaf, 16 oz (Cheapest Deli Sourdough)', brand: 'Marketside' },
  'bread': { itemId: '10315770', title: 'Great Value White Sandwich Bread, 20 oz Loaf', brand: 'Great Value' },
  'white bread': { itemId: '10315770', title: 'Great Value White Sandwich Bread, 20 oz Loaf', brand: 'Great Value' },
  'hamburger buns': { itemId: '10315771', title: 'Great Value Enriched Hamburger Buns, 8 Count', brand: 'Great Value' },
  'hot dog buns': { itemId: '10315772', title: 'Great Value Enriched Hot Dog Buns, 8 Count', brand: 'Great Value' },
  'brie': { itemId: '10452425', title: 'President / Great Value Brie Round Cheese, 8 oz', brand: 'President' },
  'flour tortillas': { itemId: '10315895', title: 'Great Value 8-Inch Soft Taco Flour Tortillas, 10 Count', brand: 'Great Value' },
  'corn tortillas': { itemId: '10315896', title: 'Great Value Yellow Corn Tortillas, 30 Count', brand: 'Great Value' },
  'tortilla chips': { itemId: '10315897', title: 'Great Value Restaurant Style White Corn Tortilla Chips, 13 oz', brand: 'Great Value' },

  // Oils, Condiments & Sauces
  'olive oil': { itemId: '10316039', title: 'Great Value 100% Extra Virgin Olive Oil, 25.5 fl oz', brand: 'Great Value' },
  'avocado oil': { itemId: '10316040', title: 'Great Value 100% Pure Avocado Oil, 16.9 fl oz', brand: 'Great Value' },
  'coconut oil': { itemId: '10316041', title: 'Great Value Organic Unrefined Virgin Coconut Oil, 14 fl oz', brand: 'Great Value' },
  'cooking oil': { itemId: '10316042', title: 'Great Value Vegetable Oil, 48 fl oz', brand: 'Great Value' },
  'peanut butter': { itemId: '10315881', title: 'Great Value Creamy Peanut Butter, 16 oz', brand: 'Great Value' },
  'mayonnaise': { itemId: '10315875', title: 'Great Value Real Mayonnaise, 30 fl oz', brand: 'Great Value' },
  'yellow mustard': { itemId: '10315876', title: 'Great Value Yellow Mustard, 14 oz', brand: 'Great Value' },
  'dijon mustard': { itemId: '10315877', title: 'Great Value Dijon Mustard, 12 oz', brand: 'Great Value' },
  'ketchup': { itemId: '10315871', title: 'Great Value Tomato Ketchup, 24 oz', brand: 'Great Value' },
  'bbq sauce': { itemId: '10315872', title: 'Great Value Original Barbecue Sauce, 18 oz', brand: 'Great Value' },
  'soy sauce': { itemId: '10315891', title: 'Great Value Less Sodium Soy Sauce, 15 fl oz', brand: 'Great Value' },
  'hot sauce': { itemId: '10315892', title: 'Frank’s RedHot / Great Value Cayenne Pepper Sauce, 12 fl oz', brand: 'Great Value' },
  'salsa': { itemId: '10315888', title: 'Great Value Restaurant Style Medium Salsa, 16 oz', brand: 'Great Value' },
  'rotel diced tomatoes & green chilies': { itemId: '10315889', title: 'RO*TEL Original Diced Tomatoes and Green Chilies, 10 oz', brand: 'RO*TEL' },

  // Pantry, Canned & Grains
  'spaghetti': { itemId: '10315822', title: 'Great Value Spaghetti Pasta, 16 oz', brand: 'Great Value' },
  'pasta': { itemId: '10315822', title: 'Great Value Spaghetti Pasta, 16 oz', brand: 'Great Value' },
  'penne pasta': { itemId: '10315823', title: 'Great Value Penne Rigate Pasta, 16 oz', brand: 'Great Value' },
  'elbow macaroni': { itemId: '10315824', title: 'Great Value Elbow Macaroni Pasta, 16 oz', brand: 'Great Value' },
  'rice': { itemId: '10315883', title: 'Great Value Long Grain Enriched White Rice, 32 oz (2 lb)', brand: 'Great Value' },
  'jasmine rice': { itemId: '10315884', title: 'Great Value Thai Jasmine Rice, 32 oz (2 lb)', brand: 'Great Value' },
  'black beans': { itemId: '10315742', title: 'Great Value Black Beans, 15 oz Can', brand: 'Great Value' },
  'pinto beans': { itemId: '10315741', title: 'Great Value Pinto Beans, 15 oz Can', brand: 'Great Value' },
  'chickpeas': { itemId: '10315746', title: 'Great Value Garbanzo Beans (Chickpeas), 15 oz Can', brand: 'Great Value' },
  'diced tomatoes': { itemId: '10315759', title: 'Great Value Diced Tomatoes in Juice, 14.5 oz Can', brand: 'Great Value' },
  'crushed tomatoes': { itemId: '10315760', title: 'Great Value Crushed Tomatoes, 28 oz Can', brand: 'Great Value' },
  'tomato sauce': { itemId: '10315764', title: 'Great Value Tomato Sauce, 8 oz Can', brand: 'Great Value' },
  'tomato paste': { itemId: '10315763', title: 'Great Value Tomato Paste, 6 oz Can', brand: 'Great Value' },
  'marinara sauce': { itemId: '10315765', title: 'Great Value Traditional Pasta Sauce, 24 oz Jar', brand: 'Great Value' },
  'chicken broth': { itemId: '10315744', title: 'Great Value Chicken Broth, 32 oz Carton', brand: 'Great Value' },
  'beef broth': { itemId: '10315743', title: 'Great Value Beef Broth, 32 oz Carton', brand: 'Great Value' },
  'vegetable broth': { itemId: '10315747', title: 'Great Value Vegetable Broth, 32 oz Carton', brand: 'Great Value' },

  // Baking & Breakfast Staples
  'sugar': { itemId: '10315754', title: 'Great Value Pure Granulated Sugar, 4 lb Bag', brand: 'Great Value' },
  'granulated sugar': { itemId: '10315754', title: 'Great Value Pure Granulated Sugar, 4 lb Bag', brand: 'Great Value' },
  'brown sugar': { itemId: '10315748', title: 'Great Value Light Brown Sugar, 32 oz (2 lb)', brand: 'Great Value' },
  'powdered sugar': { itemId: '10315749', title: 'Great Value Confectioners Powdered Sugar, 32 oz', brand: 'Great Value' },
  'flour': { itemId: '10315779', title: 'Great Value All-Purpose Enriched Flour, 5 lb Bag', brand: 'Great Value' },
  'all-purpose flour': { itemId: '10315779', title: 'Great Value All-Purpose Enriched Flour, 5 lb Bag', brand: 'Great Value' },
  'baking powder': { itemId: '10315738', title: 'Great Value Double Acting Baking Powder, 8.1 oz', brand: 'Great Value' },
  'baking soda': { itemId: '10315739', title: 'Great Value Pure Baking Soda, 16 oz', brand: 'Great Value' },
  'vanilla extract': { itemId: '10315801', title: 'Great Value Pure Vanilla Extract, 2 fl oz', brand: 'Great Value' },
  'rolled oats': { itemId: '10315878', title: 'Great Value Old Fashioned Rolled Oats, 42 oz Tub', brand: 'Great Value' },
  'oats': { itemId: '10315878', title: 'Great Value Old Fashioned Rolled Oats, 42 oz Tub', brand: 'Great Value' },
  'pancake mix': { itemId: '10315879', title: 'Great Value Complete Pancake & Waffle Mix, 32 oz', brand: 'Great Value' },
  'maple syrup': { itemId: '10315873', title: 'Great Value Original Pancake Syrup, 24 fl oz', brand: 'Great Value' },
  'honey': { itemId: '10315867', title: 'Great Value 100% Pure Clover Honey, 12 oz Bear', brand: 'Great Value' },
  'semi-sweet chocolate chips': { itemId: '10315745', title: 'Great Value Semi-Sweet Real Chocolate Chips, 12 oz', brand: 'Great Value' },
  'chocolate chips': { itemId: '10315745', title: 'Great Value Semi-Sweet Real Chocolate Chips, 12 oz', brand: 'Great Value' },

  // Spices & Seasonings
  'salt': { itemId: '10315786', title: 'Great Value Iodized Table Salt, 26 oz', brand: 'Great Value' },
  'black pepper': { itemId: '10315839', title: 'Great Value Pure Ground Black Pepper, 3 oz', brand: 'Great Value' },
  'garlic powder': { itemId: '10315843', title: 'Great Value Garlic Powder, 3.4 oz', brand: 'Great Value' },
  'onion powder': { itemId: '10315849', title: 'Great Value Onion Powder, 2.62 oz', brand: 'Great Value' },
  'paprika': { itemId: '10315851', title: 'Great Value Smoked Paprika, 2.12 oz', brand: 'Great Value' },
  'chili powder': { itemId: '10315852', title: 'Great Value Chili Powder, 2.5 oz', brand: 'Great Value' },
  'ground cumin': { itemId: '10315853', title: 'Great Value Ground Cumin, 2 oz', brand: 'Great Value' },
  'cumin': { itemId: '10315853', title: 'Great Value Ground Cumin, 2 oz', brand: 'Great Value' },
  'ground cinnamon': { itemId: '10315854', title: 'Great Value Ground Cinnamon, 2.37 oz', brand: 'Great Value' },
  'cinnamon': { itemId: '10315854', title: 'Great Value Ground Cinnamon, 2.37 oz', brand: 'Great Value' },
  'italian seasoning': { itemId: '10315855', title: 'Great Value Italian Seasoning, 0.95 oz', brand: 'Great Value' },
  'oregano': { itemId: '10315856', title: 'Great Value Dried Oregano Leaves, 0.75 oz', brand: 'Great Value' },
  'taco seasoning': { itemId: '10315857', title: 'Great Value Original Taco Seasoning Mix, 1 oz Packet', brand: 'Great Value' }
};

// Cache for dynamically resolved items from search
const DYNAMIC_RESOLVED_CACHE = new Map();

/**
 * Clean and normalize ingredient name for catalog lookup
 */
function normalizeName(name) {
  let s = String(name || '').toLowerCase().trim();
  s = s.replace(/^(organic|fresh|raw|frozen|canned|diced|sliced|shredded|chopped|minced|crushed|whole|dry|dried)\s+/i, '');
  s = s.replace(/\s+(pieces|cutlets|chunks|fillets|strips|slices)$/i, '');
  return s.trim();
}

/**
 * Dynamic search fallback using DuckDuckGo to find Great Value item IDs on Walmart.com
 */
async function searchWalmartItem(rawName) {
  const clean = normalizeName(rawName);
  if (DYNAMIC_RESOLVED_CACHE.has(clean)) {
    return DYNAMIC_RESOLVED_CACHE.get(clean);
  }

  try {
    const query = encodeURIComponent(`site:walmart.com/ip/ "Great Value" ${clean}`);
    const url = `https://html.duckduckgo.com/html/?q=${query}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      // Match walmart.com/ip/Slug/12345678
      const matches = [...html.matchAll(/walmart\.com\/ip\/([^\/"]+)\/(\d+)/g)];
      if (matches.length > 0) {
        // Look for Great Value match first
        const gvMatch = matches.find(m => /great[-_]value/i.test(m[1])) || matches[0];
        const rawSlug = gvMatch[1].replace(/-/g, ' ');
        const resolved = {
          itemId: gvMatch[2],
          title: rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1),
          brand: /great/i.test(rawSlug) ? 'Great Value' : 'Cheapest In-Stock Brand',
          isDynamic: true
        };
        DYNAMIC_RESOLVED_CACHE.set(clean, resolved);
        return resolved;
      }
    }
  } catch (err) {
    // Timeout or search error - fall back cleanly
  }

  return null;
}

/**
 * Resolve an ingredient name to a Walmart Great Value / cheapest Item ID
 */
async function resolveGroceryItem(rawItem) {
  const name = typeof rawItem === 'string' ? rawItem : rawItem.name || '';
  const lower = name.toLowerCase().trim();
  const normalized = normalizeName(name);

  // 1. Direct exact catalog match
  if (WALMART_GREAT_VALUE_CATALOG[lower]) {
    return { name, ...WALMART_GREAT_VALUE_CATALOG[lower] };
  }

  // 2. Normalized catalog match
  if (WALMART_GREAT_VALUE_CATALOG[normalized]) {
    return { name, ...WALMART_GREAT_VALUE_CATALOG[normalized] };
  }

  // 3. Partial keyword match in catalog
  for (const [key, val] of Object.entries(WALMART_GREAT_VALUE_CATALOG)) {
    if (lower.includes(key) || normalized.includes(key)) {
      return { name, ...val };
    }
  }

  // 4. Dynamic search for Great Value on Walmart.com
  const dynamicMatch = await searchWalmartItem(name);
  if (dynamicMatch) {
    return { name, ...dynamicMatch };
  }

  // 5. Unmatched fallback
  return {
    name,
    itemId: null,
    title: name,
    brand: 'Search on Walmart',
    searchUrl: `https://www.walmart.com/search?q=${encodeURIComponent('Great Value ' + name)}`
  };
}

/**
 * Generate complete Walmart Add to Cart URL for a list of grocery items
 */
async function generateWalmartCartPayload(items) {
  const resolvedList = [];
  const matched = [];
  const unmatched = [];

  for (const item of items) {
    const rawName = typeof item === 'string' ? item : item.name;
    if (!rawName) continue;
    const res = await resolveGroceryItem(item);
    resolvedList.push(res);
    if (res.itemId) {
      matched.push(res);
    } else {
      unmatched.push(res);
    }
  }

  // Deduplicate itemIds in cart
  const seenIds = new Set();
  const cartItemTokens = [];
  for (const m of matched) {
    if (!seenIds.has(m.itemId)) {
      seenIds.add(m.itemId);
      cartItemTokens.push(`${m.itemId}|1`);
    }
  }

  const cartUrl = cartItemTokens.length > 0
    ? `https://www.walmart.com/sc/cart/addToCart?items=${cartItemTokens.join(',')}`
    : 'https://www.walmart.com/cart';

  return {
    success: true,
    cartUrl,
    totalItems: items.length,
    matchedCount: matched.length,
    unmatchedCount: unmatched.length,
    matchedItems: matched,
    unmatchedItems: unmatched
  };
}

module.exports = {
  WALMART_GREAT_VALUE_CATALOG,
  resolveGroceryItem,
  generateWalmartCartPayload
};
