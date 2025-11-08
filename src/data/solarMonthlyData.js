// Dummy data for the SolarMonthlyPage.
// Contains monthly energy yields for the current and previous year in kWh.

export const MONTHS = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

export const solarMonthlyData = {
  labels: MONTHS,
  datasets: [
    {
      label: '2024',
      data: [120, 150, 210, 320, 410, 480, 500, 470, 360, 240, 150, 110],
      backgroundColor: 'rgba(55, 130, 246, 0.85)',
      borderRadius: 8,
    },
    {
      label: '2023',
      data: [110, 145, 200, 300, 390, 460, 480, 450, 340, 230, 140, 100],
      backgroundColor: 'rgba(118, 111, 208, 0.85)',
      borderRadius: 8,
    },
  ],
};

export default solarMonthlyData;