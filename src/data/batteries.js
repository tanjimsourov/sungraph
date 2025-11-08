// Dummy battery data for the battery showcase and search pages.
// Each battery has an id, a display name, brand and an array of tags.
// Tags are left in Dutch; translation of tags happens in the page logic.

const batteries = [
  { id: 1, name: "Wandbatterij 10 kWh", brand: "SolarEdge", tags: ["10 kWh", "Muur", "Hybride"] },
  { id: 2, name: "Modulaire accu-stack", brand: "Bolk Energy", tags: ["Uitbreidbaar", "5 → 20 kWh"] },
  { id: 3, name: "Thuisaccu 5 kWh", brand: "Sun Eco", tags: ["Compact", "Tussenwoning"] },
  { id: 4, name: "Off-grid batterijkast", brand: "VolopGroen", tags: ["Schuur/bedrijf", "IP-beschermd"] },
];

export default batteries;