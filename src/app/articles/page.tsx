"use client";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "@/styles/text-editor.css";
import "./style.css"
import Image from "next/image";
import {IArticleCategory} from "@/types/ArticleCategory";
import views from "@/img/eye.svg";
import likes from "@/img/favorite.png";
import comments from "@/img/comment.svg"
import Link from "next/link";
import {ArticleSearch} from "@/components/article/ArticleSearch";

export default function Articles() {

    const [articles, setArticles] = useState<any[]>([]);
    const [hoveredArticleId, setHoveredArticleId] = useState<string | null>(null);
    const [allArticleCategories, setAllArticleCategories] = useState([]);
    const [selectedDateCategory, setSelectedDateCategory] = useState(null);
    const [selectedArticleCategory, setSelectedArticleCategory] = useState<IArticleCategory>({
        name: "Показать всех",
        numberOfArticles: 0
    })


    const getArticles = async () => {
        try {
            const res = await axios.get('/api/users/article');
            setArticles(res.data.article);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const getArticleCategory = async () => {
        try {
            axios.get("/api/users/articleCategory").then((response) => {
                setAllArticleCategories(response.data.articleCategories);
            }).catch((error) => {
                console.error('Error fetching article categories:', error);
            });

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getArticleCategory()
        getArticles();
    }, []);

    const formatDate = (date) => {
        const currentDate = new Date();
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);

        if (date.toDateString() === currentDate.toDateString()) {
            return 'Сегодня';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Вчера';
        } else {
            const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year < new Date().getFullYear() ? year : ""}`;
        }
    };

    const handleSelectAllArticleCategory = async () => {
        setSelectedArticleCategory({name: "Все", numberOfArticles: 0})
        const res = await axios.get(`/api/users/article`);
        setArticles(res.data.article);
    }

    const handleSelectArticleCategory = async (articleCategory) => {
        setSelectedArticleCategory(articleCategory)
        const res = await axios.get(`/api/users/article/sort/${articleCategory._id}`);
        setArticles(res.data.article);
    }
    const handleDateCategoryFilter = (sortingType) => {
        if (articles) {
            let sortedArticles = [...articles];

            switch (sortingType) {
                case 'dateAscending':
                    sortedArticles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                    break;
                case 'dateDescending':
                    sortedArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    break;
                case 'statusAscending':
                    sortedArticles.sort((a, b) => {
                        return a.views - b.views;
                    });
                    break;
                case 'statusDescending':
                    sortedArticles.sort((a, b) => {
                        return b.views- a.views;
                    });
                    break;
                default:
                    break;
            }

            setArticles(sortedArticles);
            setSelectedDateCategory(sortingType);
        }
    };


    return (
        <div className='store-container' style={{maxHeight: "none"}}>
            <div className='store-head-block'>
                <div>
                    <p className='store-container-title'>Статьи</p>
                    <p className='store-quantity'>Количество статей {articles?.length}</p>
                </div>
            </div>
            <div className='articleBlock'>
                <div className="container">
                    {articles.map((article) => (
                        <Link href={`/articles/${article._id}`} key={article._id} className="article-card">
                            <div className="article-image-container">
                                <img src={article.backgroundImage} alt={'Background Image'}/>
                            </div>
                            <div className="article-content"
                                 onMouseEnter={() => setHoveredArticleId(article._id)}
                                 onMouseLeave={() => setHoveredArticleId(null)}>
                                {hoveredArticleId === article._id ? (
                                    <div className="article-description">
                                        {article?.description?.length > 180 ? `${article.description.substring(0, 180)}...` : article.description}
                                    </div>
                                ) : (
                                    <div>
                                        <p className="article-title">
                                            {article?.title?.length > 65 ? `${article.title.substring(0, 65)}...` : article.title}
                                        </p>
                                        <div className={'categories-head-list-block'}>
                                            {article.categories.map((category, index) => (
                                                <div key={index} className={'category-head-item'}>
                                                    {category.name}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-row-reverse justify-between items-end">
                                            <p className="p-2 absolute bottom-0 articleDate">
                                                {formatDate(new Date(article.createdAt))}
                                            </p>
                                            <div className="flex absolute bottom-0 left-0 flex-row p-2 space-x-3">
                                                <div className="media">
                                                    <Image src={views} alt={''}></Image>
                                                    <p>{article.views}</p>
                                                </div>
                                                <div className="media">
                                                    <Image style={{height: "14px", width: "14px"}} src={likes}
                                                           alt={''}></Image>
                                                    <p>{article.likes}</p>
                                                </div>
                                                <div className="media">
                                                    <Image style={{marginTop: "1px", height: "14px", width: "14px"}}
                                                           src={comments} alt={''}></Image>
                                                    <p>{article.comments.length}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='articleFilterBlock'>
                    <ArticleSearch onSearch={setArticles}/>
                    <div className='filtersBlock'>
                        <h4>Сортировка заказов</h4>
                        <div className="article-categories-container">
                            <div
                                className={`articleBlockCategory ${selectedArticleCategory && selectedArticleCategory.name === 'Показать всех' ? 'selected' : ''}`}
                                onClick={() => handleSelectAllArticleCategory()}
                            >
                                Показать всех
                            </div>
                            {allArticleCategories.map((category, index) => (
                                <div key={index}
                                     className={`articleBlockCategory ${selectedArticleCategory && selectedArticleCategory._id === category._id ? 'selected' : ''}`}
                                     style={selectedArticleCategory && selectedArticleCategory._id === category._id ? {boxShadow: "none"} : {}}
                                     onClick={() => handleSelectArticleCategory(category)}>
                                    {category.name}
                                </div>
                            ))}
                        </div>
                        <div className='article-categories-container'>
                            <div onClick={() => handleDateCategoryFilter('dateAscending')}
                                 className={`articleBlockCategory ${selectedDateCategory === 'dateAscending' ? 'selected' : ''}`}>
                                Дата: сначала старые
                            </div>
                            <div onClick={() => handleDateCategoryFilter('dateDescending')}
                                 className={`articleBlockCategory ${selectedDateCategory === 'dateDescending' ? 'selected' : ''}`}>
                                Дата: сначала новые
                            </div>
                            <div onClick={() => handleDateCategoryFilter('statusAscending')}
                                 className={`articleBlockCategory ${selectedDateCategory === 'statusAscending' ? 'selected' : ''}`}>
                                Популярность: по возрастанию
                            </div>
                            <div onClick={() => handleDateCategoryFilter('statusDescending')}
                                 className={`articleBlockCategory ${selectedDateCategory === 'statusDescending' ? 'selected' : ''}`}>
                                Популярность: по убыванию
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
