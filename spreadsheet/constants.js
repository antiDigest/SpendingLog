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
    "Rent/Utilities/Phone/Internet": 2300,  // fixed household bill
    "Insurance/Financial": 1150,            // fixed household bill

    "Medical/Pharmacy": 25,                // routine is low; big bills are one-offs
    "Groceries": 175,                      // solo median $203, married/2 = $150
    "Restaurants/Food & Drink": 130,       // both eras ~$150 median per person
    "Bakery/Coffee Shops": 30,             // avg $33-34 solo and married

    "Entertainment/Events": 50,            // solo was lumpy; married very low
    "Sports/Recreation": 90,              // solo median $105, married/2 = $60
    "Donation/Charity": 15,               // infrequent and small

    "Online Retail/Marketplace": 165,      // solo median $195, married/2 = $104
    "Retail/Shopping": 115,               // married/2 median = $133; tightened
    "Home Improvement/Hardware": 65,       // shared project; $65 each is fair
    "Other": 75,                          // tightened hard; one-offs excluded manually

    "Gas/Automotive": 75,                 // one car, solo median was $89
    "Transportation/Travel": 55,          // SpotHero is fixed; this covers personal travel
    "Career/Growth": 200,                 // personal development, full limit per person

    "Temporary Holds/Uncategorized": 25,  // catch-all
};

const MONTHLY_CATEGORY_LIMITS = {
    "Rent/Utilities/Phone/Internet": 2300,  // avg $1,989 married, median $2,200 — small buffer added
    "Insurance/Financial": 1200,             // typical $25/mo State Farm + ~$500 Progressive semi-annually
    "Medical/Pharmacy": 200,               // routine is $60-100; big one-offs should be excluded manually

    "Grocery": 500,                      // married median $301, mean $339 — room for guests
    "Restaurants/Food & Drink": 200,       // married median just $153 — old $500 was way too loose
    "Bakery/Coffee Shops": 50,             // actual avg $41, max $127

    "Entertainment/Events": 100,           // married median only $15 — you're barely spending here
    "Sports/Recreation": 175,             // median $119-132, mean $133 — fits well
    "Donation/Charity": 100,              // very infrequent, ~$31 avg when it occurs

    "Online Retail/Marketplace": 275,     // mean $310, occasional spike months
    "Retail/Shopping": 275,              // mean $405 but driven by big purchase months; $350 is honest
    "Home Improvement/Hardware": 175,    // routine ~$100-150/mo (Crosscut Hardwoods), buffer for hardware runs
    "Other": 100,                        // consistent with actual; exclude one-offs (USCIS, etc.) manually

    "Gas/Automotive": 100,               // actual gas avg only ~$55-65/mo; exclude car repairs separately
    "Transportation/Travel": 250,        // median $202, but trip spikes happen; $400 is realistic

    "Career/Growth": 200,               // LinkedIn + LeetCode + interview prep recur (~$80-150/mo)
    "Donation/Charity": 100,

    "Temporary Holds/Uncategorized": 50  // almost never triggered; $75 is plenty
};

const SPENDING_BUDGET_PER_MONTH = 4800;