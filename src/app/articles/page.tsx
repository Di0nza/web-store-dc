"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import "@/styles/text-editor.css";

// Определяем компонент Articles
export default function Articles() {
    const [articles, setArticles] = useState<any[]>([]);

    const getArticles = async () => {
        try {
            const res = await axios.get('/api/users/article');
            setArticles(res.data.article);
            console.log(res.data.article);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getArticles();
    }, []);

    return (
        <div className='store-container'>
            <div className='store-head-block'>
                <div>
                    <p className='store-container-title'>Статьи</p>
                    <p className='store-quantity'>Количество статей {articles?.length}</p>
                </div>
            </div>

            {/* Маппим массив статей и отображаем их содержимое */}
            {articles.map((article) => (
                <div key={article.id}>
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    {ReactHtmlParser(article.content)}
                </div>
            ))}
        </div>
    );
}
