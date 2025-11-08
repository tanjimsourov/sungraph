// Dummy data for the Co2DonutPage.
// Contains labels and values for household CO₂ distribution across categories.

const co2DonutData = {
  labels: [
    'Eten en drinken 22%',
    'Energie in huis 19%',
    'Auto, fiets, ov 18%',
    'Kleding en spullen 11%',
    'Vliegen 9%',
    'Woning (exterieur, interieur) 8%',
    'Collectieve voorzieningen 7%',
    'Recreatie, sport, cultuur 6%',
  ],
  datasets: [
    {
      data: [22, 19, 18, 11, 9, 8, 7, 6],
      backgroundColor: [
        '#f97316',
        '#f43f5e',
        '#6366f1',
        '#22c55e',
        '#0ea5e9',
        '#facc15',
        '#14b8a6',
        '#94a3b8',
      ],
      borderWidth: 0,
      cutout: '55%',
    },
  ],
};

export default co2DonutData;