import { combineReducers } from "redux";

import catagoriesReducer from "./features/categories/categoriesSlice";
import productsReducer from "./features/products/productsSlice";
import cartReducer from "./features/cart/cartSlice";

const rootReducer = combineReducers({
    categories: catagoriesReducer,
    cart: cartReducer,
    products: productsReducer
})

export default rootReducer