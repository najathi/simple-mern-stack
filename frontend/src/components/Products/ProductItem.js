import React from 'react';

import './ProductItem.css';

const ProductItem = props => {
  return (
    <div onClick={props.deleteProduct}>
      <li className="product-item">
        <h2>{props.name}</h2>
        <p>Price: ${props.price}</p>
      </li>
    </div>
  );
};

export default ProductItem;
