import React, { useEffect, useState } from 'react';
import dynamoDB from '../awsConfig';
import { ScanCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProductID, setEditingProductID] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        TableName: 'InventoryTable',
      };

      try {
        const command = new ScanCommand(params);
        const data = await dynamoDB.send(command);
        setProducts(data.Items);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (productID) => {
    const params = {
      TableName: 'InventoryTable',
      Key: {
        productID: productID,
      },
    };

    try {
      const command = new DeleteCommand(params);
      await dynamoDB.send(command);
      setProducts(products.filter(product => product.productID !== productID));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const startEditing = (product) => {
    setEditingProductID(product.productID);
    setUpdatedName(product.productName);
    setUpdatedQuantity(product.quantity);
    setUpdatedPrice(product.price);
  };

  const updateProduct = async () => {
    const params = {
      TableName: 'InventoryTable',
      Key: {
        productID: editingProductID,
      },
      UpdateExpression: 'set #name = :name, #quantity = :quantity, #price = :price',
      ExpressionAttributeNames: {
        '#name': 'productName',
        '#quantity': 'quantity',
        '#price': 'price',
      },
      ExpressionAttributeValues: {
        ':name': updatedName,
        ':quantity': updatedQuantity,
        ':price': updatedPrice,
      },
    };

    try {
      const command = new UpdateCommand(params);
      await dynamoDB.send(command);
      setProducts(
        products.map((product) =>
          product.productID === editingProductID
            ? { ...product, productName: updatedName, quantity: updatedQuantity, price: updatedPrice }
            : product
        )
      );
      setEditingProductID(null);
      setUpdatedName('');
      setUpdatedQuantity('');
      setUpdatedPrice('');
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product List</h2>
      <ul className="space-y-4">
        {products.map((product, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-4 border border-gray-300 rounded-md"
          >
            <div>
              {product.productID} - {product.productName} - {product.quantity} - ${product.price}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => deleteProduct(product.productID)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => startEditing(product)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingProductID && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Update Product</h3>
          <input
            type="text"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Product Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
          <input
            type="number"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Quantity"
            value={updatedQuantity}
            onChange={(e) => setUpdatedQuantity(e.target.value)}
          />
          <input
            type="number"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Price"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
          />
          <div className="space-x-2">
            <button
              onClick={updateProduct}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditingProductID(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
