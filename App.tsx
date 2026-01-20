import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import CreateOrder from './pages/CreateOrder';
import OrderDetail from './pages/OrderDetail';
import Clients from './pages/Clients';
import Inventory from './pages/Inventory';
import Communication from './pages/Communication';
import Agenda from './pages/Agenda';
import Team from './pages/Team';
import TeamMemberProfile from './pages/TeamMemberProfile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Quotes from './pages/Quotes';
import CreateQuote from './pages/CreateQuote';
import Contracts from './pages/Contracts';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import TechnicianLogin from './pages/TechnicianLogin';
import MobileDashboard from './pages/MobileDashboard';
import MobileOrderDetail from './pages/MobileOrderDetail';
import MobileAgenda from './pages/MobileAgenda';
import MobileNotifications from './pages/MobileNotifications';
import MobileChat from './pages/MobileChat';
import MobileProfile from './pages/MobileProfile';
import MobileCreateOrder from './pages/MobileCreateOrder';
import Layout from './components/Layout';
import Landing from './pages/Landing';

// Import new pages from downloader
import InvoiceList from './downloader/pages/invoices/InvoiceList';
import InvoiceForm from './downloader/pages/invoices/InvoiceForm';
import InvoicePreview from './downloader/pages/invoices/InvoicePreview';
import InvoicePrintConfig from './downloader/pages/invoices/InvoicePrintConfig';
import ProductList from './downloader/pages/products/ProductList';
import ProductForm from './downloader/pages/products/ProductForm';
import ContractList from './downloader/pages/contracts/ContractList';
import ContractForm from './downloader/pages/contracts/ContractForm';
import ContractDetails from './downloader/pages/contracts/ContractDetails';

// Layout wrapper to handle sidebar visibility
const AppLayout: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/new" element={<CreateOrder />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/quotes/new" element={<CreateQuote />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/new" element={<InvoiceForm />} />
        <Route path="/invoices/:id" element={<InvoicePreview />} />
        <Route path="/invoices/:id/print-config" element={<InvoicePrintConfig />} />
        <Route path="/contracts" element={<ContractList />} />
        <Route path="/contracts/new" element={<ContractForm />} />
        <Route path="/contracts/:id" element={<ContractDetails />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/:id" element={<TeamMemberProfile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mobile/login" element={<TechnicianLogin />} />
            <Route path="/mobile/dashboard" element={<MobileDashboard />} />
            <Route path="/mobile/order/:id" element={<MobileOrderDetail />} />
            <Route path="/mobile/agenda" element={<MobileAgenda />} />
            <Route path="/mobile/notifications" element={<MobileNotifications />} />
            <Route path="/mobile/chat" element={<MobileChat />} />
            <Route path="/mobile/profile" element={<MobileProfile />} />
            <Route path="/mobile/order/new" element={<MobileCreateOrder />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
};

export default App;
