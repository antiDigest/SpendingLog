var GROCERY = "Grocery";
var RESTAURANTS_FOOD_DRINK = "Restaurants/Food & Drink";
var ONLINE_RETAIL_MARKETPLACE = "Online Retail/Marketplace";
var RETAIL_SHOPPING = "Retail/Shopping";
var GAS_AUTOMOTIVE = "Gas/Automotive";
var RENT_UTILITIES_PHONE_INTERNET = "Rent/Utilities/Phone/Internet";
var ENTERTAINMENT_EVENTS = "Entertainment/Events";
var INSURANCE_FINANCIAL = "Insurance/Financial";
var TRANSPORTATION_TRAVEL = "Transportation/Travel";
var CAREER_GROWTH = "Career/Growth";
var BAKERY_COFFEE_SHOPS = "Bakery/Coffee Shops";
var HOME_IMPROVEMENT_HARDWARE = "Home Improvement/Hardware";
var MEDICAL_PHARMACY = "Medical/Pharmacy";
var DONATIONS_CHARITY = "Donation/Charity";
var SPORTS_RECREATION = "Sports/Recreation";
var OTHER = "Other";

var AI_CALL_PENDING_MESSAGE = "AI call pending";
var TEMPORARY_UNCATEGORIZED = "Temporary Holds/Uncategorized";

var BANK_CONFIG = {
  "Discover": { "stoppingPhrase": "1-800-DISCOVER", "tags": true },
  "Citi": { "stoppingPhrase": "Your Citi Team", "tags": true },
  "Chase": { "stoppingPhrase": "Do not reply to this Alert.", "tags": false },
  "AmericanExpress": { "stoppingPhrase": "*The amount above may not", "tags": false },
  "Venmo": { "stoppingPhrase": "Like", "tags": false },
  "Bilt": { "stoppingPhrase": "Ways you're getting rewarded on rent", "tags": false },
  "Zelle": { "stoppingPhrase": "Wells Fargo Online Customer Service", "tags": false },
  "BankOfAmerica": { "stoppingPhrase": "We'll never ask for your personal", "tags": true },
  "CATEGORIES": [
    GROCERY, RESTAURANTS_FOOD_DRINK, ONLINE_RETAIL_MARKETPLACE, RETAIL_SHOPPING,
    GAS_AUTOMOTIVE, RENT_UTILITIES_PHONE_INTERNET, ENTERTAINMENT_EVENTS,
    INSURANCE_FINANCIAL, TRANSPORTATION_TRAVEL, BAKERY_COFFEE_SHOPS,
    HOME_IMPROVEMENT_HARDWARE, MEDICAL_PHARMACY, DONATIONS_CHARITY,
    SPORTS_RECREATION, TEMPORARY_UNCATEGORIZED, OTHER
  ]
};


var SECRETS_CONFIG = {}