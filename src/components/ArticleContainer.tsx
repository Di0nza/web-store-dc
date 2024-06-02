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
import commentsImg from "@/img/comment.svg"
import profileImg from "@/img/profile.png"
import user from "@/img/user.png"
import UnusualDesignMessage from "@/components/modals/unusualDesignMessage";
import axios from "axios";
import './componentsStyles.css'
import '@/styles/text-editor.css';
import ProductSizeTable from "@/components/modals/ProductSizeTable";
import BigPhotosSlider from "@/components/modals/BigPhotosSlider";
import {OrderProvider, useOrderContext} from "@/orderContext/store";
import {BestProducts} from "@/components/homeScreen/BestProducts";
import {toast} from "sonner";
import instLogo from "@/img/shearIcons/instlogo.png";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {EmojiPicker} from "@/components/emoji-picker";
import {onChange} from "lib0/storage";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import imgArrow from "../img/arrowB.png";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import Link from "next/link";


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
    const [comments, setComments] = useState([]);
    const user = useCurrentUser();
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
        // @ts-ignore
        const sortedComments = article.comments.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(sortedComments)
        setCartItems(storedCartItems);
        console.log(storedCartItems);
        const liked = localStorage.getItem('liked');
        if (liked) {
            const likedArray = JSON.parse(liked);
            const articleId = article._id;
            setIsFavorite(likedArray.includes(articleId));
        }
    }, [sessionTime]);

    useEffect(() => {
        console.log(article)
    }, [article])


    enum OptionsType { LIKE = "ADD", UNLIKE = "DEL"}

    const updateLikesInDb = async (id: string, option: OptionsType) => {
        try {
            const data = {
                id: id,
                option: option
            }
            await axios.post("/api/users/article/likes", data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const handleToggleLike = (articleId: string) => {
        let likedArray: string[] = [];
        const favorites = localStorage.getItem('liked');
        if (favorites) {
            likedArray = JSON.parse(favorites);
        }
        const index = likedArray.indexOf(articleId);
        if (index !== -1) {
            likedArray.splice(index, 1);
            updateLikesInDb(articleId, OptionsType.UNLIKE);
            setIsFavorite(false);
        } else {
            likedArray.push(articleId);
            updateLikesInDb(articleId, OptionsType.LIKE);
            setIsFavorite(true);
        }
        localStorage.setItem('liked', JSON.stringify(likedArray));
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

    const formSchema = z.object({
        comment: z.string().min(1),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // const url = qs.stringifyUrl({
            //     url: apiUrl,
            //     query,
            // });

            console.log(values)
            await axios.post("/api/users/article/comments", {...values, articleId: article._id}).then((data)=>{
                setComments([...comments, data.data.comment])
            });


            form.reset();
        } catch (error) {
            console.log(error);
        }
    }

    const formatDate = (date) => {
        const currentDate = new Date();
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);

        if (date.toDateString() === currentDate.toDateString()) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `Сегодня в ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `Вчера в ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        } else {
            const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${day} ${month} ${year < new Date().getFullYear() ? year : ''} в ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

    const indexOfFirstComment = (comments.length - 1) - ((currentPage - 1) * commentsPerPage);
    const indexOfLastComment = Math.max(indexOfFirstComment - commentsPerPage, 0);
    const currentComments = comments.slice(indexOfLastComment, indexOfFirstComment + 1).reverse();

    // Обработчики для переключения страниц
    const nextPage = () => {

        if (indexOfFirstComment < comments.length - 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const prevPage = () => {
        if (indexOfLastComment > 0) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const scrollToCommentBlock = (element) => {
        const commentBlock = document.getElementById(element);

        if (commentBlock) {
            commentBlock.scrollIntoView({ behavior: 'smooth' });
        }
    };


    return (
        <OrderProvider>
            <div className='main-article-container'>
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
                                    <div className='comment-button' onClick={() => scrollToCommentBlock('commentBlock')}>
                                        <Image className='comment-button-image' src={commentsImg} alt='!'/>
                                    </div>
                                    <div className='favorite-button-block'
                                         onClick={() => handleToggleLike(article._id)}>
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
                <div id={'commentBlock'} className={'commentBlock'}>
                    <h3>Комментарии</h3>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <div>
                                                <Textarea
                                                    disabled={isLoading}
                                                    placeholder="Ваш комментарий"
                                                    className={`comment-text-block`}
                                                    {...field}/>
                                                <div className="nav-comment-block">
                                                    <div className="send-emoji-button">
                                                        <EmojiPicker
                                                            onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                                                        />
                                                    </div>
                                                    {user ? (
                                                        <Button className="send-comment-button">
                                                            Отправить
                                                        </Button>
                                                    ) : (
                                                        <Link className="send-comment-link" href={'/login'}>
                                                            Войти
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <div className="comments-header">
                    <div className="comments-header-info">
                        <h3>Комментарии</h3>
                        <p>Общее количество: {comments.length}</p>
                    </div>
                    <div className="comments-header-btn">
                        <p>{Math.min(indexOfLastComment, comments.length)}-{indexOfFirstComment + 1} из {comments.length}</p>
                        <button className="comments-header-btn-left" onClick={prevPage} disabled={indexOfFirstComment === 0}>
                            <Image src={imgArrow} alt={'<'}></Image>
                        </button>
                        <button className="comments-header-btn-right" onClick={nextPage} disabled={indexOfLastComment >= comments.length}>
                            <Image src={imgArrow} alt={'>'}></Image>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col-reverse commentsListBlock">
                    {currentComments && currentComments.map((item) => {
                        return (
                            <div key={item._id}
                                 className="relative group flex items-center transition w-full commentsContent">
                                <div className="group flex gap-x-2 items-start w-full">
                                    <div className="">
                                        <Avatar>
                                            {item.image ?
                                                <AvatarImage src={item.image}/>
                                                :
                                                <div className="avatarImageBlock" style={{backgroundColor: "rgb(241, 241, 241)"}}>
                                                    <AvatarImage className="avatarImage"
                                                                 src={"https://res.cloudinary.com/maticht12345/image/upload/v1709459256/profile_whywvo.png"}/>
                                                </div>
                                            }
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex flex-col w-full">
                                    <div className="flex items-center gap-x-2 justify-between">
                                            <div className="flex items-center">
                                                <p className="font-semibold text-sm">
                                                    {item.username}
                                                </p>
                                            </div>
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {formatDate(new Date(item.createdAt))}
                                            </span>
                                        </div>
                                        <p >
                                            {item.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </OrderProvider>
    );
};

export default ArticleContainer;
