import Products from "../mockData/mockProducts.json";
import axios from "axios";
import {IProduct} from "@/types/Product";

export const getData = async () => {
    try {
        return Products.Products;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const getAllProductsAdmin = async ()=>{
    try {
        return await axios.get("/api/admin/products");
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const getAllProductsUser = async ()=>{
    try {
        return await axios.get("/api/users/products");
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
export const getDataBySearch = async (search: string) => {
    try {
        const data = await axios.get("/api/admin/products");
        const products = data.data.products as IProduct[];
        console.log(products)
        const foundProducts = products.filter(product =>
            product.title.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase())
        );
        console.log(foundProducts)
        return foundProducts;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
