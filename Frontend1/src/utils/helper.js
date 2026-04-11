import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email); 
};

export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "";

  const words = name.trim().split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};


export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
  ? `${formattedInteger} .${fractionalPart}`
  : formattedInteger;
};

export const prepareExpenseBarCharData = (data = []) => {
  // Sort data by date first (Oldest to Newest)
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const charData = sortedData.map((item) => ({
    // Change 'month' to 'label' and include the Category name
    // This prevents the chart from getting confused between different expenses in the same month
    month: `${moment(item.date).format("DD MMM")} - ${item.category}`, 
    category: item?.category,
    amount: item?.amount,
  }));

  return charData;
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));

  const charData = sortedData.map((item) => ({
    month: `${moment(item.date).format("DD MMM")} - ${item.source}`,
    amount: item?.amount,
    source: item?.source,
  }));

  return charData;
};

export const prepareExpenseLineCharData =(data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const charData = sortedData.map((item) => ({
    combinedLabel: `${moment(item.date).format('Do MMM')} - ${item.category}`,
    amount: item?.amount,
    category: item?.category,
  }));

  return charData;
};

export const calculateBudgetProgress = (totalSpent, limit) => {
  if (!limit || limit === 0) return 0;
  const percentage = (totalSpent / limit) * 100;
  return Math.min(percentage, 100); // Caps at 100% for the UI
};

// Add this to your existing utils/helper.js

export const prepareSavingsBarChartData = (data = []) => {
  // 1. Sort data by date (Oldest to Newest)
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  // 2. Map data specifically for the Savings Chart
  const charData = sortedData.map((item) => ({
    // Format: "30 Mar - Saving"
    month: `${moment(item.date).format("DD MMM")} - Saving`, 
    amount: item?.amount || 0,
    // We include raw date just in case you need it for tooltips later
    date: item.date, 
  }));

  return charData;
};