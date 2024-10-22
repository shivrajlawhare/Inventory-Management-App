import React from 'react';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';

const App = () => {
  return (
    <div>
      <h1>Inventory Management Application</h1>
      <AddProduct />
      <ProductList />
    </div>
  );
};

export default App;
