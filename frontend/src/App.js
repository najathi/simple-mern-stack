import React, { useState, useEffect, useMemo } from 'react';

import Header from './components/Header/Header';
import NewProduct from './components/Products/NewProduct';
import ProductList from './components/Products/ProductList';
import './App.css';

function App() {
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/products');

      const responseData = await response.json();

      setLoadedProducts(responseData.products);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const addProductHandler = async (productName, productPrice) => {
    try {
      const newProduct = {
        title: productName,
        price: +productPrice // "+" to convert string to number
      };
      let hasError = false;
      const response = await fetch('http://localhost:5000/product', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        hasError = true;
      }

      const responseData = await response.json();

      if (hasError) {
        throw new Error(responseData.message);
      }

      setLoadedProducts(prevProducts => {
        return prevProducts.concat({
          ...newProduct,
          id: responseData.product.id
        });
      });
    } catch (error) {
      alert(error.message || 'Something went wrong!');
    }
  };

  const productDeleteHandler = async (id) => {

    try {

      let hasError = false;

      const deleteProduct = await fetch('http://localhost:5000/product/' + id, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!deleteProduct.ok) {
        hasError = true;
      }

      const responseDeleteProduct = await deleteProduct.json();

      if (hasError) {
        throw new Error(responseDeleteProduct.message);
      }

      if (deleteProduct.ok) {

        const fetchProduct = await fetch('http://localhost:5000/products');

        if (!fetchProduct.ok) {
          hasError = true;
        }

        const responseData = await fetchProduct.json();

        if (hasError) {
          throw new Error(responseData.message);
        }

        setLoadedProducts(responseData.products);

      }

    } catch (error) {
      alert(error.message || 'Something went wrong!');
    }

  }

  return useMemo(() => (
    <React.Fragment>
      <Header />
      <main>
        <NewProduct onAddProduct={addProductHandler} />
        {isLoading && <p className="loader">Loading...</p>}
        {!isLoading && <ProductList items={loadedProducts} deleteProduct={productDeleteHandler} />}
      </main>
    </React.Fragment>
  ), [loadedProducts]);
}

export default App;
