export const currencies = {
    USD: "United States Dollar",
    EUR: "Euro",
    JPY: "Japanese Yen",
    GBP: "UK Pound",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Yuan",
    SEK: "Swedish Krona",
    NZD: "New Zealand Dollar",
    MXN: "Mexican Peso",
    SGD: "Singapore Dollar",
    HKD: "Hong Kong Dollar",
    NOK: "Norwegian Krone",
    KRW: "South Korean Won",
    TRY: "Turkish Lira",
    RUB: "Russian Ruble",
    INR: "Indian Rupee",
    BRL: "Brazilian Real",
    ZAR: "South African Rand",
    DKK: "Danish Krone",
    PLN: "Polish Zloty",
    THB: "Thai Baht",
    IDR: "Indonesian Rupiah",
    HUF: "Hungarian Forint",
    CZK: "Czech Koruna",
    ILS: "Israeli Shekel",
    CLP: "Chilean Peso",
    PHP: "Philippine Peso",
    AED: "UAE Dirham",
    COP: "Colombian Peso",
    SAR: "Saudi Riyal",
    MYR: "Malaysian Ringgit",
    RON: "Romanian Leu"
};

export const currenciesSymbols = {
    USD: "$",    
    EUR: "€",  
    JPY: "¥",    
    GBP: "£",   
    AUD: "A$",   
    CAD: "C$",  
    CHF: "CHF",
    CNY: "¥",   
    SEK: "kr",   
    NZD: "NZ$",  
    MXN: "Mex$", 
    SGD: "S$",   
    HKD: "HK$",  
    NOK: "kr",   
    KRW: "₩",    
    TRY: "₺",    
    RUB: "₽",    
    INR: "₹",    
    BRL: "R$",   
    ZAR: "R",    
    DKK: "kr",   
    PLN: "zł",   
    THB: "฿",    
    IDR: "Rp",   
    HUF: "Ft",   
    CZK: "Kč",   
    ILS: "₪",    
    CLP: "CLP$", 
    PHP: "₱",    
    AED: "د.إ",  
    COP: "COL$", 
    SAR: "﷼",    
    MYR: "RM",   
    RON: "lei"   
};


export const popularCitiesRelLocation = {
    "Italy": ["Rome", "Venice", "Florence", "Milan", "Naples"],
    "France": ["Paris", "Nice", "Marseille", "Lyon", "Bordeaux"],
    "Spain": ["Barcelona", "Madrid", "Seville", "Valencia", "Granada"],
    "USA": ["New York", "Los Angeles", "Las Vegas", "Chicago", "Miami"],
    "Germany": ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt"],
    "Japan": ["Tokyo", "Kyoto", "Osaka", "Hokkaido", "Nara"],
    "Thailand": ["Bangkok", "Phuket", "Chiang Mai", "Krabi", "Pattaya"],
    "Mexico": ["Mexico City", "Cancun", "Playa del Carmen", "Guadalajara", "Tijuana"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    "Brazil": ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador", "Fortaleza"],
    "United Kingdom": ["London", "Edinburgh", "Manchester", "Liverpool", "Bristol"],
    "India": ["New Delhi", "Mumbai", "Goa", "Jaipur", "Bangalore"],
    "China": ["Beijing", "Shanghai", "Xi'an", "Chengdu", "Guilin"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"],
    "Russia": ["Moscow", "Saint Petersburg", "Sochi", "Kazan", "Vladivostok"],
    "Greece": ["Athens", "Santorini", "Mykonos", "Crete", "Rhodes"],
    "Egypt": ["Cairo", "Luxor", "Sharm El Sheikh", "Alexandria", "Hurghada"],
    "Turkey": ["Istanbul", "Antalya", "Cappadocia", "Ephesus", "Izmir"],
    "South Korea": ["Seoul", "Busan", "Jeju Island", "Incheon", "Gyeongju"],
    "South Africa": ["Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth"],
    "Argentina": ["Buenos Aires", "Mendoza", "Córdoba", "Bariloche", "Rosario"],
    "Thailand": ["Bangkok", "Phuket", "Chiang Mai", "Krabi", "Pattaya"],
    "New Zealand": ["Auckland", "Wellington", "Queenstown", "Christchurch", "Rotorua"],
    "Portugal": ["Lisbon", "Porto", "Funchal", "Albufeira", "Sintra"],
    "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Groningen"]
}


export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const weekday = date.toLocaleString("en", { weekday: "short" }); 
    const month = date.toLocaleString("en", { month: "short" });
  
    return `${weekday}, ${day} ${month}`;
};


export const popularCities = [
    "New York",
    "Paris",
    "Tokyo",
    "London",
    "Rome",
    "Dubai",
];

export const firstPriceIds = {
    "New York": "MCNYCEXM",
    "Paris": "RTPARMAI",
    "Tokyo": "ICTYOICB",
    "London": "MCLONPLM",
    "Rome": "BWROM073",
    "Dubai": "HLDXB111"
}
  