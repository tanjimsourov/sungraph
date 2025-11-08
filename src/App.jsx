import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Dashboards (assumed to exist in project)
import EnergyDashboard from './energy-dashboard';
import SolarEnergyDashboard from './SolarEnergyDashboard';

// CO₂ pages
import Co2HousePage from './pages/Co2HousePage';
import Co2DonutPage from './pages/Co2DonutPage';
import CO2HouseholdsPage from './pages/CO2HouseholdsPage';
import CO2SavingsTreesPage from './pages/CO2SavingsTreesPage';

// Climate impact page
import ClimateClassicModernPage from './pages/ClimateClassicModernPage';

// Solar pages
import SolarLinePage from './pages/SolarLinePage';
import SolarBarPage from './pages/SolarBarPage';
import SolarDistributionPage from './pages/SolarDistributionPage';
import SolarMonthlyPage from './pages/SolarMonthlyPage';

// Battery pages
import BatteryForSolarPage from './pages/BatteryForSolarPage';
import BatteryShowcaseFullScreen from './pages/BatteryShowcaseFullScreen';
import BatterySimple from './pages/BatterySimple';
import BatterySearchPage from './pages/BatterySearchPage';

// EV charging page
import EVChargingStationsPage from './pages/EVChargingStationsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to our CO₂ savings trees page */}
        <Route path="/" element={<Navigate to="/co2-savings-trees" replace />} />

        {/* Dashboard routes */}
        <Route path="/solar" element={<SolarEnergyDashboard />} />
        <Route path="/energy" element={<EnergyDashboard />} />

        {/* CO₂ pages */}
        <Route path="/co2-house" element={<Co2HousePage />} />
        <Route path="/co2-donut" element={<Co2DonutPage />} />
        <Route path="/co2-households" element={<CO2HouseholdsPage />} />
        <Route path="/co2-savings-trees" element={<CO2SavingsTreesPage />} />

        {/* Climate impact page */}
        <Route path="/climate-impact-modern" element={<ClimateClassicModernPage />} />

        {/* Solar pages */}
        <Route path="/solar-line" element={<SolarLinePage />} />
        <Route path="/solar-bar" element={<SolarBarPage />} />
        <Route path="/solar-distribution" element={<SolarDistributionPage />} />
        <Route path="/solar-monthly" element={<SolarMonthlyPage />} />

        {/* Battery pages */}
        <Route path="/battery-solar" element={<BatteryForSolarPage />} />
        <Route path="/battery-showcase" element={<BatteryShowcaseFullScreen />} />
        <Route path="/battery" element={<BatterySimple />} />
        <Route path="/battery-search" element={<BatterySearchPage />} />

        {/* EV charging page */}
        <Route path="/ev-charging" element={<EVChargingStationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;