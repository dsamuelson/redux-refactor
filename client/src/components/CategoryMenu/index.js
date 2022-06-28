import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import { useSelector, useDispatch } from 'react-redux';

import store from '../../store';

function CategoryMenu() {
  const dispatch = useDispatch();
  const stateCategories = useSelector(state => state.categories);
  const categories = stateCategories.categories

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: 'UPDATE_CATEGORIES',
        categories: categoryData.categories,
      });
      categoryData.categories.forEach((category) => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then((categories) => {
        dispatch({
          type: 'UPDATE_CATEGORIES',
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = (id) => { 
    dispatch({
      type: 'UPDATE_CURRENT_CATEGORY',
      currentCategory: `${id}`,
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.length && categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
