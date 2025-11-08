// Dummy data for the SolarBarPage.
// The chart shows monthly solar yield as a percentage of the annual total for multiple years.

const solarBarData = {
  labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  datasets: [
    { label: '2022', data: [1, 2, 9, 12, 15, 16, 16, 13, 9, 4, 2, 1] },
    { label: '2021', data: [1, 2, 8, 14, 15, 17, 14, 12, 10, 3, 2, 1] },
    { label: '2020', data: [1, 2, 9, 13, 16, 16, 13, 12, 9, 4, 2, 1] },
    { label: '2019', data: [2, 3, 6, 14, 15, 16, 15, 11, 9, 5, 2, 1] },
    { label: '2018', data: [1, 3, 8, 13, 15, 16, 14, 12, 8, 5, 2, 1] },
    { label: '2017', data: [1, 2, 8, 12, 14, 15, 13, 11, 9, 5, 2, 1] },
    { label: '2016', data: [2, 2, 9, 13, 14, 13, 13, 10, 9, 4, 2, 1] },
    { label: '2015', data: [1, 2, 9, 12, 13, 13, 13, 12, 9, 3, 2, 1] },
  ],
};

export default solarBarData;