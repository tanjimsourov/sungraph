// Dummy data for EV charging stations.
// Each station has a name, available and total connector counts, power (kW), price per kWh, and connector type.
// Names are left unchanged as they refer to real places; other labels are translated in the component.

const chargingStations = [
  { name: 'Amsterdam Centrum', available: 2, total: 4, power: 50, price: 0.35, type: 'SNELLADER' },
  { name: 'Rotterdam Zuid', available: 4, total: 6, power: 22, price: 0.29, type: 'TYPE 2' },
  { name: 'Utrecht Central', available: 1, total: 2, power: 150, price: 0.45, type: 'CCS' },
  { name: 'Den Haag HS', available: 3, total: 4, power: 50, price: 0.38, type: 'SNELLADER' },
  { name: 'Eindhoven Strijp', available: 5, total: 8, power: 22, price: 0.27, type: 'TYPE 2' },
];

export default chargingStations;