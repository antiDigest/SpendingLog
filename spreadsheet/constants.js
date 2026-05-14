var AMOUNTINDEX = 6;
var DATEINDEX = 4;
var DATEYEARINDEX = 0;
var DATEMONTHINDEX = 1;
var DATEDAYINDEX = 2;
var DATEDAYOFWEEKINDEX = 3;
var TIMESTAMPINDEX = 5;
var CARDINDEX = 10;
var MERCHANTINDEX = 7;
var TIMELINEINDEX = 9;
var CATEGORYINDEX = 8;
var ZERO = 0;

var MONTH_MAP = {
    "Jan": 0,
    "Feb": 1,
    "Mar": 2,
    "Apr": 3,
    "May": 4,
    "Jun": 5,
    "Jul": 6,
    "Aug": 7,
    "Sep": 8,
    "Oct": 9,
    "Nov": 10,
    "Dec": 11
}

const INDIVIDUAL_CATEGORY_LIMITS = {
    RENT_UTILITIES_PHONE_INTERNET: 2300,  // fixed household bill
    INSURANCE_FINANCIAL: 1150,            // fixed household bill

    MEDICAL_PHARMACY: 25,                // routine is low; big bills are one-offs
    GROCERY: 175,                      // solo median $203, married/2 = $150
    RESTAURANTS_FOOD_DRINK: 130,       // both eras ~$150 median per person
    BAKERY_COFFEE_SHOPS: 30,             // avg $33-34 solo and married

    ENTERTAINMENT_EVENTS: 50,            // solo was lumpy; married very low
    SPORTS_RECREATION: 90,              // solo median $105, married/2 = $60
    DONATIONS_CHARITY: 15,               // infrequent and small

    ONLINE_RETAIL_MARKETPLACE: 165,      // solo median $195, married/2 = $104
    RETAIL_SHOPPING: 115,               // married/2 median = $133; tightened
    HOME_IMPROVEMENT_HARDWARE: 65,       // shared project; $65 each is fair
    OTHER: 75,                          // tightened hard; one-offs excluded manually

    GAS_AUTOMOTIVE: 75,                 // one car, solo median was $89
    TRANSPORTATION_TRAVEL: 55,          // SpotHero is fixed; this covers personal travel
    CAREER_GROWTH: 200,                 // personal development, full limit per person

    TEMPORARY_UNCATEGORIZED: 25,  // catch-all
};

const MONTHLY_CATEGORY_LIMITS = {
    RENT_UTILITIES_PHONE_INTERNET: 2300,  // avg $1,989 married, median $2,200 — small buffer added
    INSURANCE_FINANCIAL: 1200,             // typical $25/mo State Farm + ~$500 Progressive semi-annually
    MEDICAL_PHARMACY: 200,               // routine is $60-100; big one-offs should be excluded manually

    GROCERY: 500,                      // married median $301, mean $339 — room for guests
    RESTAURANTS_FOOD_DRINK: 200,       // married median just $153 — old $500 was way too loose
    BAKERY_COFFEE_SHOPS: 50,             // actual avg $41, max $127

    ENTERTAINMENT_EVENTS: 100,           // married median only $15 — you're barely spending here
    SPORTS_RECREATION: 175,             // median $119-132, mean $133 — fits well
    DONATIONS_CHARITY: 100,              // very infrequent, ~$31 avg when it occurs

    ONLINE_RETAIL_MARKETPLACE: 275,     // mean $310, occasional spike months
    RETAIL_SHOPPING: 275,              // mean $405 but driven by big purchase months; $350 is honest
    HOME_IMPROVEMENT_HARDWARE: 175,    // routine ~$100-150/mo (Crosscut Hardwoods), buffer for hardware runs
    OTHER: 100,                        // consistent with actual; exclude one-offs (USCIS, etc.) manually

    GAS_AUTOMOTIVE: 100,               // actual gas avg only ~$55-65/mo; exclude car repairs separately
    TRANSPORTATION_TRAVEL: 250,        // median $202, but trip spikes happen; $400 is realistic

    CAREER_GROWTH: 200,               // LinkedIn + LeetCode + interview prep recur (~$80-150/mo)

    TEMPORARY_UNCATEGORIZED: 50  // almost never triggered; $75 is plenty
};

const SPENDING_BUDGET_PER_MONTH = 4800;