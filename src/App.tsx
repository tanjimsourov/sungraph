import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



// CO₂ pages
import Co2HousePage from './pages/Co2HousePage.tsx';
import Co2DonutPage from './pages/Co2DonutPage.tsx';
import CO2HouseholdsPage from './pages/CO2HouseholdsPage.tsx';
import CO2SavingsTreesPage from './pages/CO2SavingsTreesPage.tsx';

// Climate impact page
import ClimateClassicModernPage from './pages/ClimateClassicModernPage.tsx';

// Solar pages
import SolarLinePage from './pages/SolarLinePage.tsx';
import SolarBarPage from './pages/SolarBarPage.tsx';
import SolarDistributionPage from './pages/SolarDistributionPage.tsx';
import SolarMonthlyPage from './pages/SolarMonthlyPage.tsx';

// New Animated Solar templates
import SolarLiveDashboard from './pages/SolarLiveDashboard.tsx';
import Solar3DVisualization from './pages/Solar3DVisualization.tsx';
import SolarFinancialAnalysis from './pages/SolarFinancialAnalysis.tsx';
import SolarEnvironmentalImpact from './pages/SolarEnvironmentalImpact.tsx';

// Battery pages
import BatteryForSolarPage from './pages/BatteryForSolarPage.tsx';
import BatteryShowcaseFullScreen from './pages/BatteryShowcaseFullScreen.tsx';
import BatterySimple from './pages/BatterySimple.tsx';
import BatterySearchPage from './pages/BatterySearchPage.tsx';

// EV charging page
import EVChargingStationsPage from './pages/EVChargingStationsPage.tsx';

// New Premium Templates
import SmartHomeDashboard from './pages/SmartHomeDashboard.tsx';
import CarbonFootprintTracker from './pages/CarbonFootprintTracker.tsx';
import RenewableEnergyAnalytics from './pages/RenewableEnergyAnalytics.tsx';
import SustainableLivingDashboard from './pages/SustainableLivingDashboard.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to our CO₂ savings trees page */}
        <Route path="/" element={<Navigate to="/co2-savings-trees" replace />} />


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

        {/* New Animated Solar template pages */}
        <Route path="/solar-live" element={<SolarLiveDashboard />} />
        <Route path="/solar-3d" element={<Solar3DVisualization />} />
        <Route path="/solar-financial" element={<SolarFinancialAnalysis />} />
        <Route path="/solar-environmental" element={<SolarEnvironmentalImpact />} />

        {/* Battery pages */}
        <Route path="/battery-solar" element={<BatteryForSolarPage />} />
        <Route path="/battery-showcase" element={<BatteryShowcaseFullScreen />} />
        <Route path="/battery" element={<BatterySimple />} />
        <Route path="/battery-search" element={<BatterySearchPage />} />

        {/* EV charging page */}
        <Route path="/ev-charging" element={<EVChargingStationsPage />} />

        {/* New Premium Template Routes */}
        <Route path="/smart-home" element={<SmartHomeDashboard />} />
        <Route path="/carbon-tracker" element={<CarbonFootprintTracker />} />
        <Route path="/renewable-analytics" element={<RenewableEnergyAnalytics />} />
        <Route path="/sustainable-living" element={<SustainableLivingDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;