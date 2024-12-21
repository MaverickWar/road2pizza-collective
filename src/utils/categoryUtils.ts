export const getCategorySlug = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'Neapolitan': 'neapolitan',
    'New York Style': 'new-york',
    'Detroit Style': 'detroit',
    'Chicago Deep Dish': 'chicago',
    'Sicilian': 'sicilian',
    'Thin & Crispy': 'thin-crispy',
    'American': 'american',
    'Other Styles': 'other'
  };
  return categoryMap[category] || category.toLowerCase().replace(/ /g, '-');
};