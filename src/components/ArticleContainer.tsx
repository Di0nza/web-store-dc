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

const ArticleContainer = ({article}) => {
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
            const productId = article._id;
            setIsFavorite(favoritesArray.includes(productId));
        }
    }, [sessionTime]);

    useEffect(()=>{
        console.log(article)
    },[article])


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
                <div className='article-info-block'>
                    <Image src={article.backgroundImage} className={'article-info-background-image'} width={1000}
                           height={50} alt={'bg'}></Image>
                    <div className='article-info-header-content'>
                        <div className='article-info-header'>
                            <div className='article-info-header-title'>
                                <h1>{article.title}</h1>
                            </div>
                            <div className={'cart-items-btns-container'}>
                                <div className={'cart-items-btns-block'}>
                                    <div className='error-button' onClick={() => setSendUnusualDesign(true)}>
                                        <Image className='error-button-image' src={unusualDesign} alt='!'/>
                                    </div>
                                    <div className='favorite-button-block'
                                         onClick={() => handleToggleFavorite(article._id)}>
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
                                                            <Image key={"shear"} className={'inputCurrentBtnImg'}
                                                                   src={shearLogo}
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
                                    item={article}
                                />
                            </div>
                        </div>
                        <div className={'categories-head-block'}>
                            {article.categories.map((category, index) => (
                                <div key={index} className={'category-head-item'}>
                                    {category.name}
                                </div>
                            ))}
                        </div>
                        <p className={'categories-head-description'}>{article.description}</p>
                        <div className={'article-html-content'} dangerouslySetInnerHTML={{__html: article.content}}/>
                    </div>
                </div>
            </div>
        </OrderProvider>
    );
};

export default ArticleContainer;
