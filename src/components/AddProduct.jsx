import React, { useState } from 'react';
import dynamoDB from '../awsConfig';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const AddProduct = () => {
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const addProduct = async () => {
    const params = {
      TableName: 'InventoryTable',
      Item: {
        productID,
        productName,
        quantity,
        price
      }
    };

    try {
      const command = new PutCommand(params);
      await dynamoDB.send(command);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Product</h2>
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Product ID"
        value={productID}
        onChange={(e) => setProductID(e.target.value)}
      />
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="number"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="number"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button
        onClick={addProduct}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
