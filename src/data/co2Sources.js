// Dummy data representing household CO₂ emissions per category.
// Each item has a key used for translation, a numeric co2 value (kg per year) and a color.

const co2Sources = [
  { key: 'heating', co2: 1250, color: 'rgba(239, 68, 68, 0.8)' },
  { key: 'electricity', co2: 800, color: 'rgba(234, 179, 8, 0.8)' },
  { key: 'transport', co2: 2200, color: 'rgba(34, 197, 94, 0.8)' },
  { key: 'food', co2: 1500, color: 'rgba(168, 85, 247, 0.8)' },
  { key: 'waste', co2: 400, color: 'rgba(59, 130, 246, 0.8)' },
  { key: 'other', co2: 350, color: 'rgba(156, 163, 175, 0.8)' },
];

export default co2Sources;