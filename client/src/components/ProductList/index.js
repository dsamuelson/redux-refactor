import React, { useEffect } from 'react';
import ProductItem from '../ProductItem';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';
import store from '../../store';
import { useSelector } from 'react-redux'

function ProductList() {
  const storeCurrentCategory = useSelector(state => state.categories);
  const currentCategory = storeCurrentCategory.currentCategory;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const storeProducts = useSelector(state => state.products)
  const products = storeProducts.products;

  useEffect(() => {
    if (data) {
      store.dispatch({
        type: 'UPDATE_PRODUCTS',
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        store.dispatch({
          type: 'UPDATE_PRODUCTS',
          products: products,
        });
      });
    }
  }, [data, loading]);

  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
