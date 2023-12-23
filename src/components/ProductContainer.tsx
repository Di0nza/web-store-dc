"use client";
import React,{useState,useEffect} from 'react';
import favorites from '@/img/favorite.png';
import unFavorites from '@/img/unfavorite.png'
import Image from "next/image";

const ProductContainer = ({ product }) => {
    const [currentImage, setCurrentImage] = useState(product.pictures[0]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCartItems);
        console.log(storedCartItems);
        const favorites = localStorage.getItem('favorites');
        if (favorites) {
            const favoritesArray = JSON.parse(favorites);
            const productId = product._id;
            setIsFavorite(favoritesArray.includes(productId));
        }
    }, []);

    useEffect(()=>{
        console.log(product)
    },[product])

    const changeImage = (newImage) => {
        setCurrentImage(newImage);
    };

    const handleSizeSelection = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = () => {
        if (selectedSize) {
            const newItem = {
                id: product._id,
                title: product.title,
                description: product.description,
                category: product.category,
                image: product.pictures[0],
                price: product.price,
                size: selectedSize,
            };
            const updatedCartItems = [...cartItems, newItem];
            setCartItems(updatedCartItems);
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            console.log('Товар успешно добавлен в корзину:', newItem);
            setSelectedSize(null);
            const updatedStoredCartItems = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(updatedStoredCartItems);
            console.log('Обновленные данные корзины из localStorage:', updatedStoredCartItems);
            window.location.reload();
        } else {
            alert('Пожалуйста, выберите размер');
        }
    };
    const handleToggleFavorite = (productId: string) => {
        let favoritesArray: string[] = [];
        const favorites = localStorage.getItem('favorites');
        if (favorites) {
            favoritesArray = JSON.parse(favorites);
        }
        const index = favoritesArray.indexOf(productId);
        if (index !== -1) {
            favoritesArray.splice(index, 1);
            console.log(`Товар ${productId} был удален из избранного`);
            setIsFavorite(false);
        } else {
            favoritesArray.push(productId);
            console.log(`Товар ${productId} был добавлен в избранное`);
            setIsFavorite(true);
        }
        localStorage.setItem('favorites', JSON.stringify(favoritesArray));
        console.log("Избранные товары:", favoritesArray);
    };



    return (
        <div className='product-container'>
            <div className='product-slider'>
                <img className='product-slider-preview' src={currentImage} alt={product.title} />
                <div className='product-thumbnails'>
                    {product.pictures.map((image, index) => (
                        <img
                            key={index}
                            className={`product-thumbnail ${image === currentImage ? 'selected' : ''}`}
                            src={image}
                            alt={`Thumbnail ${index}`}
                            onClick={() => changeImage(image)}
                        />
                    ))}
                </div>
            </div>
            <div className='product-info-block'>
                <div>
                    <div className='product-info-block-head'>
                        <div>
                            <h3>{product.title}</h3>
                            <p className='product-info-price'>${product.price}.00</p>
                        </div>
                        <div className='favorite-button' onClick={() => handleToggleFavorite(product._id)}>
                            <Image className='favorite-button-image' src={!isFavorite ? favorites : unFavorites} alt='Favorite' />
                        </div>
                    </div>


                    <div className='product-additionalInformation-block'>
                        <h4>{product.category}</h4>
                        <p>{product.description}</p>
                        {product.additionalInformation.map((info, index) => (
                            <span key={index}><b>{info.title}:</b> {info.description}</span>
                        ))}
                    </div>

                    <div className='product-sizes-block'>
                        {product.sizes.map((size, index) => (
                            <div
                                key={index}
                                className={`product-size ${selectedSize === size.size ? 'selected-size' : ''}`}
                                onClick={() => parseInt(size.amount) !== 0 && handleSizeSelection(size.size)}
                                style={{ opacity: parseInt(size.amount) === 0 ? 0.5 : 1, cursor: parseInt(size.amount) === 0 ? 'not-allowed' : 'pointer' }}
                            >
                                {size.size}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='product-btn' onClick={handleAddToCart}>
                    {selectedSize ? "Добавить в корзину" : "Выберете размер"}
                </div>
            </div>
        </div>
    );
};

export default ProductContainer;
