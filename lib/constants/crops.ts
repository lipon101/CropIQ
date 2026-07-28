export interface Crop {
  name_en: string
  name_bn: string
  category: string
  season: string
}

export const CROPS: Crop[] = [
  { name_en: "Rice", name_bn: "ধান", category: "Cereal", season: "Boro, Aus, Aman" },
  { name_en: "Wheat", name_bn: "গম", category: "Cereal", season: "Rabi (Winter)" },
  { name_en: "Maize", name_bn: "ভুট্টা", category: "Cereal", season: "Rabi & Kharif" },
  { name_en: "Jute", name_bn: "পাট", category: "Fiber", season: "Kharif (Monsoon)" },
  { name_en: "Potato", name_bn: "আলু", category: "Vegetable", season: "Rabi (Winter)" },
  { name_en: "Tomato", name_bn: "টমেটো", category: "Vegetable", season: "Rabi (Winter)" },
  { name_en: "Eggplant", name_bn: "বেগুন", category: "Vegetable", season: "Year-round" },
  { name_en: "Chili", name_bn: "মরিচ", category: "Spice", season: "Rabi & Kharif" },
  { name_en: "Onion", name_bn: "পেঁয়াজ", category: "Spice", season: "Rabi (Winter)" },
  { name_en: "Garlic", name_bn: "রসুন", category: "Spice", season: "Rabi (Winter)" },
  { name_en: "Lentil", name_bn: "মসুর ডাল", category: "Pulse", season: "Rabi (Winter)" },
  { name_en: "Mustard", name_bn: "সরিষা", category: "Oilseed", season: "Rabi (Winter)" },
  { name_en: "Sugarcane", name_bn: "আখ", category: "Cash Crop", season: "Year-round" },
  { name_en: "Banana", name_bn: "কলা", category: "Fruit", season: "Year-round" },
  { name_en: "Mango", name_bn: "আম", category: "Fruit", season: "Summer" },
  { name_en: "Jackfruit", name_bn: "কাঁঠাল", category: "Fruit", season: "Summer" },
  { name_en: "Papaya", name_bn: "পেঁপে", category: "Fruit", season: "Year-round" },
  { name_en: "Cabbage", name_bn: "বাঁধাকপি", category: "Vegetable", season: "Rabi (Winter)" },
  { name_en: "Cauliflower", name_bn: "ফুলকপি", category: "Vegetable", season: "Rabi (Winter)" },
  { name_en: "Okra", name_bn: "ঢেঁড়স", category: "Vegetable", season: "Summer" },
  { name_en: "Pumpkin", name_bn: "কুমড়া", category: "Vegetable", season: "Year-round" },
  { name_en: "Cucumber", name_bn: "শসা", category: "Vegetable", season: "Year-round" },
  { name_en: "Tea", name_bn: "চা", category: "Cash Crop", season: "Year-round" },
  { name_en: "Betel Leaf", name_bn: "পান", category: "Cash Crop", season: "Year-round" },
]

// Commodities for market prices
export interface Commodity {
  name_en: string
  name_bn: string
  unit: string
}

export const COMMODITIES: Commodity[] = [
  { name_en: "Rice (Miniket)", name_bn: "চাল (মিনিকেট)", unit: "kg" },
  { name_en: "Rice (Nazirshail)", name_bn: "চাল (নাজিরশাইল)", unit: "kg" },
  { name_en: "Rice (Atop)", name_bn: "চাল (আতপ)", unit: "kg" },
  { name_en: "Wheat Flour", name_bn: "আটা", unit: "kg" },
  { name_en: "Potato", name_bn: "আলু", unit: "kg" },
  { name_en: "Onion (Local)", name_bn: "পেঁয়াজ (দেশি)", unit: "kg" },
  { name_en: "Onion (Imported)", name_bn: "পেঁয়াজ (আমদানি)", unit: "kg" },
  { name_en: "Garlic", name_bn: "রসুন", unit: "kg" },
  { name_en: "Green Chili", name_bn: "কাঁচা মরিচ", unit: "kg" },
  { name_en: "Dried Chili", name_bn: "শুকনা মরিচ", unit: "kg" },
  { name_en: "Turmeric", name_bn: "হলুদ", unit: "kg" },
  { name_en: "Ginger", name_bn: "আদা", unit: "kg" },
  { name_en: "Lentil (Local)", name_bn: "মসুর ডাল (দেশি)", unit: "kg" },
  { name_en: "Eggplant", name_bn: "বেগুন", unit: "kg" },
  { name_en: "Tomato", name_bn: "টমেটো", unit: "kg" },
  { name_en: "Cabbage", name_bn: "বাঁধাকপি", unit: "pcs" },
  { name_en: "Cauliflower", name_bn: "ফুলকপি", unit: "pcs" },
  { name_en: "Okra", name_bn: "ঢেঁড়স", unit: "kg" },
  { name_en: "Pumpkin", name_bn: "কুমড়া", unit: "pcs" },
  { name_en: "Bitter Gourd", name_bn: "করলা", unit: "kg" },
  { name_en: "Ridge Gourd", name_bn: "ঝিঙ্গা", unit: "kg" },
  { name_en: "Cucumber", name_bn: "শসা", unit: "kg" },
  { name_en: "Banana", name_bn: "কলা", unit: "dozen" },
  { name_en: "Mango", name_bn: "আম", unit: "kg" },
  { name_en: "Papaya", name_bn: "পেঁপে", unit: "kg" },
  { name_en: "Egg (Farm)", name_bn: "ডিম (ফার্ম)", unit: "dozen" },
  { name_en: "Chicken (Broiler)", name_bn: "মুরগি (ব্রয়লার)", unit: "kg" },
  { name_en: "Beef", name_bn: "গরুর মাংস", unit: "kg" },
  { name_en: "Fish (Rui)", name_bn: "মাছ (রুই)", unit: "kg" },
  { name_en: "Milk", name_bn: "দুধ", unit: "liter" },
]
