"use client";
import React, {useState, useEffect, useRef} from 'react';
import favorites from '@/img/favorite.png';
import unFavorites from '@/img/unfavorite.png'
import Image from "next/image";
import unusualDesign from '../img/unusualDesign.png'
import shearLink from '../img/shear.png'
import shearLogo from '../img/shearlogo.png'
import oklogo from '../img/shearIcons/oklogo.png';
import fblogo from '../img/shearIcons/fblogo.png';
import vklogo from '../img/shearIcons/vklogo.png';
import tglogo from '../img/shearIcons/tglogo.png';
import instlogo from '../img/shearIcons/viberlogo.png';
import wtplogo from '../img/shearIcons/wtplogo.png';
import UnusualDesignMessage from "@/components/modals/unusualDesignMessage";
import axios from "axios";
import './componentsStyles.css'
import ProductSizeTable from "@/components/modals/ProductSizeTable";
import BigPhotosSlider from "@/components/modals/BigPhotosSlider";
import {OrderProvider, useOrderContext} from "@/orderContext/store";
import {BestProducts} from "@/components/homeScreen/BestProducts";
import {toast} from "sonner";
import instLogo from "@/img/shearIcons/instlogo.png";


function Images(props: { onClick: () => Window, src: any, alt: string, style: { cursor: string; width: string } }) {
    return null;
}

const ProductContainer = ({product}) => {
    const [currentImage, setCurrentImage] = useState(product.pictures[0]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [inputCurrentUrl, setInputCurrentUrl] = useState('');
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [sendUnusualDesign, setSendUnusualDesign] = useState(false)
    const wrapperRef = useRef(null);
    const [isSizeTableOpen, setIsSizeTableOpen] = useState(false);
    const [isPhotosSliderOpen, setIsPhotosSliderOpen] = useState(false);
    // @ts-ignore
    const {sessionTime, setSessionTime} = useOrderContext();

    const closeSizeTable = () => {
        setIsSizeTableOpen(false);
    };
    const toggleSizeTable = () => {
        setIsSizeTableOpen(!isSizeTableOpen);
    };

    const closePhotosSlider = () => {
        setIsPhotosSliderOpen(false);
    };
    const togglePhotosSlider = () => {
        setIsPhotosSliderOpen(!isPhotosSliderOpen);
    };

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
    }, [sessionTime]);

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

            toast(`Товар добавлен в корзину`, {
                description: `${product.title}`,
                action: {
                    label: "Отмена",
                    onClick: () => {
                        console.log("Убрать товар из корзины")
                    },
                },
            })

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
            const sessionDate = Date.now().toString();
            console.log(sessionDate);
            setSessionTime(prevSessionTime => {
                console.log(prevSessionTime);
                return sessionDate;
            });
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            console.log('Товар успешно добавлен в корзину:', newItem);
            setSelectedSize(null);
            const updatedStoredCartItems = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(updatedStoredCartItems);
            console.log('Обновленные данные корзины из localStorage:', updatedStoredCartItems);


        } else {
            toast.warning('Пожалуйста, выберите размер');
        }
    };

    enum OptionsType { ADD_TO_FAV = "ADD", DELETE_FROM_FAV = "DEL"}

    const updateFavoritesAmountInDb = async (id: string, option: OptionsType) => {
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

    const productSizes = (product) => {
        if (typeof localStorage === 'undefined') {
            console.error('localStorage is not available');
            return [];
        }

        const productsInBasket = JSON.parse(localStorage.getItem('cart'));

        if (!productsInBasket) {
            console.error('Cart is not available in localStorage');
            return product.sizes.map((item) => ({
                size: item.size,
                amount: item.amount,
            }));
        }

        const groupedCartItems = productsInBasket.reduce((acc, item) => {
            if (item.title === product.title) {
                const key = `${item.title}-${item.size}`;
                if (!acc[key]) {
                    acc[key] = { ...item, totalPrice: parseFloat(item.price), count: 1 };
                } else {
                    acc[key].totalPrice += parseFloat(item.price);
                    acc[key].count += 1;
                }
            }
            return acc;
        }, {});

        console.log(groupedCartItems);

        const resultArr = product.sizes.map((item) => {
            const size = item.size;
            const amount = item.amount;
            const countItem = groupedCartItems[`${product.title}-${size}`];
            const count = countItem ? countItem.count : 0;
            const resultCount = parseInt(amount) - parseInt(count);
            return { size: size, amount: resultCount };
        });

        console.log(resultArr);

        return resultArr;
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
            updateFavoritesAmountInDb(productId, OptionsType.DELETE_FROM_FAV);
            setIsFavorite(false);
        } else {
            favoritesArray.push(productId);
            console.log(`Товар ${productId} был добавлен в избранное`);
            updateFavoritesAmountInDb(productId, OptionsType.ADD_TO_FAV);
            setIsFavorite(true);
        }
        localStorage.setItem('favorites', JSON.stringify(favoritesArray));
        console.log("Избранные товары:", favoritesArray);
    };
    const copyLinkAndShowMessage = () => {
        let currentUrl = window.location.href;
        setCurrentUrl(currentUrl);
        setInputCurrentUrl(currentUrl);
        navigator.clipboard.writeText(currentUrl).then(() => {
            (showCopiedMessage !== true) ? setShowCopiedMessage(true) : setShowCopiedMessage(!showCopiedMessage)
        }).catch(err => console.error('Could not copy text: ', err));
    };

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
            setInputCurrentUrl('Скопировано!')
        }).catch(err => console.error('Could not copy text: ', err));
    };

    let socialMediaLogos = [
        {
            name: 'Telegram',
            logo: tglogo,
            url: `https://telegram.me/share/url?url=${encodeURIComponent(`${currentUrl}`)}`
        },
        {
            name: 'VK',
            logo: vklogo,
            url: `https://vk.com/share.php?url=${encodeURIComponent(`${currentUrl}`)}`
        },
        {
            name: 'Facebook',
            logo: fblogo,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${currentUrl}`)}`
        },
        {
            name: 'OK',
            logo: oklogo,
            url: `https://connect.ok.ru/offer?url=${encodeURIComponent(`${currentUrl}`)}`
        },
        {
            name: 'WhatsApp',
            logo: wtplogo,
            url: `https://wa.me/?text=${encodeURIComponent(`${currentUrl}`)}`
        },
        {
            name: 'Viber',
            logo: instlogo,
            url: `viber://forward?text=${encodeURIComponent(`${currentUrl}`)}`
        }
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowCopiedMessage(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);


    return (
        <OrderProvider>
            <div className='main-product-container'>
                <div className='product-info-block-head-mobile'>
                    <div>
                        <h3>{product.title}</h3>
                        <p className='product-info-price'>${product.price}.00</p>
                    </div>
                    <div className={'cart-items-btns-container'}>
                        <div className={'cart-items-btns-block'}>
                            <div className='error-button' onClick={() => setSendUnusualDesign(true)}>
                                <Image className='error-button-image' src={unusualDesign} alt='!'/>
                            </div>
                            <div className='favorite-button-block'
                                 onClick={() => handleToggleFavorite(product._id)}>
                                <Image className='favorite-button-image'
                                       src={!isFavorite ? favorites : unFavorites} alt='Favorite'/>
                            </div>
                            <div className='shear-button' onClick={copyLinkAndShowMessage}>
                                <Image className='shear-button-image' src={shearLink} alt='+'/>
                            </div>
                        </div>
                        {showCopiedMessage && (
                            <div className="shearLinkContainer" ref={wrapperRef}>
                                <div>
                                    <div className="copiedMessage">
                                        <div>
                                            <div className={'inputCurrentUrl'} style={{}}>
                                                <input type="text" value={inputCurrentUrl}/>
                                                <div className={'inputCurrentBtn'}>
                                                    <Image className={'inputCurrentBtnImg'} src={shearLogo}
                                                           onClick={copyLinkToClipboard} alt={'+'}/>
                                                </div>
                                            </div>
                                            <div className='social-links-block'>
                                                {socialMediaLogos.map((platform, index) => (
                                                    <div key={index} className='footer-social-links-block'
                                                         onClick={() => window.open(platform.url, '_blank')}>
                                                        <Image
                                                            key={index}
                                                            src={platform.logo}
                                                            alt={platform.name}
                                                        />
                                                    </div>

                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <UnusualDesignMessage
                            show={sendUnusualDesign}
                            onHide={() => setSendUnusualDesign(false)}
                            item={product}
                        />
                    </div>
                </div>
                <div className='product-main-info-container'>
                    <div className='product-container-slider'>
                        <img onClick={togglePhotosSlider} className='product-container-slider-preview'
                             src={currentImage}
                             alt={product.title}/>
                        <div className='product-thumbnails-block'>
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
                    <div className='product-info-container'>
                        <div>
                            <div className='product-info-block-header'>
                                <div>
                                    <h3>{product.title}</h3>
                                    <p className='product-info-price'>${product.price}.00</p>
                                </div>
                                <div className={'cart-items-btns-container'}>
                                    <div className={'cart-items-btns-block'}>
                                        <div className='error-button' onClick={() => setSendUnusualDesign(true)}>
                                            <Image className='error-button-image' src={unusualDesign} alt='!'/>
                                        </div>
                                        <div className='favorite-button-block'
                                             onClick={() => handleToggleFavorite(product._id)}>
                                            <Image className='favorite-button-image'
                                                   src={!isFavorite ? favorites : unFavorites} alt='Favorite'/>
                                        </div>
                                        <div className='shear-button' onClick={copyLinkAndShowMessage}>
                                            <Image className='shear-button-image' src={shearLink} alt='+'/>
                                        </div>
                                    </div>
                                    {showCopiedMessage && (
                                        <div className="shearLinkContainer" ref={wrapperRef}>
                                            <div>
                                                <div className="copiedMessage">
                                                    <div>
                                                        <div className={'inputCurrentUrl'} style={{}}>
                                                            <input type="text" value={inputCurrentUrl}/>
                                                            <div className={'inputCurrentBtn'}>
                                                                <Image key={"shear"} className={'inputCurrentBtnImg'} src={shearLogo}
                                                                       onClick={copyLinkToClipboard} alt={'+'}/>
                                                            </div>
                                                        </div>
                                                        <div className='social-links-block'>
                                                            {socialMediaLogos.map((platform, index) => (
                                                                <div key={index} className='footer-social-links-block'
                                                                     onClick={() => window.open(platform.url, '_blank')}>
                                                                    <Image
                                                                        key={"platform"}
                                                                        src={platform.logo}
                                                                        alt={platform.name}
                                                                    />
                                                                </div>

                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <UnusualDesignMessage
                                        show={sendUnusualDesign}
                                        onHide={() => setSendUnusualDesign(false)}
                                        item={product}
                                    />
                                </div>
                            </div>
                            <div className='product-additional-info-block'>
                                <h3>{product.description}</h3>
                                <div className='product-sizes-cont'>
                                    <div className='product-sizes-block'>
                                        {productSizes(product).map((size, index) => (
                                            <div
                                                key={index}
                                                className={`product-size ${selectedSize === size.size ? 'selected-size' : ''}`}
                                                onClick={() => parseInt(size.amount) <= 0 ? null : handleSizeSelection(size.size)}
                                                style={{
                                                    marginTop:'5px',
                                                    opacity: parseInt(size.amount) <= 0 ? 0.2 : 1,
                                                    cursor: parseInt(size.amount) <= 0 ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {size.size}
                                            </div>
                                        ))}
                                    </div>
                                    <p onClick={toggleSizeTable} className='product-sizes-table'>Узнать свой рамер</p>
                                </div>
                                {product.additionalInformation.map((info, index) => (
                                    <div key={index}>
                                        <b>{info.title}:</b>
                                        <p key={index}> {info.description}</p>
                                    </div>

                                ))}
                            </div>
                            {isSizeTableOpen && (
                                <ProductSizeTable onClose={closeSizeTable}/>
                            )}
                            {isPhotosSliderOpen && (
                                <BigPhotosSlider product={product} onClose={closePhotosSlider}/>
                            )}
                        </div>
                        <div className='product-btn' onClick={handleAddToCart}>
                            {selectedSize ? "Добавить в корзину" : "Выберите размер"}
                        </div>
                    </div>
                </div>
                <br/>
                <BestProducts/>
            </div>
        </OrderProvider>
    );
};

export default ProductContainer;
