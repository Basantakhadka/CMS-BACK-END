export function formatAmount(amount?: number | string): string {
    // Check if the amount is undefined or not a number
    if (amount === undefined || (typeof amount === 'string' && isNaN(Number(amount)))) {
      return '0.00';
    }
  
    // Format the number with commas and two decimal places
    return Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }