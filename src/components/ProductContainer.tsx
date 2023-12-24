"use client";
import React,{useState,useEffect,useRef} from 'react';
import favorites from '@/img/favorite.png';
import unFavorites from '@/img/unfavorite.png'
import Image from "next/image";
import unusualDesign from '../img/unusualDesign.png'
import errorMsg from '../img/errorMsg.png'
import shearLink from '../img/shear.png'
import shearLogo from '../img/shearlogo.png'
import oklogo from '../img/shearIcons/oklogo.png';
import fblogo from '../img/shearIcons/fblogo.png';
import vklogo from '../img/shearIcons/vklogo.png';
import tglogo from '../img/shearIcons/tglogo.png';
import instlogo from '../img/shearIcons/viberlogo.png';
import wtplogo from '../img/shearIcons/wtplogo.png';
import UnusualDesignMessage from "@/components/unusualDesignMessage";


function Images(props: { onClick: () => Window, src: any, alt: string, style: { cursor: string; width: string } }) {
    return null;
}

const ProductContainer = ({ product }) => {
    const [currentImage, setCurrentImage] = useState(product.pictures[0]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [inputCurrentUrl, setInputCurrentUrl] = useState('');
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [sendUnusualDesign, setSendUnusualDesign] = useState(false)
    const wrapperRef = useRef(null);

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
                        <div className={'cart-items-btns-container'}>
                            <div className={'cart-items-btns-block'}>
                                <div className='error-button' onClick={() => setSendUnusualDesign(true)}>
                                    <Image className='error-button-image' src={unusualDesign} alt='!' />
                                </div>
                                <div className='favorite-button' onClick={() => handleToggleFavorite(product._id)}>
                                    <Image className='favorite-button-image' src={!isFavorite ? favorites : unFavorites} alt='Favorite' />
                                </div>
                                <div className='shear-button' onClick={copyLinkAndShowMessage}>
                                    <Image className='shear-button-image' src={shearLink} alt='+' />
                                </div>
                            </div>
                            {showCopiedMessage && (
                                <div className="shearLinkContainer" ref={wrapperRef}>
                                    <div>

                                        <div className="copiedMessage">
                                            <div>
                                                <div className={'inputCurrentUrl'} style={{

                                                }}>
                                                    <input type="text" value={inputCurrentUrl}/>
                                                    <div className={'inputCurrentBtn'}>
                                                        <Image className={'inputCurrentBtnImg'} src={shearLogo} onClick={copyLinkToClipboard} alt={'+'}/>
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginTop: "10px",
                                                    marginBottom: "5px"
                                                }}>
                                                    {socialMediaLogos.map((platform, index) => (
                                                        <Image
                                                            key={index}
                                                            style={{width: '24px', cursor: 'pointer'}}
                                                            src={platform.logo}
                                                            alt={platform.name}
                                                            onClick={() => window.open(platform.url, '_blank')}
                                                        />
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
                                style={{ opacity: parseInt(size.amount) === 0 ? 0.2 : 1, cursor: parseInt(size.amount) === 0 ? 'not-allowed' : 'pointer' }}
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
