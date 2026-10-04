// Complete Digitized Cookbook: "M & M's Family Favorites" by Anne Mackenzie
// Organized in the exact category and page order of the cookbook Table of Contents.

export const COOKBOOK_META = {
  title: "M & M's Family Favorites",
  subtitle: "All of Our Most Beloved Recipes",
  author: "Anne Mackenzie",
  dedication:
    "This book is dedicated to the friends, family, and acquaintances who have aided in building our special arsenal of favorites. Whether they're still in our lives, or they've come and gone, the recipes remain to be enjoyed and passed on."
};

export const COOKBOOK_CATEGORIES = [
  { id: "Breakfast", label: "Breakfast", page: 4 },
  { id: "Appetizers", label: "Appetizers", page: 11 },
  { id: "Main Dishes", label: "Main Dishes", page: 21 },
  { id: "Pasta", label: "Pasta", page: 41 },
  { id: "Fish/Seafood", label: "Fish/Seafood", page: 50 },
  { id: "Stupid Simple Suppers", label: "Stupid Simple Suppers", page: 55 },
  { id: "Soup", label: "Soup", page: 57 },
  { id: "Sides", label: "Sides", page: 62 },
  { id: "Desserts", label: "Desserts", page: 67 },
  { id: "Holiday Treats", label: "Holiday Treats", page: 78 },
  { id: "Freezer Prep Meals", label: "Freezer Prep Meals", page: 85 }
];

export const COOKBOOK_RECIPES = [
  // ==========================================
  // 1. BREAKFAST (Pages 4-10)
  // ==========================================
  {
    id: "mackies-avocado-toast",
    title: "Mackie's Avocado Toast",
    category: "Breakfast",
    page: 5,
    author: "Mackie",
    notes: "",
    ingredients: [
      "Bread",
      "Avocado",
      "Eggs (1-2)",
      "Shredded Cheese",
      "Primal Kitchen Chipotle Lime Avocado Mayo",
      "Onion powder, garlic salt, pepper, chipotle seasoning"
    ],
    steps: [
      "Halve and Slice Avocado (don't mash)",
      "Warm skillet over medium heat",
      "Toast bread",
      "Heat hand full of cheese in Skillet spread out but solid about the size/shape of bread",
      "Add 1-2 eggs opposite/next/touching the cooking cheese, season with Onion powder, garlic salt, pepper, chipotle seasoning",
      "Apply Chipotle lime mayo to Toast",
      "Place avocado slices on toast",
      "Once egg is appropriately fried, flip the cooked cheese up on the egg then place the whole fried egg and cheese beauty on top of toast.",
      "Boom, yum"
    ]
  },
  {
    id: "bfast-hash",
    title: "Bfast Hash",
    category: "Breakfast",
    page: 6,
    author: "Mackie",
    notes: "Chicken sausage (Flavors we like: Mango habanero-Mike does not say is too spicy. Spinach mozzarella is really good but hard to find, and multiple apple variants)",
    ingredients: [
      "3-4 sweet potatoes",
      "Full dozen eggs",
      "Avocado",
      "Sweet peppers (Bag of little ones) or 2 bell peppers (red & yellow)",
      "Mushrooms",
      "Chicken sausage (Mango habanero, Spinach mozzarella, or apple)",
      "1 onion",
      "Shredded cheese or feta",
      "Parmesan cheese (for topping)"
    ],
    steps: [
      "Prep: Rinse and dice sweet potatoes, mushrooms, and peppers, halve and dice avocado",
      "Cook sweet potatoes over medium heat seasoned with: Onion powder, garlic powder, salt, pepper",
      "In one pan: initiate heat first to sear diced chicken sausage a little bit then add rinsed and chopped mushrooms (No olive oil necessary with non stick pans and mushrooms...)",
      "In a second pan: Same but add the peppers and onion",
      "Season both pans with garlic powder, onion powder, and pepper",
      "Once everything is cooked, split sweet potatoes in half to add to each other skillet",
      "Use now empty skillet for eggs: fry eggs with seasoning: same as above, or adapt as you like. Top eggs with cheese",
      "Plate mixture, top with parm, enjoy!"
    ]
  },
  {
    id: "christmas-quiche",
    title: "Christmas Quiche",
    category: "Breakfast",
    page: 7,
    author: "Taylor Blair",
    yield: "5",
    notes: "A Blair Christmas Morning Tradition. Can substitute cheese flavor or veggie: Mikey likes to replace pepper with mushroom and sometimes pepperjack with swiss. Key is to keep the ratio the same: 1 c meat, 1 c veggie, 1c cheese, 1c half/half",
    ingredients: [
      "1 8 oz block pepperjack cheese (or swiss), diced into 1 C cubes",
      "1 bell pepper (green) or mushrooms, diced into 1 C worth",
      "1 cup ham cubes",
      "4 large eggs",
      "1 cup half and half",
      "1 pie crust",
      "Seasonings: salt, pepper, onion powder, nutmeg"
    ],
    steps: [
      "Roll out pie crust a bit to fit into dish well with edges pinched over",
      "Blind bake pie crust at 450 for 10 min: puncture crust all over and weight down the bottom with wax paper between weights and crust. Crust should only be slightly golden, don't over do it or it'll be burnt by end. (Extra tip: Can cut a foil ring to put around edge to further prevent burning during blind bake.)",
      "Reduce oven to 350",
      "Combine diced cheese, pepper, ham, eggs, half/half, and seasonings and fill crust, whisk for ~1 min",
      "Bake at 350 for 55-65 min (Check at 45 min mark), can use the foil ring pie crust shield here as well to prevent burning edges."
    ]
  },
  {
    id: "mackies-pancakes",
    title: "Mackie's Pancakes",
    category: "Breakfast",
    page: 8,
    author: "Mackie",
    yield: "1 serving of 4 pancakes",
    notes: "Protein powder FREE.. protein pancakes! 32G protein per serving - NO cottage cheese taste. 440 calories, 32g protein, 36g carbs, 18g fat",
    ingredients: [
      "1/2 cup old fashioned rolled oats",
      "1/2 cup full fat cottage cheese (4%)",
      "2 large eggs",
      "Splash of vanilla extract",
      "Small pinch of sea salt",
      "1 tsp Cinnamon",
      "Desired fruit or chocolate chips",
      "Syrup (for topping)"
    ],
    steps: [
      "Blend together oats, cottage cheese, eggs, vanilla, salt, and cinnamon",
      "Pour in hot pan in desired pancake sizes",
      "Quickly distribute fruit or chocolate chips into each pancake (If doing them all the same, then can mix them into batter before pouring)",
      "Once bubbling, flip",
      "Top with desired fruit/syrups"
    ]
  },
  {
    id: "super-simple-bfast-quesadilla",
    title: "Super Simple Bfast Quesadilla",
    category: "Breakfast",
    page: 9,
    author: "Mackie",
    notes: "burrito size tortilla: 4-5 eggs | taco size tortilla: 2-3 eggs",
    ingredients: [
      "Tortillas of choice (burrito or taco size)",
      "Eggs (2-5 depending on tortilla size)",
      "Shredded cheese of choice",
      "Desired Toppings: Spinach, ham, bacon or turkey",
      "Desired sauce: Salsa, chipotle aioli"
    ],
    steps: [
      "Crack eggs in hot greased pan",
      "Season with salt/pepper/garlic/onion powder",
      "Lay tortilla over eggs, gently press to break yolks",
      "Fry a few minutes",
      "Flip and add cheese and desired toppings, fold into quesadilla, continue to fry until golden"
    ]
  },
  {
    id: "bfast-burritos",
    title: "Bfast Burritos",
    category: "Breakfast",
    page: 10,
    author: "Mackie",
    notes: "Eggs (~1 egg per burrito maybe? I think you can stretch them out more by adding some cream or milk to the eggs)",
    ingredients: [
      "Tyson precooked, crumbled turkey breakfast sausage",
      "Mushrooms",
      "Peppers (Bag of little sweet peppers or 1 red and 1 yellow bell pepper)",
      "Eggs",
      "Normal shredded cheese",
      "Plastic Wrapped American Cheese Slices",
      "Chipotle Mayo from Hy-Vee",
      "Tortillas"
    ],
    steps: [
      "First cook scrambled eggs and set aside, then:",
      "Heat skillet over medium heat",
      "Can cook in one skillet yours then mine or in two skillets at once for: Sausage and mushrooms / Sausage and peppers",
      "Then lay out tortillas and build:",
      "Open and tear into halves the plastic wrapped cheese: do 1/2 slice per burrito, a stripe of chipotle mayo, egg/sausage/veggie filling, then top with some normal shredded cheese, fold and roll.",
      "Wrap and store appropriately."
    ]
  },

  // ==========================================
  // 2. APPETIZERS (Pages 11-19)
  // ==========================================
  {
    id: "cowboy-caviar",
    title: "Cowboy Caviar",
    category: "Appetizers",
    page: 12,
    author: "Remmi Hatchet",
    notes: "We personally prefer it with chicken, no beans, and no onion.",
    ingredients: [
      "Red or white wine vinegar",
      "Olive oil",
      "Garlic, pepper, salt, Italian seasoning",
      "Honey",
      "Lime (juiced)",
      "Chicken, cooked and diced",
      "Sweet peppers, diced",
      "Corn",
      "Mozzarella, diced",
      "Cherry tomatoes, diced",
      "Cilantro, diced",
      "Tortilla chips"
    ],
    steps: [
      "Combine vinegar, olive oil, seasonings, honey and lime to taste.",
      "Combine all chopped ingredients",
      "Toss with sauce and garnish with cilantro",
      "Serve with Tortilla chips"
    ]
  },
  {
    id: "green-chili-chicken-dip",
    title: "Green Chili Chicken Dip",
    category: "Appetizers",
    page: 13,
    author: "Delaney",
    notes: "Chicken: could use a rotisserie chicken or could cook chicken breast in crockpot then shred and continue with recipe. If using precooked chicken: dip could also easily be baked.",
    ingredients: [
      "1 tbsp olive oil",
      "1/2 c chopped onion",
      "1 medium poblano pepper, seeded and chopped",
      "2 cloves garlic, minced",
      "3 cups cooked, shredded chicken",
      "1 jar (16 oz) salsa Verde Tomatillo sauce",
      "8 oz cream cheese",
      "2 c shredded Monterey Jack",
      "1 tsp chili powder",
      "1/2 tsp ground cumin",
      "1 c sour cream",
      "2 tbsp fresh cilantro",
      "Diced tomatoes",
      "Sliced Jalapeño pepper",
      "Tortilla chips for serving"
    ],
    steps: [
      "Heat oil in crockpot and sauté onion and pepper",
      "Add chicken, salsa, cream cheese, shredded cheese, chili powder, and cumin.",
      "Cook on low for 2-2.5 hours",
      "Serve with desired chips"
    ]
  },
  {
    id: "crack-dip",
    title: "Crack Dip",
    category: "Appetizers",
    page: 14,
    author: "Taylor Blair",
    notes: "I prefer less bacon, Taylor likes more.",
    ingredients: [
      "32 oz Oikos Plain Greek Yogurt",
      "1 bag fine shredded cheddar cheese",
      "1-2 packs ranch dip mix",
      "Chopped green onion",
      "~4.5 oz bacon bits",
      "Ruffles or Carrots (for serving)"
    ],
    steps: [
      "Mix all together. Allow to sit in fridge over night if possible. Serve with Ruffles or Carrots."
    ]
  },
  {
    id: "oyster-party-crackers",
    title: "Oyster Party Crackers",
    category: "Appetizers",
    page: 14,
    author: "Wanda Woofter",
    notes: "A childhood staple!",
    ingredients: [
      "12 oz oyster crackers",
      "2/3 C Vegetable or olive oil",
      "1 pkg ranch dressing powder"
    ],
    steps: [
      "Mix oil and ranch together in zip lock or container until dissolved. Add crackers and Toss until well coated. Enjoy."
    ]
  },
  {
    id: "sausage-stuffed-jalapenos",
    title: "Sausage Stuffed Jalapenos",
    category: "Appetizers",
    page: 16,
    author: "Mackie",
    yield: "20",
    notes: "",
    ingredients: [
      "10 Jalapenos, halved and seeds scraped",
      "1/2 lb breakfast sausage",
      "4 oz cream cheese",
      "1 c shredded cheese (cheddar or colby jack)",
      "1/3 c grated parmesan",
      "Garlic powder, Onion powder, Crushed red pepper flakes, Italian Seasoning"
    ],
    steps: [
      "Halve and Clean Jalapenos",
      "Brown Sausage and mix with cheese, garlic, crushed red pepper (Careful, can already be hot), and italian",
      "Pack mixture into jalapenos",
      "Place on a elevated grate on top of a baking sheet if able (This allows grease to drain rather than peppers soaking in it)",
      "Bake at 425 for 20 min",
      "Top with a sprinkle of shredded cheese, enjoy!"
    ]
  },
  {
    id: "cheesy-tomato-dip",
    title: "Cheesy Tomato Dip",
    category: "Appetizers",
    page: 17,
    author: "Wanda Woofter",
    notes: "Can simplify to literally tomatoes and Boursin, still delicious!",
    ingredients: [
      "1 container cherry/grape tomatoes, halved",
      "1 Garlic and Herb Boursin Cheese",
      "1 tbsp olive oil",
      "1/2 tsp salt & 1/2 tsp pepper",
      "1 tbsp dried Italian seasonings",
      "Fresh basil",
      "Balsamic glaze",
      "Sourdough bread, baked crostinis, or pita chips (for serving)"
    ],
    steps: [
      "Preheat the oven to 400 degrees F (200 degrees C).",
      "Combine tomatoes, olive oil, and seasonings in a baking dish. Make a well in the center, and drop in the Boursin cheese.",
      "Bake in the preheated oven until the cheese starts to lightly brown, 35 to 40 minutes. Use a fork to mash the cheese and then stir some of the tomatoes into it.",
      "Garnish with fresh chopped basil or balsamic glaze, and serve immediately."
    ]
  },
  {
    id: "sweet-n-savory-meatballs",
    title: "Sweet N Savory Meatballs",
    category: "Appetizers",
    page: 18,
    author: "Someone at Retina Associates",
    notes: "Party Pleaser",
    ingredients: [
      "1 Jar Grape jelly",
      "1 Jar BBQ (Sweet Baby Rays Original)",
      "1-2 bags frozen meatballs"
    ],
    steps: [
      "Combine in crockpot on low for the day or high for a couple hours. Mix occasionally. Enjoy."
    ]
  },
  {
    id: "taylors-lil-smokies",
    title: "Taylor's Lil Smokies",
    category: "Appetizers",
    page: 18,
    author: "Taylor Blair",
    notes: "Could add cheese inside them as well",
    ingredients: [
      "2 pkgs Hillshire Farm Cheddar Lit'l Smokies",
      "1 pkg Rhodes bake-n-serv yeast dinner rolls"
    ],
    steps: [
      "Thaw out dinner rolls. Strain smokies from juice and pat dry. Rip apart rolls into thirds.",
      "Wrap each smokie with roll portion and place on greased baking sheet.",
      "Bake low and slow, ~350-375 for around 45 minutes until just golden.",
      "Wrap in a kitchen towel in a bowl or enclosed baking dish to keep warm."
    ]
  },

  // ==========================================
  // 3. MAIN DISHES (Pages 21-39)
  // ==========================================
  {
    id: "loras-chicken-pot-pie",
    title: "Lora's Chicken Pot Pie",
    category: "Main Dishes",
    page: 22,
    author: "Lora",
    yield: "5",
    notes: "Did 1/2 cup heavy cream and 1/2 milk. Ended up adding a little extra broth and milk to thin it up. Little dry on the reheat. More liquid next time.",
    ingredients: [
      "3 tbsp butter",
      "1/4 cup flour",
      "1 1/4 cup chicken broth",
      "1 cup heavy cream (or 1/2 cream, 1/2 milk)",
      "2 cups diced or shredded chicken (cooked)",
      "16 oz veggies (corn, carrots & green beans)",
      "1/4 tsp poultry seasoning",
      "2 pie crusts"
    ],
    steps: [
      "Pull crust out of fridge (easier to work with if it's closer to room temp)",
      "Prep veggies and chicken as needed",
      "Preheat oven to 425",
      "Make roux: melt butter in large sauce pan or Dutch oven",
      "Add flour slowly, whisking til smooth/thick",
      "Slowly add in milk/cream and broth, bring temp up and stir til thick and bubbly",
      "Add seasoning",
      "Stir in cooked veggies and meat",
      "Remove from heat",
      "Flour bottom of casserole dish and put in bottom pie crust",
      "Pour in mix",
      "Add crust on top - make sure crust tops edges some or it will fall down",
      "Bake for 25-30 min at 425"
    ]
  },
  {
    id: "mikeys-favorite-buffalo-chicken-wraps",
    title: "Mikey's Favorite Buffalo Chicken Wraps",
    category: "Main Dishes",
    page: 23,
    author: "Mike and Mackie",
    notes: "A Weekly Staple. Mackie subs for grilled chicken, but the Just Bare bites for Mike.",
    ingredients: [
      "Burrito size tortillas",
      "Just Bare lightly breaded chicken bites (or grilled chicken)",
      "Spinach",
      "Banana Peppers, chopped",
      "Cherry or Grape tomatoes, halved",
      "Shredded cheese (fiesta or Monterey Jack)",
      "Ranch dressing",
      "Franks hot or wing sauce (Mike prefers Wing)"
    ],
    steps: [
      "Air fry necessary portion of chicken based on how many wraps you need (Small handful for each)",
      "Dice tomatoes and banana peppers, rip stems off spinach",
      "Lay wrap out and layer with cheese, spinach, drizzle ranch, tomatoes, banana peppers (Mackie, not Mike), and chicken",
      "Tuck ends and roll tight",
      "Spray skillet lightly with cooking oil and heat over medium heat",
      "Briefly fry wraps just to golden, spinach will wilt if too long",
      "In a small dish, combine ranch and hot sauce to taste for dipping"
    ]
  },
  {
    id: "cilantro-lime-baked-tacos",
    title: "Cilantro Lime Baked Tacos",
    category: "Main Dishes",
    page: 24,
    author: "Mackie",
    notes: "",
    ingredients: [
      "1 rotisserie Chicken, shredded",
      "4 oz cream cheese",
      "1 tsp each: cumin, chipotle pepper powder, garlic powder, onion powder, pepper, salt",
      "2 limes, juiced",
      "1/2 red onion, finely diced",
      "1/2 C diced cilantro leaves",
      "12 fajita tortillas",
      "8 oz shredded Monterey Jack cheese",
      "Cooking oil spray"
    ],
    steps: [
      "Warm cream cheese in microwave - mix together all filling ingredients",
      "Lay tortillas out on parchment lined baking sheet, spray one side with oil and lay that side down",
      "Fill inside of tacos with shredded cheese and chicken mixture",
      "Fold tacos in half & squish to closed",
      "Bake at 400 degrees 15-20 min"
    ]
  },
  {
    id: "honey-chipotle-chicken-tacos",
    title: "Honey Chipotle Chicken Tacos",
    category: "Main Dishes",
    page: 25,
    author: "Mackie and Mike",
    notes: "",
    ingredients: [
      "200 g chicken breast, thinly sliced",
      "1.5 chipotles in adobo, finely chopped",
      "Olive oil",
      "Spices: salt, black pepper, paprika, garlic powder, ground cumin, turmeric",
      "2 tsp honey",
      "6 small tortillas",
      "200 g shredded cheese (mozzarella, cheddar, or mix)",
      "3 tsp mayonnaise",
      "50 ml buttermilk"
    ],
    steps: [
      "Prep: In a bowl, mix the chicken with olive oil, finely chopped chipotle, and all the spices salt, pepper, paprika, garlic, cumin, turmeric, and honey. Stir well and let it marinate for a few minutes.",
      "Cook Chicken: Heat a pan over medium heat with a little olive oil. Add the chicken and sauté for 6-8 minutes until golden and cooked through. Remove from heat and set aside.",
      "Assemble: Heat a clean non-stick pan or crepe maker over medium heat. Lightly brush with olive oil. Sprinkle some cheese directly on the pan, then place a tortilla on top. Add a layer of cheese, then chicken, then another small sprinkle of cheese before folding in half. Toast each taco on both sides until golden brown and crispy, and the cheese has melted.",
      "Make Sauce: In a small bowl, combine mayonnaise, buttermilk, honey, chopped chipotle, and spices. Add a little water if needed to thin the sauce. Mix until smooth and creamy.",
      "Serve: Drizzle the honey chipotle sauce over the tacos or serve it on the side for dipping. Garnish with a sprinkle of fresh cilantro or a squeeze of lime if desired."
    ]
  },
  {
    id: "potato-tacos",
    title: "Potato Tacos",
    category: "Main Dishes",
    page: 26,
    author: "Valerie McDaniel",
    notes: "The Valentina hot sauce is a must for me.",
    ingredients: [
      "Soft Taco corn tortillas",
      "Chorizo",
      "Mashed potatoes (or Idahoan instant: Buttery, cheese, or loaded)",
      "~1 c Shredded cheese (cheddar, MJ, or fiesta)",
      "Shredded Lettuce",
      "Tomatoes, diced",
      "Cooking oil (vegetable)",
      "Guacamole",
      "Valentina Mexican Hot Sauce"
    ],
    steps: [
      "Make your preferred mashed potatoes, I like instant Idahoan, mix with shredded cheese",
      "Cook chorizo in pan and then drain grease/move to bowl with paper towels to absorb excess",
      "Heat oil in pan over medium high heat until flicked water sizzles on it",
      "Briefly microwave tortillas wrapped in damp paper towel to soften them",
      "Coat tortillas with potato mixture on one full side and fold",
      "Fry tacos until golden on each side",
      "Remove and place on paper towels to absorb excess oil",
      "Peel open and fill with meat and toppings"
    ]
  },
  {
    id: "sweet-potato-taco-bowls",
    title: "Sweet Potato Taco Bowls",
    category: "Main Dishes",
    page: 27,
    author: "Mackie",
    notes: "Desired meat: Ground turkey, beef or pork (I've rotated each and you've liked them all)",
    ingredients: [
      "Ground turkey, beef or pork",
      "1 packet taco seasoning",
      "2-3 sweet potatoes",
      "Brown rice",
      "Carrots (full size, peeled and diced)",
      "Cherry tomatoes, halved",
      "Shredded cheese or feta",
      "Sour cream or mayo (for crema/sauce)",
      "Avocado, diced",
      "2 limes",
      "Cilantro"
    ],
    steps: [
      "1.5 cups rice in rice cooker with 2.5 cups water - start cooking this first",
      "Dice sweet potatoes and get cooking on medium heat on stove with seasoning: Garlic powder, onion powder, salt, pepper",
      "Skin and dice carrots, place on baking sheet seasoned either with honey, salt and pepper - Bake on top rack on 400 degrees until crispy",
      "Brown and drain meat",
      "Add 1/4 - 1/2 cup water to meat with seasoning packet, stir and simmer",
      "Half cherry tomatoes, zest and quarter limes, chop cilantro",
      "In a small bowl, make mop of sour cream, juice from one full lime, large pinch of cilantro, salt and pepper until a drizzle consistency.",
      "Once rice, sweet potatoes, and carrots are done, build bowls, top with avocado, cheese and sauce, enjoy."
    ]
  },
  {
    id: "homemade-chicken-parm",
    title: "Homemade Chicken Parm",
    category: "Main Dishes",
    page: 28,
    author: "Kathy Dobbs",
    notes: "The one red sauce recipe Taylor Blair actually likes",
    ingredients: [
      "Chicken breast, beaten thin",
      "3 eggs",
      "1 c dry bread crumbs",
      "1/2 c parmesan cheese",
      "2 tbsp soy sauce",
      "3 c tomato sauce",
      "1/2 c vegetable oil",
      "2-4 cloves garlic",
      "1 onion",
      "2 bay leaves",
      "Mozzarella cheese",
      "Pasta noodles",
      "Garlic Bread"
    ],
    steps: [
      "Pat dry and Pound chicken thin",
      "Dip chicken in egg mix (3 beaten eggs + onion, garlic, italian, paprika) then crumb mix (1c bread crumbs + 1/2c parmesan + seasonings)",
      "Heat oil with 2 cloves chopped onion in skillet",
      "Brown Chicken ~1 minute each side, medium high heat",
      "Transfer chicken to baking dish",
      "Meanwhile in saucepan: Saute remaining garlic, add tomato sauce, bay leaves, soy sauce, and seasonings, simmer",
      "Top chicken with sauce, bay leaves and parmesan",
      "Cover and Bake at 325 for 30 min",
      "Cook pasta",
      "Uncover, Remove Bay leaves, top with mozzarella and continue cooking until melted",
      "Serve over noodles with sauce and garlic bread"
    ]
  },
  {
    id: "kentucky-hot-brown-sliders",
    title: "Kentucky Hot Brown Sliders",
    category: "Main Dishes",
    page: 29,
    author: "Mackie",
    yield: "Enough for a Party",
    notes: "Derby Day Favorite",
    ingredients: [
      "2 pkg Hawaiian rolls, sliced top/bottom",
      "3 tbsp + 1/4 C salted butter",
      "3 tbsp flour",
      "3 C Heavy Whipping Cream",
      "1/2 C Pecorino Romano Cheese",
      "Pinch Nutmeg",
      "1 Clove Garlic, minced",
      "8 oz deli turkey",
      "8 slices bacon, cooked",
      "2 Roma tomatoes, sliced",
      "Parsley"
    ],
    steps: [
      "In saucepan: Melt 1.5 tbsp butter, slowly whisk in flour - simmer 2 min on medium-low heat, stirring frequently, whisk in heavy cream - simmer 2-3 more min on medium.",
      "Remove from heat, slowly whisk in cheese, add nutmeg, salt and pepper, set aside",
      "Place minced garlic and 1/4c butter in additional sauce pan over medium, sauté and heat until melted",
      "Place bottom half of rolls in ungreased pan - brush with butter mixture, layer turkey and tomatoes, pour half the sauce, top with bacon and top of bread. Pour butter/garlic over top",
      "Cover with foil and bake at 350 for 10 min",
      "Remove foil, sprinkle with cheese, bake 2 more min, garnish with parsley, cut and serve with remaining sauce for dipping."
    ]
  },
  {
    id: "mikeys-famous-charred-lamb-chops",
    title: "Mikey's Famous Charred Lamb Chops",
    category: "Main Dishes",
    page: 30,
    author: "Michael Vane",
    notes: "Can also be cooked in cast iron or baked with broil to finish",
    ingredients: [
      "1-2 racks of bone-in lamb chops (Costco)",
      "Lemon Pepper",
      "Montreal Steak Seasoning"
    ],
    steps: [
      "Heat grill",
      "Season well with lemon pepper and Montreal",
      "Grill to medium rare-medium with charring on the outsides"
    ]
  },
  {
    id: "mackies-magic-grilled-cheese",
    title: "Mackie's Magic Grilled Cheese",
    category: "Main Dishes",
    page: 31,
    author: "Mackie",
    notes: "Obviously serve with tomato soup: We love Amy's Chunky Tomato Bisque. Feel free to mix up the cheese types but the musts: Sourdough, pepperjack, the chive cream cheese, and slicing them all nice and thick.",
    ingredients: [
      "1 Loaf Sourdough Bread",
      "1 block real aged cheddar",
      "1 block pepperjack",
      "1 block smoked gouda",
      "Chive and Onion Cream Cheese",
      "Garlic and Herb butter",
      "Amy's Chunky Tomato Bisque (optional side)"
    ],
    steps: [
      "Slice blocks into slices thicker than store bought sandwich cheese",
      "Coat inside of at least one slice for each sandwich with cream cheese",
      "1 Layer of each cheese or do various combinations of them",
      "Warm skillet over medium high heat",
      "Coat outsides with thin layer of herbed butter",
      "Fry in skillet COVERED to melt, ~2 min/side",
      "Check frequently: If they get TOO MELTY, they'll slide apart and cheese will run out - Uncover. If they don't get MELTY ENOUGH - then boo.",
      "Gradually turn down the heat, or the later ones will burn."
    ]
  },
  {
    id: "monterey-jack-un-fried-chicken",
    title: "Monterey Jack Un-Fried Chicken",
    category: "Main Dishes",
    page: 32,
    author: "HelloFresh",
    yield: "2",
    notes: "If using chicken breasts rather than cutlets, cut in half to thin them, and beat/pound to tenderize. Serve with desired sides.",
    ingredients: [
      "10 oz chicken cutlets (or breasts)",
      "1/4 c panko breadcrumbs",
      "1/4 c Monterey Jack cheese",
      "4 tbsp Mayo",
      "1 tsp sriracha",
      "1 tbsp butter",
      "1/2 tbsp ranch seasoning",
      "Olive oil, salt, pepper"
    ],
    steps: [
      "Melt 1 tbsp butter in microwave safe bowl 30 sec until melted",
      "Stir in Panko, cheese and ranch powder, salt, pepper",
      "Pat chicken dry; season with salt and pepper",
      "Coat tops with 1 tsp mayo and mound with breadcrumb mixture",
      "Bake for 15-18 min at 425 until chicken cooked through and golden on top (Top rack if alone, middle rack if already roasting veggies on top)",
      "In separate small bowl, mix remaining mayo, sriracha, salt, and pepper to taste for dipping"
    ]
  },
  {
    id: "anniversary-beef-short-rib",
    title: "Anniversary Beef Short Rib",
    category: "Main Dishes",
    page: 33,
    author: "Mackie & Mike",
    notes: "Based off of our FAVORITE meal, had twice for our anniversary in Chattanooga TN, Alleia. They had a Cherry Glaze which I'll eventually add here.",
    ingredients: [
      "3-4 lb bone-in beef short ribs (English cut preferred)",
      "2 tbsp olive oil",
      "1 large onion (diced into 1/2-inch pieces)",
      "3 garlic cloves (crushed)",
      "2 tbsp tomato paste (Muir Glen)",
      "2 celery stalks (diced)",
      "2 carrots (diced)",
      "3 cups beef stock (low sodium)",
      "1 sprig fresh thyme",
      "2 bay leaves",
      "1 sprig fresh oregano",
      "2 cups Cabernet Sauvignon (or other dry red wine)",
      "Mashed potatoes (for serving)"
    ],
    steps: [
      "Pat dry and season ribs, wrap in plastic, set over night.",
      "Heat 2 tablespoons of olive oil in a 6 Qt Dutch oven over medium-high heat and brown the meat, cooking each side for 5-6 minutes until a nice crust forms, then transfer to plate and set aside.",
      "In the same Dutch oven, add 1 diced onion and cook for 8-10 minutes until it becomes translucent and softened.",
      "Add 2 stalks of diced celery and 2 diced carrots, cooking for an additional 3-5 minutes to allow them to soften and release their flavors.",
      "Stir in 3 smashed garlic cloves and 2 tablespoons of tomato paste, cooking for a few more minutes until the tomato paste darkens slightly.",
      "Pour in 2 cups of wine, bring to a boil, then lower the heat to medium and simmer until the wine reduces by half, about 15-20 minutes.",
      "Add 3 cups of beef broth and stir well to combine with the reduced wine and vegetables.",
      "Return the browned meat to the pot, nestling it among the liquid, then add bay leaves, thyme, and oregano for flavoring.",
      "Cover with the lid and transfer the Dutch oven to your preheated oven - 350.",
      "Cook in the oven for 2 1/2 to 3 hours, or until the meat becomes tender and the flavors meld.",
      "Once cooked, transfer the meat to a plate and cover with foil to keep warm.",
      "Strain the sauce to remove and discard the cooked vegetables, leaving behind a smooth liquid.",
      "Pour this liquid back into the pot and simmer it on the stove until it thickens to your desired consistency, creating a rich and flavorful sauce to serve with the tender meat.",
      "Serve with mashed potatoes"
    ]
  },
  {
    id: "pesto-chicken",
    title: "Pesto Chicken",
    category: "Main Dishes",
    page: 34,
    author: "Mackie",
    notes: "Can serve with or without desired pasta",
    ingredients: [
      "Chicken Breast",
      "1 jar pesto",
      "1 full container cherry or grape tomatoes",
      "Minced garlic (2 cloves)",
      "Mozzarella (shredded or block)",
      "Olive oil"
    ],
    steps: [
      "Drizzle olive oil over thin sliced chicken breasts, season with salt, pepper, garlic, herbs",
      "Add large spoonful of pesto to both sides of chicken breasts",
      "In baking dish, toss 2 cups halved cherry tomatoes, 2 sliced garlic cloves, 4 tbsp olive oil, and 4 oz pesto",
      "Nestle chicken on top and bake at 425 for 20 min, until chicken hits 165 degrees.",
      "Top with Mozzarella, return to oven until melted"
    ]
  },
  {
    id: "easy-crockpot-french-dip-subs",
    title: "Easy Crockpot French dip Subs",
    category: "Main Dishes",
    page: 35,
    author: "Meals and Munchies",
    notes: "",
    ingredients: [
      "Beef Chuck Tender Roast",
      "1 can beef consomme or broth",
      "1 packet Lipton onion soup mix",
      "1 packet Au Jus gravy mix",
      "3 tbsp butter",
      "Hoagie buns",
      "Provolone cheese",
      "Mayo / chipotle mayo / garlic aioli",
      "Pepperoncinis or banana peppers"
    ],
    steps: [
      "Add meat, soup, mixes to crock pot and mix up",
      "Leave meat fat side up",
      "Add butter on top",
      "Cook on low for 8 hrs",
      "Shred meat into sauce and allow to thicken to desired consistency",
      "Fry some peppers in skillet as a topping (For Mackie, not Mike)",
      "Broil hoagie buns with mayo or desired sauce, peppers and provolone cheese, top with meat, serve with side of the juice"
    ]
  },
  {
    id: "sheet-pan-ciabatta-chicken",
    title: "Sheet Pan Ciabatta Chicken",
    category: "Main Dishes",
    page: 36,
    author: "Meals and Munchies",
    notes: "",
    ingredients: [
      "1.5-2 lbs Boneless, Skinless Chicken Thighs (about 6 thighs)",
      "16 oz Baby Tomatoes",
      "1 cup Feta Cheese, crumbled",
      "1 cup Fresh Mozzarella Pearls",
      "1 Large Ciabatta Loaf or 4-5 Ciabatta Rolls (10-12 oz)",
      "3 tbsp Olive Oil",
      "Garlic Powder, Italian Seasoning, Dash Garlic & Herb Blend, Paprika"
    ],
    steps: [
      "Preheat the oven to 425°F and lightly grease a large sheet pan or 9x12-inch baking dish.",
      "In a large mixing bowl, combine the baby tomatoes, feta cheese, mozzarella pearls, torn ciabatta bread, olive oil, garlic powder, Italian seasoning, garlic and herb seasoning, salt, and pepper.",
      "Toss everything together until the bread is lightly coated with the oil and seasonings.",
      "Spread the mixture evenly across the prepared baking dish or sheet pan. Arrange the bread pieces so they have some exposure to the heat, which helps them become crispy while baking.",
      "Pat the chicken thighs dry and drizzle with olive oil. Season both sides with garlic powder, Italian seasoning, paprika, salt, and pepper.",
      "Place the seasoned chicken thighs on top of the bread and tomato mixture, leaving as much of the bread exposed as possible.",
      "Bake for 25-30 minutes, or until the chicken reaches an internal temperature of 165°F and the tomatoes have softened and burst.",
      "Switch the oven to broil and cook for an additional 1-2 minutes, watching carefully, until the bread is golden and crispy and the cheese begins to brown.",
      "Remove from the oven and let rest for 5 minutes. Serve immediately."
    ]
  },
  {
    id: "air-fryer-chicken-thighs",
    title: "Air Fryer Chicken Thighs",
    category: "Main Dishes",
    page: 37,
    author: "Mackie",
    notes: "Have loved: Teriyaki, BBQ, and Italian. We usually serve with rice.",
    ingredients: [
      "Boneless, skinless chicken thighs (Walmart free range)",
      "Desired marinade: Teriyaki, BBQ, Italian Dressing, Lemon Pepper, or Lime Mojito",
      "Rice and veggies (for serving)"
    ],
    steps: [
      "Day Before: Marinate chicken in zip lock or bowl with desired marinade",
      "Day Of: Heat skillet on medium-high heat and sear thighs 2 minutes on each side",
      "Cook in air fryer (380 or 390, with basket papers to stay clean) for 8 minutes",
      "Flip and swipe some more marinade on them, cook 8 more minutes",
      "Serve with Rice and veggies ;)"
    ]
  },
  {
    id: "spinach-artichoke-chicken",
    title: "Spinach Artichoke Chicken",
    category: "Main Dishes",
    page: 38,
    author: "Mackie",
    notes: "Serve it over rice or with garlic noodles for the ultimate lazy-night win.",
    ingredients: [
      "1-2 lbs boneless skinless chicken breasts",
      "1 (10-16 oz) container spinach artichoke dip",
      "1 heaping cup shredded mozzarella or cheddar",
      "1-2 cups broccoli florets (fresh or frozen)",
      "Rice, noodles, or potatoes (optional for serving)"
    ],
    steps: [
      "Preheat oven to 375°F and grease a 9x13 baking dish.",
      "Pound chicken flat (optional, but helps it cook evenly).",
      "Lay chicken in the dish, scatter broccoli around it.",
      "Spread spinach artichoke dip evenly over the chicken and broccoli.",
      "Top with shredded cheese.",
      "Bake uncovered for ~30 minutes, or until the chicken is cooked through.",
      "Serve it over rice or with garlic noodles for the ultimate lazy-night win."
    ]
  },
  {
    id: "mediterranean-stuffed-chicken",
    title: "Mediterranean Stuffed Chicken",
    category: "Main Dishes",
    page: 39,
    author: "Mackie",
    notes: "A Mikey Favorite",
    ingredients: [
      "Chicken breasts",
      "Tomato basil flavored Feta Cheese",
      "Tomatoes (Pack of cherry/grape or 2-3 large tomatoes)",
      "Spinach",
      "Olive oil or butter"
    ],
    steps: [
      "Prep: Preheat oven to 380 degrees, pull out several toothpicks so you don't have to with chicken hands, rinse and slice tomatoes, rinse and pat dry chicken, grease baking sheet or dish",
      "Slice open chicken breasts, season with: Garlic powder, onion powder, ITALIAN seasoning, salt, pepper",
      "Layer: mash in a solid layer of feta, then spinach, then sliced tomatoes",
      "Close and secure with toothpicks",
      "Glaze chicken lightly with olive oil or melted butter",
      "Bake for 30ish minutes, ensure cooked thoroughly"
    ]
  },

  // ==========================================
  // 4. PASTA (Pages 41-48)
  // ==========================================
  {
    id: "rotel-fiesta-pasta",
    title: "Rotel Fiesta Pasta",
    category: "Pasta",
    page: 42,
    author: "Easy Recipes",
    notes: "",
    ingredients: [
      "12 oz rigatoni or penne pasta",
      "1 lb ground beef",
      "1 tbsp olive oil",
      "1 small onion, diced",
      "2 cloves garlic, minced",
      "1 can (10 oz) Rotel diced tomatoes with green chilies",
      "8 oz cream cheese, softened",
      "1 cup shredded cheddar cheese",
      "1/2 cup milk or heavy cream",
      "1 tsp taco seasoning",
      "Chopped parsley (for garnish)"
    ],
    steps: [
      "Cook the Pasta: Boil pasta in salted water until al dente. Drain and set aside.",
      "Brown the Meat: In a large skillet, heat olive oil over medium heat. Cook ground beef and diced onion until browned and cooked through. Drain excess fat.",
      "Add Garlic & Rotel: Stir in garlic and cook for 1 minute. Add Rotel tomatoes (with juice) and taco seasoning. Simmer for 2 minutes.",
      "Make it Creamy: Stir in cream cheese until melted, then add milk and shredded cheddar. Stir until smooth and creamy.",
      "Combine with Pasta: Add cooked pasta to the skillet and toss until fully coated and heated through."
    ]
  },
  {
    id: "mackies-spaghetti",
    title: "Mackie's Spaghetti",
    category: "Pasta",
    page: 43,
    author: "Mackie",
    notes: "Brown meat with onion (Full makes a lot, we CAN split it in half for now and half for later with or without the sauce mixed in or even cook the whole creation and then freeze totally ready spaghetti), *ADD diced zucchini half way through browning",
    ingredients: [
      "Thin spaghetti noodles",
      "2 jars Rao's spaghetti sauce (Marinara or Tomato Basil)",
      "1 lb Ground beef",
      "1 lb ground Italian sausage (Mild or medium)",
      "1-2 zucchini",
      "1 onion",
      "Texas toast",
      "Parmesan cheese (optional)"
    ],
    steps: [
      "Preheat oven per Texas toast instructions",
      "Chop zucchini",
      "Chop a couple chunks of onion to cook in sauce then remove",
      "Brown meat with onion (add diced zucchini halfway through browning)",
      "Drain grease",
      "Add sauce",
      "Add seasoning: Cinnamon, nutmeg (little), garlic, onion powder, a few red pepper flakes, Italian seasoning, some paprika, salt and pepper",
      "Simmer sauce a while, I like to add a little red wine",
      "Boil noodles with garlic, onion powder, salt and pepper in water.",
      "Make bread per box",
      "Mix together, top with parm, enjoy!"
    ]
  },
  {
    id: "mms-buffalo-chicken-mac-n-cheese",
    title: "M&M's Buffalo Chicken Mac n Cheese",
    category: "Pasta",
    page: 44,
    author: "Mike and Mackie",
    notes: "Mikey Preferences: Laughing Cow pepper jack cheese wedges, Franks Buffalo Wing Sauce (Not as hot as the plain hot sauce), Ritz crackers",
    ingredients: [
      "1 box favorite mac n cheese (Cracker Barrel)",
      "Just Bare lightly breaded chicken bites",
      "Franks hot sauce or buffalo wing sauce",
      "Laughing Cow cheese wedges (3) or cream cheese",
      "Crumble topper: Doritos or Ritz crackers",
      "Ranch dressing",
      "Shredded cheese for topping"
    ],
    steps: [
      "Cook Mac n Cheese per box",
      "Air fry a basket worth of chicken bites to crispy/golden ~10 min",
      "Dice chicken up into smaller bites",
      "Toss chicken in hot sauce",
      "Add Mac n Cheese to baking dish",
      "Cut up wedges of cheese into small bits and disperse through mac n cheese",
      "Mix chicken into baking dish",
      "Top with drizzle of ranch, shredded cheese, then handful of crumbled crackers",
      "Cover and bake at 350 for 15 min",
      "Uncover and bake 5 more min"
    ]
  },
  {
    id: "pork-sausage-rigatoni-rosa",
    title: "Pork Sausage Rigatoni Rosa",
    category: "Pasta",
    page: 45,
    author: "HelloFresh",
    notes: "Serve with garlic bread if desired",
    ingredients: [
      "6 oz Rigatoni Pasta",
      "1/2 small can Tomato Paste",
      "1 Zucchini, chopped",
      "4 tbsp Cream Cheese",
      "1 packet Chicken stock concentrate (or chicken stock)",
      "1 clove garlic, minced",
      "6 tbsp SHAVED parmesan cheese",
      "1 tsp chili flakes",
      "9 oz Italian sausage",
      "2 handfuls spinach"
    ],
    steps: [
      "Boil water and cook pasta",
      "Reserve 1 c pasta water then strain/rinse/set aside",
      "Trim and Dice Zucchini",
      "Peel and Mince Garlic",
      "Heat drizzle oil in pan on medium-high, add zucchini, season with salt and pepper, cook to golden/tender ~5-6 min, set aside.",
      "Heat oil again and cook sausage until almost done",
      "Stir in garlic and tomato paste, cook until fragrant and sausage is cooked through.",
      "Stir in cream cheese, stock, 1/2 c pasta water, 1 tbsp butter, spinach, 1/2 tsp sugar, and a pinch of chili flakes",
      "Remove from heat",
      "Add Rigatoni and Zucchini, stir in half the parmesan, season to taste. Can add more pasta water if needed until creamy and coated.",
      "Top with remaining parm and serve."
    ]
  },
  {
    id: "slow-cooker-meatball-tortellini-casserole",
    title: "Slow Cooker Meatball Tortellini Casserole",
    category: "Pasta",
    page: 46,
    author: "Mackie",
    notes: "Garlic bread or side salad as desired",
    ingredients: [
      "1 bag frozen meatballs",
      "1 bag tortellini",
      "2 cups marinara (Rao's)",
      "1 cup shredded mozzarella",
      "Spinach",
      "Italian seasoning, garlic powder, onion powder"
    ],
    steps: [
      "In crockpot: add meatballs, tortellini, pour marinara on top, sprinkle with seasoning.",
      "Cook on low for 4 hours",
      "Add desired amount of spinach and top with mozzarella for the last 30 minutes."
    ]
  },
  {
    id: "the-best-baked-spaghetti",
    title: "The Best Baked Spaghetti",
    category: "Pasta",
    page: 47,
    author: "Brandie @ The Country Cook",
    yield: "8 servings",
    notes: "Also known as Spasagna, inspired by Cheddar's restaurants. Alfredo coated spaghetti topped with meat sauce and cheese! Optional additions: zucchini, extra red sauce.",
    ingredients: [
      "1 pound spaghetti noodles",
      "1 pound ground beef (or 1/2 beef, 1/2 Italian sausage)",
      "26 oz jar spaghetti sauce (Rao's)",
      "16 oz jar alfredo sauce (Rao's)",
      "2 tsp Italian seasoning",
      "2 cups shredded mozzarella (+ fresh parm)"
    ],
    steps: [
      "Preheat oven to 350F degrees. Spray 9x13 baking dish with nonstick spray.",
      "Cook spaghetti noodles according to package directions. Drain noodles very well.",
      "While the spaghetti noodles are cooking, brown and crumble ground beef in a large sauce pan. Drain excess grease.",
      "Put ground beef back in pan and add spaghetti sauce. Stir to combine well.",
      "Meanwhile, once the cooked noodles are drained, put them back into the pot. Stir in alfredo (cheese) sauce and Italian seasoning.",
      "Stir well to thoroughly coat noodles.",
      "Place spaghetti noodles into prepared baking dish.",
      "Cover with spaghetti sauce mixture.",
      "Top with shredded mozzarella cheese.",
      "Cover with aluminum foil and bake for about 30 minutes (until cheese is melted and bubbly.)"
    ]
  },
  {
    id: "seafood-crack-pasta",
    title: "Seafood Crack Pasta",
    category: "Pasta",
    page: 48,
    author: "Mackie",
    notes: "A Mackie Favorite, Mike not so much.",
    ingredients: [
      "6-8 tomatoes, chopped",
      "1 C Heavy Whipping Cream",
      "1 C Chardonnay",
      "Desired Seafood: Shrimp, imitation lobster/crab, and scallops",
      "1 tbsp crushed red pepper",
      "3 cloves garlic, minced",
      "Handful fresh basil, chopped",
      "1 box thin spaghetti",
      "Fresh grated parmesan",
      "Garlic bread or Asparagus (for side)"
    ],
    steps: [
      "Season scallops with salt, pepper, and garlic. Sear them 2 min each side just until a golden edge. I like to serve some of these as appetizer then chop the rest for the pasta.",
      "Sauté minced garlic and 1 tbsp butter in large skillet",
      "Add diced tomatoes to skillet with the rest of the butter, wine, red pepper, basil, salt and pepper",
      "Cover and simmer until tomatoes cook down to a juicy paste like consistency (~30 min).",
      "Meanwhile, cook spaghetti noodles in water seasoned with salt, pepper, garlic",
      "Add cream and seafood, additional basil, red pepper, salt etc to taste.",
      "Add noodles to combine",
      "Serve with garlic bread, or asparagus and top with fresh grated parmesan and basil to garnish"
    ]
  },

  // ==========================================
  // 5. FISH/SEAFOOD (Pages 50-53)
  // ==========================================
  {
    id: "bang-bang-salmon",
    title: "Bang Bang Salmon",
    category: "Fish/Seafood",
    page: 51,
    author: "Mackie",
    notes: "Served with steamed rice, cucumbers, sliced avocados, roasted seaweed sheets and furikake seasoning.",
    ingredients: [
      "4 salmon fillets",
      "1 tbsp avocado oil",
      "1/2 cup kewpie mayo or regular mayonnaise",
      "1/3 cup sweet chili sauce",
      "2 tbsp sriracha",
      "1/2 tsp lemon/lime juice",
      "Garlic powder, paprika, salt, pepper"
    ],
    steps: [
      "Season salmon with avocado oil, salt, pepper, garlic powder, and paprika.",
      "Mix sauce: kewpie mayo, sweet chili sauce, sriracha, and lemon/lime juice.",
      "Cook at 375 degrees for about 5 minutes per side in air fryer (or 7 minutes per side in oven)."
    ]
  },
  {
    id: "sweet-chili-salmon",
    title: "Sweet Chili Salmon",
    category: "Fish/Seafood",
    page: 52,
    author: "Mackie",
    notes: "Salmon FILETS: has to be the pre sectioned 'Salmon filets' or they can have little bones and ICK. At Walmart: 'Marketside Skinless Atlantic salmon fillet, fresh never frozen'",
    ingredients: [
      "Marketside Skinless Atlantic salmon fillets",
      "1 bottle sweet chili sauce",
      "Rice",
      "Additional veggie as desired"
    ],
    steps: [
      "Day before: Open and cut filets into necessary size to fit in ziplock, marinate in sweet chili sauce.",
      "Day of: Start rice first, takes longest",
      "Preheat oven to 380 degrees, place on cookie sheet, season with garlic salt and pepper",
      "Bake for ~20 minutes",
      "Pull out, swipe a touch of fresh sauce over it, cook another 5 minutes",
      "Plate rice, then salmon, enjoy"
    ]
  },
  {
    id: "creamy-baked-salmon-orzo",
    title: "Creamy Baked Salmon Orzo",
    category: "Fish/Seafood",
    page: 53,
    author: "Mackie",
    notes: "",
    ingredients: [
      "1-2 cup orzo",
      "2 pieces of salmon fillets (Walmart fillets pack)",
      "1 Boursin Cheese (Garlic and Fine Herb flavor)",
      "Bone broth (enough to almost cover orzo)",
      "2 Lemons",
      "Large handful spinach",
      "Cherry tomatoes"
    ],
    steps: [
      "Preheat oven to 375, grab baking dish (lasagna style dish)",
      "Zest then quarter lemon",
      "Season salmon with salt, pepper, large pinch lemon zest",
      "In pan: tomatoes (coat whole bottom of dish), orzo, nestle cheese in middle, place salmon on sides of the cheese, rest of lemon zest and lemon juice from wedges (Watch for seeds)",
      "Bake 15 minutes, add spinach, bake 10 more minutes, or until orzo is cooked",
      "Remove, smash tomatoes and break up/mix everything together"
    ]
  },

  // ==========================================
  // 6. STUPID SIMPLE SUPPERS (Pages 55-56)
  // ==========================================
  {
    id: "quick-bbq-pulled-pork-mac-n-cheese",
    title: "Quick BBQ Pulled Pork Mac N Cheese",
    category: "Stupid Simple Suppers",
    page: 56,
    author: "Mackie",
    yield: "4",
    notes: "Can double recipe, just do 1:1 ratio of pork and mac",
    ingredients: [
      "1 Large Container Refrigerated Bob Evans Mac N Cheese",
      "1 Container Pre-Prepared Jack Daniels (or other brand) pulled pork",
      "BBQ sauce (Sweet Baby Ray's Original)",
      "Shredded cheddar cheese"
    ],
    steps: [
      "Add Mac n cheese to baking dish and spread",
      "Add Pulled pork to baking dish, cut up a bit and briefly mix",
      "Drizzle with favorite BBQ sauce",
      "Top with shredded cheese",
      "Bake at 375 for 45 minutes"
    ]
  },

  // ==========================================
  // 7. SOUP (Pages 57-60)
  // ==========================================
  {
    id: "katys-kale-soup",
    title: "Katy's Kale Soup",
    category: "Soup",
    page: 58,
    author: "Katy Roach",
    notes: "This makes a BIG batch, okay to cut in half, ADD 1 Chopped Zucchini! and we like it with Texas Toast :)",
    ingredients: [
      "2 large Tbsp of butter",
      "2 lbs of Ground Italian sausage",
      "1 Yellow Onion (diced)",
      "3-4 Russet Potatoes (small cubes)",
      "1 cup of Half & Half",
      "1 large bunch of Fresh Kale (chopped)",
      "1 Chopped Zucchini",
      "1 box of pasta shells (noodles)",
      "2 32oz Cartons of Chicken Broth",
      "Shaved Parmesan",
      "Texas Toast"
    ],
    steps: [
      "Brown the sausage in your pot.",
      "Add in diced onion/minced garlic & spices (chili flakes, onion powder, dried basil, dried oregano, garlic powder). Cook until fragrant.",
      "Pour in broth and cream, stir and simmer",
      "Add Chopped Zucchini 40 min before serving.",
      "Add in potatoes, noodles & kale 30 min before serving.",
      "Serve with fresh grated parmesan cheese and Texas toast"
    ]
  },
  {
    id: "blairs-cincinnati-chili",
    title: "Blair's Cincinnati Chili",
    category: "Soup",
    page: 59,
    author: "Lora Blair",
    notes: "A Haunted Hunterpace Special. Mackie's Version: Beanless - use an extra 1-2 cans of chili magic, and STRAIN THEM ALL WITH SAUCE STRAINING INTO CROCKPOT, AND DISPOSE OF BEANS. Kentucky: Dip a PB&J",
    ingredients: [
      "2-4 cans Chili Magic (Half traditional, half Texas style)",
      "2 lb ground beef",
      "2-4 cans diced tomatoes with green chilies",
      "Cinnamon",
      "Cheddar Jack Cheez-Its",
      "Shredded Cheddar"
    ],
    steps: [
      "Brown meat, drain, add to crock pot",
      "Add tomatoes, chili magic (Straight from the can if using beans, if not using beans - use strainer over the crockpot to drain sauce in and dispose of beans), cinnamon",
      "Simmer until heated through at least a couple hours",
      "Serve topped with cheddar jack Cheez-Its and shredded cheese"
    ]
  },
  {
    id: "tex-mex-soup",
    title: "Tex Mex Soup",
    category: "Soup",
    page: 60,
    author: "Mackie",
    notes: "For 'Enchilada' version: Use tomatoes with green chilies, add 10 oz enchilada sauce, 4 oz cream cheese, 1 c cheddar and 1/2 c Monterey Jack",
    ingredients: [
      "2 tbsp olive oil",
      "1 small onion diced",
      "2 cloves garlic, minced",
      "1 can (14.5 oz) diced tomatoes",
      "4 cups low sodium chicken broth",
      "2 cups shredded rotisserie chicken or chicken breast",
      "1 can (15 oz) desired beans, drained and rinsed",
      "1 c frozen corn",
      "Juice of 1 lime",
      "Tortilla strips/chips, shredded cheese, cilantro, avocado (for serving)"
    ],
    steps: [
      "Heat oil in a large pot over medium heat. Sauté onion 4-5 minutes until soft, then add garlic and spices (cumin, chili powder, smoked paprika, red pepper flakes); cook 30 seconds.",
      "Add tomatoes, broth, chicken, beans, and corn (and enchilada sauce if doing that version)",
      "Bring to a simmer and cook 5-7 minutes to warm through and meld flavors.",
      "Add cheeses if doing Enchilada version, just to melt and mix.",
      "Taste and adjust salt, pepper, and lime. Use a spoon to shred any large chicken pieces finer if needed.",
      "Serve with tortilla strips or chips, cheese, cilantro, and diced avocado or over rice."
    ]
  },

  // ==========================================
  // 8. SIDES (Pages 62-65)
  // ==========================================
  {
    id: "sweet-and-savory-bacon-wrapped-asparagus",
    title: "Sweet and Savory Bacon Wrapped Asparagus",
    category: "Sides",
    page: 63,
    author: "Karin Powell",
    yield: "Enough for a Crew",
    notes: "",
    ingredients: [
      "2 Bundles Asparagus",
      "2 Packs Thick Cut Bacon",
      "1-2 C Soy Sauce",
      "1 C+ Brown Sugar",
      "1-2 Sticks Butter"
    ],
    steps: [
      "Pre cook bacon via desired method to ~half cooked",
      "Clean and Clip asparagus ends",
      "Wrap bundles of 3 asparagus in 1 piece of bacon",
      "Place bundles in baking dish with bacon ends down so they stay wrapped",
      "In saucepan: mix brown sugar, butter and soy sauce to taste over low heat, stirring continuously until melted and combined. Do NOT let boil.",
      "Pour sauce over asparagus",
      "Bake at 400 until bacon is cooked, sauce is sizzling, but asparagus is not wilted."
    ]
  },
  {
    id: "roasted-sweet-potatoes",
    title: "Roasted Sweet Potatoes",
    category: "Sides",
    page: 64,
    author: "Kaitlin Zito",
    notes: "Mikey HATES onion, so we usually just use onion powder, but real onion does elevate.",
    ingredients: [
      "Sweet Potatoes, diced (~1 potato per person)",
      "Fresh Rosemary",
      "Fresh Thyme",
      "Roasted, Salted Pumpkin Seeds",
      "Olive oil",
      "Salt, Pepper, Onion powder (or chopped onion)"
    ],
    steps: [
      "Rinse then Dice potatoes into <1\" cubes",
      "Dice 1/2 onion if using it and sauté in skillet with pumpkin seeds and drizzle of oil until toasty",
      "Add potatoes, drizzle with olive oil, season",
      "Sauté until soft, rotate covered and not covered until golden and desired texture (~20 min or so)"
    ]
  },
  {
    id: "andys-california-overnight-rolls",
    title: "Andy's California Overnight Rolls",
    category: "Sides",
    page: 65,
    author: "Andy Woofter",
    notes: "Thanksgiving Staple",
    ingredients: [
      "2 1/4 tsp yeast (1 pkg yeast)",
      "2 eggs",
      "1 tsp salt",
      "1/2 c sugar",
      "1 c milk",
      "4 c flour",
      "1/2 c melted butter"
    ],
    steps: [
      "Mix yeast, sugar and milk, let stand 30 min",
      "Mix into dough, let stand overnight, covered",
      "Cut dough in half",
      "Roll to 1/2 inch thick",
      "Cut into pie shape pieces",
      "Roll from large end",
      "Place on greased cookie sheet, cover with towels",
      "Allow to rise to double their size",
      "Bake at 400 until golden",
      "Glaze with butter",
      "Serve wrapped in a towel to stay warm"
    ]
  },

  // ==========================================
  // 9. DESSERTS (Pages 67-76)
  // ==========================================
  {
    id: "jerrys-favorite-chocolate-no-bakes",
    title: "Jerry's Favorite Chocolate No Bakes",
    category: "Desserts",
    page: 68,
    author: "Granny Joyce and Wanda Woofter",
    notes: "Weather: High humidity can make them absorb more moisture, low humidity can make them more dry. Storage: 1-2 days sitting out, 1-2 weeks in fridge",
    ingredients: [
      "2 c sugar",
      "1/2 c whole or 2% milk",
      "1/3 c cocoa",
      "1 stick butter",
      "1/3 c Peanut Butter",
      "3 c old fashioned oats",
      "1 tsp vanilla"
    ],
    steps: [
      "In sauce pan heat sugar, milk, cocoa and butter to a boil, continue 1 min",
      "Remove from heat",
      "Add 1/3 c PB, 3 c oats and vanilla",
      "Beat until thick and combined",
      "Drop in spoonfuls to wax paper to cool"
    ]
  },
  {
    id: "homemade-samoa-bites",
    title: "Homemade Samoa Bites",
    category: "Desserts",
    page: 69,
    author: "Mackie",
    notes: "",
    ingredients: [
      "Unsweetened Shredded Coconut",
      "Pitted Dates",
      "Dark Chocolate Chips",
      "Sea Salt Flakes"
    ],
    steps: [
      "Heat Dates in 30 sec increments just until soft enough to smash with fork.",
      "Mash dates and mix in coconut at ~1:1 ratio.",
      "Form into desired size cookie shapes",
      "Heat chocolate chips in the microwave in 30 second increments until melted.",
      "Drizzle cookies with chocolate",
      "Top with salt shavings",
      "Refrigerate"
    ]
  },
  {
    id: "chocolate-chip-banana-muffins",
    title: "Chocolate Chip Banana Muffins",
    category: "Desserts",
    page: 70,
    author: "Mackie",
    notes: "*If you don't have oat flour on hand, you can make your own by placing 1 1/4 cups of oats in a blender or food processor and pulsing until the consistency of flour!",
    ingredients: [
      "3 large ripe bananas",
      "1/2 cup natural peanut butter",
      "4 tablespoons honey",
      "2 eggs",
      "2 teaspoons vanilla extract",
      "1 1/4 cups oat flour (or rolled oats)",
      "1 tablespoon baking powder",
      "1/2 teaspoon salt",
      "1 cup dark chocolate chips"
    ],
    steps: [
      "Preheat oven to 425°F.",
      "Line a muffin tin with 12 muffin cups, and spray the muffin cups with an oil-based spray. Set aside.",
      "In a large bowl combine the bananas, peanut butter, honey, eggs, and vanilla. Stir until well combined.",
      "Add the oat flour, baking powder, and salt and fold to combine.",
      "Add the chocolate chips. Make sure to not over mix.",
      "Scoop batter into prepared muffin cups, filling just shy of the top of the cups.",
      "Bake for 5 minutes at 425°F, then, without opening your oven door, turn the oven down to 350°F and bake for an additional 15 minutes.",
      "Remove from oven and allow to cool for 10 minutes, before transferring to a wire rack to cool completely."
    ]
  },
  {
    id: "easiest-cinnamon-roll-pie-casserole",
    title: "Easiest Cinnamon Roll Pie Casserole",
    category: "Desserts",
    page: 71,
    author: "Meals and Munchies",
    yield: "4",
    notes: "Just change the pie filling to match the season",
    ingredients: [
      "1 package Pillsbury cinnamon rolls",
      "1 can desired pie filling (Apple, blueberry, blackberry, peach, or cherry)"
    ],
    steps: [
      "Preheat oven to 375",
      "Grease baking dish",
      "Cut cinnamon rolls into quarters, add to dish",
      "Pour pie filling on top, stir, cover",
      "Bake 15 min, stir",
      "Bake uncovered 10 min, stir, bake 5 min",
      "Top with icing"
    ]
  },
  {
    id: "its-a-boy-chai-cupcakes-with-espresso-frosting",
    title: "It's a BOY Chai Cupcakes with Espresso Frosting",
    category: "Desserts",
    page: 72,
    author: "Kimber Elder",
    notes: "Kimber got the gender results and made these DELICIOUS cupcakes and filled them with the gender of baby Vane! Such a fun little reveal for us.",
    ingredients: [
      "Chai Spice Mix: ground cinnamon, ground ginger, ground cardamom, ground allspice",
      "1 tea bag chai",
      "1/2 cup whole milk",
      "1 and 3/4 cups cake flour",
      "3/4 tsp baking powder & 1/4 tsp baking soda",
      "1/2 cup unsalted butter + 1 cup lightly salted butter (for frosting)",
      "1 cup granulated sugar",
      "3 large egg whites",
      "Vanilla extract",
      "1/2 cup sour cream or plain yogurt",
      "4 cups Powdered Sugar",
      "1 Tbsp instant blonde espresso powder"
    ],
    steps: [
      "Prepare chai spice mix: Mix all of the chai spices together.",
      "Steep the tea: Bring milk to a boil or heat in the microwave for 1-2 minutes. Pour over tea bag and steep for 20-30 minutes. Let cool to room temperature.",
      "Preheat the oven to 350°F (177°C). Line a 12-cup muffin pan with cupcake liners plus 2-3 more.",
      "Whisk the cake flour, 3 1/2 tsp chai spice mix, baking powder, baking soda, and salt together.",
      "Beat butter and sugar together on high speed until smooth and creamed (~2 min). Beat in egg whites (~2 min), then sour cream and vanilla.",
      "On low speed, add dry ingredients until just incorporated, then slowly pour and mix in the chai milk just until combined.",
      "Fill liners 2/3 full and bake for 20-22 minutes. Cool completely.",
      "Frosting: Whip 1 cup butter until smooth, add powdered sugar, instant espresso powder, vanilla, and 4 Tbsp milk; beat until fluffy and pipe onto cupcakes."
    ]
  },
  {
    id: "snicker-dates",
    title: "Snicker Dates",
    category: "Desserts",
    page: 73,
    author: "Mackie",
    notes: "Date snickers can be stored at room temperature for at least a week, or store them in an airtight container in the fridge for up to a month.",
    ingredients: [
      "9 squishy Medjool dates",
      "3 tablespoons peanut butter",
      "2 tablespoons chopped peanuts",
      "1/4 cup dark chocolate chips",
      "Flaky sea salt (optional topping)"
    ],
    steps: [
      "Use your fingers to split each date in half and remove the pit in the center. Arrange the date halves cut side up on a plate lined with parchment paper.",
      "Add roughly a 1/2 teaspoon of peanut butter to the center of each date half. Then sprinkle the chopped peanuts on top so that each piece will have some crunch.",
      "Melt the chocolate chips in a double boiler (or in the microwave) until smooth.",
      "Use a spoon to drizzle the melted chocolate over each date half. Sprinkle flaky sea salt over the top while the chocolate is still shiny.",
      "Place the plate in the fridge for 10 minutes or until the chocolate is firm."
    ]
  },
  {
    id: "nutty-nancys-german-chocolate-cake",
    title: "Nutty Nancy's German Chocolate Cake",
    category: "Desserts",
    page: 74,
    author: "Nutty Nancy from Pensacola",
    notes: "",
    ingredients: [
      "2 c Stevia",
      "1 3/4 c all purpose flour",
      "3/4 c + 2/3 c cacao or cocoa powder",
      "1 1/2 tsp baking soda",
      "2 eggs",
      "1 c + 1/3 c milk",
      "1/2 c + 1/2 c coconut oil",
      "Vanilla extract",
      "3 c powdered sugar",
      "Shredded coconut"
    ],
    steps: [
      "Combine stevia, flour, cacao, baking powder and soda, salt",
      "Add eggs, milk, oil, vanilla, Beat on medium ~2 min",
      "Stir in 1 c boiling water, pour into pan",
      "Bake at 375: 2 9\" round = 30-35 min / 1 13x9 = 35-40 min / cupcakes = 22-25 min",
      "Let cool 10 min, transfer to wire rack to cool completely",
      "Frosting: melt oil, stir in cacao, alternate adding sugar and milk while beating, add vanilla",
      "Add in coconut to desired consistency and Frost cake"
    ]
  },
  {
    id: "michelles-espresso-chocolate-ganache-bundt-cake",
    title: "Michelle's Espresso Chocolate Ganache Bundt Cake",
    category: "Desserts",
    page: 75,
    author: "Michelle Stanfield, VHVI",
    notes: "",
    ingredients: [
      "2 c flour",
      "2 c sugar",
      "3/4 c cocoa powder",
      "1.5 tsp baking powder & 1.5 tsp baking soda",
      "1 tsp vanilla",
      "1 stick melted butter",
      "1 c buttermilk",
      "8 ounces brewed coffee (cooled)",
      "2 eggs",
      "1 c milk (2%)",
      "1 c chocolate chips"
    ],
    steps: [
      "Preheat oven to 350",
      "Spray Bundt Cake pan (Bakers Joy works great)",
      "Brew coffee and set aside to cool",
      "Mix all cake ingredients",
      "Fill bundt pan 3/4 way",
      "Lick spoon and bowl",
      "Bake at 350 for 55 min",
      "Let sit in pan 15 min then remove",
      "Ganache: Heat milk in microwave 30 seconds at a time until steaming (Not scalding)",
      "Pour in the chocolate chips and let sit for 2 minutes then stir, let cool",
      "Once Ganache has started to set, pour over cake"
    ]
  },
  {
    id: "hemp-joy-chocolate",
    title: "Hemp Joy Chocolate",
    category: "Desserts",
    page: 76,
    author: "Nutty Nancy",
    notes: "Like a healthy almond joy. Could remove coconut and hemp if desired and replace with other fillings like caramel or sea salt.",
    ingredients: [
      "3/4 - 1 c coconut oil",
      "1/2 c honey",
      "1/2 c cacao powder",
      "1/2 c hemp seeds / chia seeds",
      "1 tsp vanilla",
      "1/4 c shredded coconut"
    ],
    steps: [
      "Add all ingredients to a saucepan",
      "Melt over low heat",
      "Stir until combined",
      "Pour into FLEXIBLE ice molds",
      "Freeze",
      "Once solid, keep in refrigerator"
    ]
  },

  // ==========================================
  // 10. HOLIDAY TREATS (Pages 78-83)
  // ==========================================
  {
    id: "chocolate-chip-pumpkin-bread",
    title: "Chocolate Chip Pumpkin Bread",
    category: "Holiday Treats",
    page: 79,
    author: "Mackie",
    notes: "",
    ingredients: [
      "1 1/2 cups all purpose flour",
      "1 teaspoon pumpkin pie spice",
      "1/4 tsp salt & 1/2 tsp baking soda",
      "1 cup granulated sugar",
      "1 cup pumpkin PUREE",
      "3/4 cup vegetable oil",
      "2 eggs",
      "1/2 teaspoon vanilla extract",
      "1 1/4 cups semisweet chocolate chips"
    ],
    steps: [
      "Preheat the oven to 350 degrees F.",
      "Coat an 8x4 loaf pan with cooking spray and line the bottom with parchment paper.",
      "Place the flour, pumpkin pie spice, salt and baking soda in a large bowl; whisk to combine.",
      "Add the sugar, pumpkin puree, vegetable oil, eggs and vanilla extract to the flour mixture. Stir until just combined.",
      "Toss 1 cup of the chocolate chips with 1 tablespoon flour. Stir the chocolate chips into the batter.",
      "Pour the batter into the prepared pan",
      "Sprinkle the remaining 1/4 cup chocolate chips over the top of the loaf.",
      "Bake for 55-65 minutes or until a toothpick inserted into the center of the loaf comes out clean.",
      "Cool for 10 minutes, then run a thin knife along the sides of the pan to loosen the bread.",
      "Let the bread cool in the pan, then invert, slice and serve."
    ]
  },
  {
    id: "gluten-free-chocolate-chip-pumpkin-muffins",
    title: "Gluten Free Chocolate Chip Pumpkin Muffins",
    category: "Holiday Treats",
    page: 80,
    author: "Mackie",
    notes: "Can also replace chocolate chips with a swirl of nutella on top. 200 kcal, 21g Carbs, 4g Protein, 12g Fat.",
    ingredients: [
      "1 cup pumpkin puree",
      "1/2 cup coconut oil melted",
      "2 eggs",
      "1/3 cup maple syrup",
      "1 tsp vanilla",
      "2 cups oat flour (gluten-free)",
      "1 tsp baking powder & 1/2 tsp baking soda",
      "2 tsp pumpkin pie spice",
      "1 cup chocolate chips or chopped pecans"
    ],
    steps: [
      "Preheat oven to 350F and line a muffin tin with liners and nonstick spray.",
      "In a large bowl, whisk pumpkin, coconut oil, eggs, maple syrup, and vanilla until well combined.",
      "In a small bowl, mix oat flour, baking powder, baking soda, salt and pumpkin pie spice.",
      "Add dry ingredients to wet and stir until combined. Stir in any mix-ins.",
      "Toss chocolate chips in a touch of flour then mix them in or just top muffins with them.",
      "Scoop into muffin tin and bake for about 22 minutes or until toothpick inserted comes out clean."
    ]
  },
  {
    id: "soft-pumpkin-chocolate-chip-cookies",
    title: "Soft Pumpkin Chocolate Chip Cookies",
    category: "Holiday Treats",
    page: 81,
    author: "Mackie",
    notes: "",
    ingredients: [
      "1 c pumpkin puree",
      "1 c granulated sugar",
      "1/2 c canola or vegetable oil",
      "1 tsp vanilla",
      "1 lg egg",
      "2 c flour",
      "2 tsp baking powder & 1 tsp baking soda",
      "1 tsp cinnamon",
      "1 tsp milk",
      "1 c semi sweet chocolate chips",
      "1 c chopped walnuts (optional)"
    ],
    steps: [
      "Preheat oven to 375 degrees. Line cookie sheets with parchment paper sheets.",
      "In the bowl of a stand mixer, combine pumpkin, sugar, oil, vanilla and egg. Mix until well combined.",
      "In a separate bowl, stir together the flour, baking powder, cinnamon and salt. In a small bowl, dissolve the baking soda with the milk. Add both the dry flour mixture and the wet baking soda mixture to the pumpkin mixture. Mix well.",
      "Add in the chocolate chips and nuts and stir until evenly combined.",
      "Using a medium cookie scoop (1 1/2 tablespoons), drop mounds of the cookie dough on the prepared cookie sheets.",
      "Bake for 10 to 12 minutes. Allow the cookies to cool slightly before removing to a wire rack to cool completely."
    ]
  },
  {
    id: "tammys-buttermilk-sugar-cookies",
    title: "Tammy's Buttermilk Sugar Cookies",
    category: "Holiday Treats",
    page: 82,
    author: "Tammy Eichelberger",
    notes: "HERS ARE MAGIC IN YOUR MOUTH, I'm still figuring it out.... I do like adding peppermint extract to half the batch and topping those with crushed peppermint",
    ingredients: [
      "3 1/4 C Flour",
      "1 tsp baking soda & 1/2 tsp salt",
      "1/2 c butter + 1/2 c softened butter (for icing)",
      "1 c sugar",
      "1 egg",
      "Vanilla extract",
      "1/2 c buttermilk + 4-5 tbsp buttermilk (for icing)",
      "16 oz powdered sugar"
    ],
    steps: [
      "Beat butter, egg and vanilla in mixer",
      "Add buttermilk, beat",
      "Slowly add dry ingredients, beat",
      "Cover counter with wax paper, taped down and dusted with flour or powdered sugar",
      "Roll out with pin to ~1/3\" thick",
      "Cut shapes and repeat with leftover edges until gone",
      "Bake ~12-13 min at 375, let cool",
      "ICING: Beat butter until Creamy, gradually add powdered sugar, beating slowly",
      "Slowly add vanilla then 4 tbsp buttermilk and increase speed to medium until smooth",
      "ICE/Decorate Cookies as desired"
    ]
  },
  {
    id: "blair-bourbon-balls",
    title: "Blair Bourbon Balls",
    category: "Holiday Treats",
    page: 83,
    author: "Lora and Mackie",
    notes: "A Blair family secret.",
    ingredients: [
      "You wish. (Top Secret Blair Family Ingredients!)",
      "Maker's Mark Bourbon & Pecans"
    ],
    steps: [
      "Dream on."
    ]
  },

  // ==========================================
  // 11. FREEZER PREP MEALS (Pages 85-91)
  // ==========================================
  {
    id: "freezer-prep-chicken-parm",
    title: "Freezer Prep Chicken Parm",
    category: "Freezer Prep Meals",
    page: 86,
    author: "Mackie",
    notes: "Cook noodles and garlic bread day of if desired",
    ingredients: [
      "2 pounds boneless skinless chicken breasts",
      "1/4 cup all purpose flour",
      "1 large egg",
      "2 tablespoons 2% milk",
      "1/2 cup Italian seasoned bread crumbs",
      "2 tablespoons grated parmesan cheese",
      "2 teaspoons dried parsley & 1/2 tsp garlic powder",
      "20 oz jar marinara sauce",
      "8 oz shredded mozzarella cheese",
      "Thin Spaghetti & Garlic bread (if desired)"
    ],
    steps: [
      "Coat 9x13 aluminum/disposable pan with cooking spray.",
      "Add flour to a shallow bowl or plate.",
      "In a separate bowl, combine egg and milk.",
      "In a third bowl, combine remaining dry ingredients (breadcrumbs, parmesan cheese, parsley, and garlic powder).",
      "Dip each chicken breast in flour first, then wet mixture, then dry mixture, and place in pan.",
      "Cover pan with lid or aluminum foil and freeze for up to three months.",
      "To Heat: Thaw out the day before. Pre-heat oven to 400.",
      "Add pan to oven and bake 1 1/2 hours covered.",
      "Uncover, pour on sauce, and sprinkle with cheese.",
      "Bake, uncovered, for an additional 15 minutes, or until cheese starts to brown and chicken reaches 165F."
    ]
  },
  {
    id: "freezer-prep-sliders",
    title: "Freezer Prep Sliders",
    category: "Freezer Prep Meals",
    page: 87,
    author: "Mackie",
    notes: "Can sub sauce/cheese/meat for different variations: salami/pepperoni/ham with banana peppers and Italian dressing, Ham/Turkey/Chipotle, RoastBeef/Provolone/AuJus, Meatball Marinara, or Breakfast version",
    ingredients: [
      "1 package Hawaiian sweet rolls",
      "9 oz deli ham thin sliced",
      "10 slices Swiss cheese",
      "1/2 cup honey mustard salad dressing or honey mustard",
      "2 tablespoons butter, melted",
      "1 teaspoon dry minced onion",
      "1/4 teaspoon poppy seeds"
    ],
    steps: [
      "Remove rolls from package, lay flat, and slice in two (top and bottom piece). Spread with dressing.",
      "Layer Swiss cheese slices over both sections of sandwiches, covering as much as possible.",
      "Layer ham over the bottom section of sandwiches. Flip top over onto bottom section. Place into aluminum pan.",
      "In small bowl, combine butter, dry minced onion, and poppy seeds. Brush or pour over tops of sandwiches.",
      "TO FREEZE: Cover aluminum pan tightly with lid or foil. Store up to two months.",
      "TO REHEAT: Thaw overnight in refrigerator. Bake in 375F oven, covered, for 20-25 minutes until centers are heated through and cheese has melted."
    ]
  },
  {
    id: "freezer-prep-baked-ziti",
    title: "Freezer Prep Baked Ziti",
    category: "Freezer Prep Meals",
    page: 88,
    author: "Mackie",
    notes: "",
    ingredients: [
      "1 lb dry ziti or penne pasta",
      "Diced zucchini or spinach",
      "1 (15 oz) container part-skim ricotta cheese",
      "1 large egg",
      "1/2 cup grated parmesan or romano cheese",
      "3-4 cups spaghetti sauce",
      "2 cups shredded mozzarella cheese",
      "1-2 lb ground beef or sausage"
    ],
    steps: [
      "Bring a 5-6 quart pot of salted water to a boil. Add the pasta and cook for 5 minutes (still has a bite).",
      "Cook and drain meat.",
      "Drain the pasta and rinse. Place the pasta into a 9x13 baking foil pan.",
      "Mix ricotta cheese, egg, romano or parmesan cheese, garlic powder, onion powder, Italian seasoning, salt, and pepper in a medium bowl.",
      "Mix the ricotta cheese mixture, spaghetti sauce, and meat in with the pasta.",
      "Add diced Zucchini or spinach",
      "Sprinkle mozzarella over the top of the pasta mixture.",
      "Cover with foil and Freeze",
      "When ready to cook, thaw in fridge for a day, then bake for 55 minutes at 375 (if frozen, add an hour). Uncover and bake 5 more minutes until bubbly."
    ]
  },
  {
    id: "freezer-prep-mini-lasagnas",
    title: "Freezer Prep Mini Lasagnas",
    category: "Freezer Prep Meals",
    page: 89,
    author: "Mackie",
    notes: "",
    ingredients: [
      "3 lbs ground beef",
      "2 Tbsp minced dried onion",
      "72 oz spaghetti sauce (3 24-oz jars)",
      "24 oz cottage cheese",
      "30 oz ricotta cheese",
      "1/4 cup parmesan cheese",
      "2 eggs",
      "18 ounces oven-ready lasagna noodles",
      "1 lb mozzarella cheese thinly sliced",
      "1 lb mozzarella cheese shredded",
      "Fresh basil, parsley, Italian seasoning"
    ],
    steps: [
      "Grease mini lasagna pans and set aside.",
      "Brown ground beef with minced onions in a large pan. Drain off the fat.",
      "Stir in spaghetti sauce, salt, black pepper, basil, parsley, and Italian seasoning.",
      "In a medium-sized bowl, combine cottage cheese, ricotta cheese, parmesan cheese, pepper, salt, parsley, and eggs.",
      "Spread a layer of meat sauce in the bottom of the mini foil pans",
      "Layer uncooked noodles, sliced cheese, cottage cheese mixture, and meat mixture as desired, ending with meat mixture.",
      "Sprinkle with shredded mozzarella cheese.",
      "Place mini pans on a large sheet pan and bake, uncovered, at 350 for 30-35 minutes, or until bubbly.",
      "Let cool, then cover and freeze for later (or cover with foil and bake an additional 20-25 minutes to eat immediately)."
    ]
  },
  {
    id: "freezer-prep-mini-chicken-pot-pies",
    title: "Freezer Prep Mini Chicken Pot Pies",
    category: "Freezer Prep Meals",
    page: 90,
    author: "Mackie",
    notes: "Okay to sub cubed chicken for rotisserie or use pre-made pie crust",
    ingredients: [
      "3 cups cooked chicken cubed (or rotisserie chicken)",
      "16 oz frozen mixed vegetables",
      "3.5 cups flour (or pre-made pie crusts)",
      "3 sticks butter",
      "3 cups milk",
      "1 tbsp minced onion",
      "1 tsp Italian seasoning"
    ],
    steps: [
      "Prepare crusts (or use pre-made pie crust).",
      "To prepare filling: Melt 1/2 cup butter in a saucepan. Stir in 1/2 cup flour and 3/4 tsp salt.",
      "Add 3 cups milk and cook until smooth and thickened, stirring continuously.",
      "Remove from heat, and stir in seasonings, frozen mixed veggies, and cubed chicken.",
      "Place 1 cup of filling into 6 mini greased pie pans.",
      "Roll pie crust and cut out 6 circles. Place circles over the filling, flute edges, cut slits in the center, and bake uncovered at 350 for 30 minutes.",
      "Let the pies cool completely, then cover securely with foil and freeze.",
      "To reheat: Place frozen, covered pot pies into a cold oven, heat to 350° and bake for 30-60 minutes (or microwave in safe dish 5 min)."
    ]
  },
  {
    id: "freezer-prep-green-chile-enchiladas",
    title: "Freezer Prep Green Chile Enchiladas",
    category: "Freezer Prep Meals",
    page: 91,
    author: "Mackie",
    notes: "For Mikey, omit onion and add onion powder",
    ingredients: [
      "1.5 lbs ground beef",
      "1 1/4 cups onion chopped (or onion powder for Mikey)",
      "1 tbsp chili powder",
      "12 flour tortillas",
      "12 oz Monterey Jack cheese shredded",
      "1 can cream of chicken soup",
      "1.5 cups sour cream",
      "4 oz mild green chiles diced"
    ],
    steps: [
      "Preheat the oven to 375°F. Grease a 9x13 pan and set aside.",
      "In a skillet, brown ground beef and onions. Drain grease and return meat mixture to pan.",
      "Stir chili powder, salt and pepper into the meat mixture.",
      "Spoon some of the meat mixture into each tortilla and top with cheese (reserve 1 cup of cheese for topping).",
      "Roll up tortillas and place seam side down in your 9x13 pan.",
      "In a medium size bowl, combine soup, sour cream, and chiles and pour over tortillas. (If making ahead, cover pan with foil and freeze at this point).",
      "Bake uncovered for 20-25 minutes.",
      "Remove from oven, sprinkle reserved cheese on top, and bake (uncovered) for an additional 10 minutes."
    ]
  }
];
