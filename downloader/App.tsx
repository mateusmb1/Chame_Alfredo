import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceForm from './pages/invoices/InvoiceForm';
import InvoicePreview from './pages/invoices/InvoicePreview';
import InvoicePrintConfig from './pages/invoices/InvoicePrintConfig';
import ContractList from './pages/contracts/ContractList';
import ContractDetails from './pages/contracts/ContractDetails';
import ContractForm from './pages/contracts/ContractForm';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* Invoices */}
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/new" element={<InvoiceForm />} />
          <Route path="invoices/:id" element={<InvoicePreview />} /> {/* Using Preview as detail view for now */}
          <Route path="invoices/:id/preview" element={<InvoicePreview />} />
          <Route path="invoices/:id/print-config" element={<InvoicePrintConfig />} />

          {/* Contracts */}
          <Route path="contracts" element={<ContractList />} />
          <Route path="contracts/new" element={<ContractForm />} />
          <Route path="contracts/:id" element={<ContractDetails />} />

          {/* Products */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          
          {/* Redirects/Placeholders */}
          <Route path="clients" element={<Navigate to="/contracts" replace />} />
          <Route path="orders" element={<Navigate to="/invoices" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
