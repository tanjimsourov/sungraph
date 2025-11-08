// Dummy data for the CO2SavingsTreesPage.
// Each item defines a key and the kilograms of CO₂ saved annually by the measure.
// Label translation is handled in the page itself.

const co2Savings = [
  { key: 'ev', savedKg: 950 },        // Elektrisch rijden
  { key: 'pv', savedKg: 680 },        // Zonnepanelen
  { key: 'insulate', savedKg: 520 },  // Isolatie + lage temp. verwarming
  { key: 'diet', savedKg: 320 },      // Minder vlees/zuivel
  { key: 'heatpump', savedKg: 440 },  // Hybride warmtepomp
];

export default co2Savings;