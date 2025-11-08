// Dummy data for the SolarLinePage.
// Shows minimum, average and maximum monthly solar yields as percentages of annual total.

const solarLineData = {
  labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  datasets: [
    {
      label: 'gemiddeld',
      data: [1, 2, 6, 12.5, 15, 15, 14, 11, 8, 4.5, 2, 1],
      borderColor: '#2f5597',
      backgroundColor: 'rgba(47,85,151,0.12)',
      tension: 0.42,
      fill: true,
      pointRadius: 3,
    },
    {
      label: 'minimum',
      data: [1, 2, 5, 11, 13, 13, 12, 10, 7, 2.5, 1, 0.5],
      borderColor: '#c00000',
      backgroundColor: 'rgba(192,0,0,0.08)',
      tension: 0.42,
      fill: false,
      pointRadius: 3,
    },
    {
      label: 'maximum',
      data: [2, 5, 9, 16, 18, 18, 16, 13, 10, 6, 3, 1],
      borderColor: '#548235',
      backgroundColor: 'rgba(84,130,53,0.1)',
      tension: 0.42,
      fill: false,
      pointRadius: 3,
    },
  ],
};

export default solarLineData;