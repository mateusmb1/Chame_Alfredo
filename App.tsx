import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import CreateOrder from './pages/CreateOrder';
import OrderDetail from './pages/OrderDetail';
import ServiceOrderPrintConfig from './pages/ServiceOrderPrintConfig';
import Clients from './pages/Clients';
import Inventory from './pages/Inventory';
import Communication from './pages/Communication';
import Agenda from './pages/Agenda';
import Team from './pages/Team';
import TeamMemberProfile from './pages/TeamMemberProfile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Quotes from './pages/Quotes';
import QuoteCreate from './pages/QuoteCreate';
import QuoteEdit from './pages/QuoteEdit';
import QuoteDetail from './pages/QuoteDetail';
import QuotePrintConfig from './pages/QuotePrintConfig';
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
import MobileLayout from './components/MobileLayout';
import Landing from './pages/Landing';

// Import new pages from downloader
import InvoiceList from './downloader/pages/invoices/InvoiceList';
import InvoiceForm from './downloader/pages/invoices/InvoiceForm';
import InvoicePreview from './downloader/pages/invoices/InvoicePreview';
import InvoicePrintConfig from './downloader/pages/invoices/InvoicePrintConfig';
import ProductList from './downloader/pages/products/ProductList';
import ProductForm from './downloader/pages/products/ProductForm';

// Client Portal Pages
import ClientLayout from './components/ClientLayout';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientQuotes from './pages/client/ClientQuotes';
import ClientInvoices from './pages/client/ClientInvoices';
import ClientChat from './pages/client/ClientChat';
import ClientReports from './pages/client/ClientReports';

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
        <Route path="/orders/:id/print" element={<ServiceOrderPrintConfig />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/quotes/new" element={<QuoteCreate />} />
        <Route path="/quotes/:id" element={<QuoteDetail />} />
        <Route path="/quotes/:id/edit" element={<QuoteEdit />} />
        <Route path="/quotes/:id/print-config" element={<QuotePrintConfig />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/new" element={<InvoiceForm />} />
        <Route path="/invoices/:id" element={<InvoicePreview />} />
        <Route path="/invoices/:id/print-config" element={<InvoicePrintConfig />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/contracts/new" element={<Contracts />} />
        <Route path="/contracts/:id" element={<Contracts />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/clients" element={<Clients />} />
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

const ClientAppLayout: React.FC = () => {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/quotes" element={<ClientQuotes />} />
        <Route path="/invoices" element={<ClientInvoices />} />
        <Route path="/chat" element={<ClientChat />} />
        <Route path="/reports" element={<ClientReports />} />
      </Routes>
    </ClientLayout>
  );
};
const MobileAppLayout: React.FC = () => {
  return (
    <MobileLayout>
      <Routes>
        <Route path="/login" element={<TechnicianLogin />} />
        <Route path="/dashboard" element={<MobileDashboard />} />
        <Route path="/order/:id" element={<MobileOrderDetail />} />
        <Route path="/agenda" element={<MobileAgenda />} />
        <Route path="/notifications" element={<MobileNotifications />} />
        <Route path="/chat" element={<MobileChat />} />
        <Route path="/profile" element={<MobileProfile />} />
        <Route path="/order/new" element={<MobileCreateOrder />} />
      </Routes>
    </MobileLayout>
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
            <Route path="/mobile/*" element={<MobileAppLayout />} />
            <Route path="/client/*" element={<ClientAppLayout />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
};

export default App;
