import '../app/profile/profileStyles.css'
import Link from "next/link";
import Image from "next/image";
import favorites from "@/img/favorite.png";
import unFavorites from "@/img/unfavorite.png";
import React, {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import axios from "axios";

type Props = {
    products: any[];
}

const Products = ({products}: Props) => {
    const [favoritesArray, setFavoritesArray] = useState<string[]>([]);
    const pathname = usePathname();

    enum OptionsType { ADD_TO_FAV = "ADD", DELETE_FROM_FAV = "DEL"}
    const updateFavoritesAmountInDb = async (id:string, option:OptionsType) =>{
        try {
            const data = {
                id: id,
                option: option
            }
            await axios.post("/api/users/products/favorites", data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const favorites = localStorage.getItem('favorites');
        if (favorites) {
            const favoritesArray = JSON.parse(favorites);
            setFavoritesArray(favoritesArray);
        }
    }, []);


    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const favorites = localStorage.getItem('favorites');
        console.log(favorites);
        if (favorites) {
            const favoritesArray = JSON.parse(favorites);
            setFavoritesArray(favoritesArray);
        }
    }, []);

    const isProductInFavorites = (productId: string) => {
        return favoritesArray.includes(productId);
    };

    const handleToggleFavorite = (productId: string) => {
        let updatedFavorites: string[] = [...favoritesArray];
        const index = updatedFavorites.indexOf(productId);

        if (index !== -1) {
            updatedFavorites.splice(index, 1);
            updateFavoritesAmountInDb(productId, OptionsType.DELETE_FROM_FAV);
            console.log(`Товар ${productId} был удален из избранного`);
        } else {
            updatedFavorites.push(productId);
            updateFavoritesAmountInDb(productId, OptionsType.ADD_TO_FAV);
            console.log(`Товар ${productId} был добавлен в избранное`);
        }

        setFavoritesArray(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className='products-block'>
            {products.map((product: any) => (
                <div key={product._id} className='product-item'>
                    <div className='product-overlay'>
                        <div className='favorite-button' onClick={() => handleToggleFavorite(product._id)}>
                            <Image
                                className='favorite-button-image'
                                src={isProductInFavorites(product._id) ? unFavorites : favorites}
                                alt='Favorite'
                            />
                        </div>
                    </div>
                    <Link href={`store/${product._id}`} >
                        <div className='product-info'>
                            <img className='product-img' src={product.pictures[0]} alt={product.title}></img>
                            <p className='product-title'>{product.title}</p>
                            <p className='product-category'>{product.category}</p>
                        </div>
                        <p className='product-price'>${product.price}.00</p>
                    </Link>
                </div>
            ))}
        </div>
    );
}
export {Products};
