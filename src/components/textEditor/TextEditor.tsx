"use client";

import Highlight from "@tiptap/extension-highlight";
import {Image} from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import {TextAlign} from "@tiptap/extension-text-align";
import {Typography} from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {EditorView} from "prosemirror-view";
import React, {useEffect, useState} from "react";
import * as Y from "yjs";
import {CustomTaskItem} from "./CustomTaskItem";
import {SelectionMenu} from "./SelectionMenu";
import {Toolbar} from "./Toolbar";
import styles from "./TextEditor.module.css";
import '@/styles/text-editor.css';
import arrow from "@/img/arrowB.png"
import axios from "axios";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useModal} from "@/hooks/useModalStore";
import {X} from "lucide-react";
import {CldUploadButton} from "next-cloudinary";
import {useParams, useRouter} from "next/navigation";
import {IArticle} from "@/types/Article";
import {toast} from "sonner";



export function TextEditor() {
    return (
        <Editor/>
    );
}

export function Editor() {
    const [doc, setDoc] = useState<Y.Doc>();
    const [provider, setProvider] = useState<any>();

    return <TiptapEditor doc={doc} provider={provider}/>;
}

type EditorProps = {
    doc: Y.Doc;
    provider: any;
};
const OutputHtmlButton = ({editor, article, articleId}) => {


    const outputHtml = async () => {
        try {
            const editorContentRef = editor && editor.contentComponent && editor.contentComponent.editorContentRef;
            const htmlContent = editorContentRef && editorContentRef.current ? editorContentRef.current.innerHTML : '';
            console.log(htmlContent);
            const articleData = {
                title: article.title,
                categories: article.categories,
                backgroundImage: article.backgroundImage,
                description: article.description,
                keywords: article.keywords,
                content: htmlContent,
                likes: article.likes,
                comments: article.comments,
                views: 1,
                coAuthors: article.coAuthors,
                createdAt: article.createdAt,
            };
            let response
            if(articleId){
                response = await axios.put(`/api/admin/article/${articleId}`, articleData).then((data)=>{
                    if(data.data.success){
                        toast.success("Статья успешно обновлена");
                    }else{
                        toast.error("Что-то пошло не так")
                    }
                });
            }else{
                response = await axios.post("/api/admin/article", articleData);
            }
            console.log(response.data.article._id);
            window.location.reload();
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <div className={styles.articleContainer}>
            <button onClick={outputHtml}>
                {!articleId ? "Загрузить статью" : "Обновить статью"}
            </button>
        </div>
    );
};

function TiptapEditor({doc, provider}: EditorProps) {

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: styles.editor,
            },
        },
        extensions: [
            StarterKit.configure({
                blockquote: {
                    HTMLAttributes: {
                        class: "tiptap-blockquote",
                    },
                },
                code: {
                    HTMLAttributes: {
                        class: "tiptap-code",
                    },
                },
                codeBlock: {
                    languageClassPrefix: "language-",
                    HTMLAttributes: {
                        class: "tiptap-code-block",
                        spellcheck: false,
                    },
                },
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: "tiptap-heading",
                    },
                },
                history: false,
                horizontalRule: {
                    HTMLAttributes: {
                        class: "tiptap-hr",
                    },
                },
                listItem: {
                    HTMLAttributes: {
                        class: "tiptap-list-item",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "tiptap-ordered-list",
                    },
                },
                paragraph: {
                    HTMLAttributes: {
                        class: "tiptap-paragraph",
                    },
                },
            }),
            Highlight.configure({
                HTMLAttributes: {
                    class: "tiptap-highlight",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "tiptap-image",
                },
            }),
            Link.configure({
                HTMLAttributes: {
                    class: "tiptap-link",
                },
            }),
            Placeholder.configure({
                placeholder: "Содержание статьи",
                emptyEditorClass: "tiptap-empty",
            }),
            CustomTaskItem,
            TaskList.configure({
                HTMLAttributes: {
                    class: "tiptap-task-list",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Typography,
            Youtube.configure({
                modestBranding: true,
                HTMLAttributes: {
                    class: "tiptap-youtube",
                },
            }),
        ],
    });


    const params = useParams();
    const { articleId } = params;

    const [article, setArticle] = useState({
        title: '',
        categories: [],
        backgroundImage: '',
        description: '',
        keywords: [],
        content: '',
        likes: [],
        comments: [],
        views: 1,
        coAuthors: [],
        createdAt: Date.now(),
    });

    const handleTitleChange = (event) => {
        setArticle({...article, title: event.target.value});
    };

    const handleDescriptionChange = (event) => {
        setArticle({...article, description: event.target.value});
    };

    const {onOpen, data} = useModal();

    const [allArticleCategories, setAllArticleCategories] = useState( []);
    const [currentArticleCategories, setCurrentArticleCategories] = useState([]);
    const [keyWords, setKeyWords] = useState([]);
    const [newWord, setNewWord] = useState("");

    const addNewWord = () => {
        if (newWord.trim() !== "") {
            setArticle({...article, keywords: [...article.keywords, newWord]});
            //setKeyWords(prevKeyWords => [...prevKeyWords, newWord]);
            setNewWord("");
        }
    };


    useEffect(() => {
        const getArticle = async (id) => {
            try {
                const response = await axios.get(`/api/admin/article/${id}`);
                return response.data.article;
            } catch (error) {
                console.error('Error fetching article:', error);
                return null;
            }
        };

        if (articleId) {
            getArticle(articleId).then(data => {
                if (data) {
                    setArticle(data);
                    if(editor && data.content) {
                        editor.commands.setContent(data.content)
                    }
                    setCurrentArticleCategories(data.categories)
                }
            });
        }
    }, [articleId, editor]);

    useEffect(() => {
        axios.get("/api/admin/articleCategory").then((response) => {
            const allCategories = response.data.articleCategories;
            const filteredCategories = allCategories.filter(category => {
                return !currentArticleCategories.some(currentCategory => currentCategory._id === category._id);
            });
            setAllArticleCategories(filteredCategories);
        }).catch((error) => {
            console.error('Error fetching article categories:', error);
        });
    }, [data, currentArticleCategories])

    const handleCategorySelect = (category) => {
        setArticle({...article, categories: [...article.categories, category]})
        //setCurrentArticleCategories(prevCategories => [...prevCategories, category]);
        setAllArticleCategories(prevCategories => prevCategories.filter(cat => cat._id !== category._id))
    };

    const removeArticleCategory = (category) => {
        setAllArticleCategories(prevCategories => [...prevCategories, category]);
        //setCurrentArticleCategories(prevCategories => prevCategories.filter(cat => cat._id !== category._id));
        setArticle({...article, categories: article.categories.filter(cat => cat._id !== category._id)})

    };

    const removeKeyWord = (index) => {
        const newKeyWords = article.keywords.filter((_, i) => i !== index)
        setArticle({...article, keywords: newKeyWords});
        //setKeyWords(newKeyWords);
    }

    return (
        <div className={styles.container}>
            <h2>{"Добавление статей"}</h2>
            <p className={styles.changeBlockText}>Добавление и изменение</p>
            <div className={styles.updatePromoProfileBlock}>
                <label className={styles.updateProfileBlockLabel}>Фон</label>
                <div className={styles.updateArticleLabelBlock} style={{ backgroundImage: `url(${article.backgroundImage})` }}>
                    <CldUploadButton
                        uploadPreset="qiladgcy"
                        onUpload={(result: any) => {
                            setArticle({...article, backgroundImage: result.info.secure_url})
                        }}>
                        Изменить изображение
                    </CldUploadButton>
                </div>
                <label className={styles.updateProfileBlockLabel}>Название</label>
                <input placeholder={'Название'} type="text" value={article.title} onChange={handleTitleChange}/>
                <label className={styles.updateProfileBlockLabel}>Категории</label>
                {article.categories.length !== 0 ? (
                    <div className={styles.selectedCategories}>
                        {article.categories.map(category => (
                            <div key={category._id} className={styles.categoryItem}>
                                {category.name}
                                <X className={"ml-2 h-4 w-4"} onClick={() => removeArticleCategory(category)}/>
                            </div>
                        ))}
                    </div>
                ) : (
                    // <div className={"mt-2 mb-5"} >У статьи нет категории</div>
                    null
                )}
                <div className="flex flex-row justify-between mt-2 mb-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className={styles.categoryItemListBtn}>
                                <p>Добавить категорию к статье</p>
                                <div className={styles.categoryItemListArrow}></div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={styles.categoryItemList}>
                            <DropdownMenuLabel>Категории</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {allArticleCategories.map(category => (
                                <DropdownMenuItem key={category.id} onSelect={() => handleCategorySelect(category)}>
                                    {category.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button  className={styles.categoryItemAddBtn}
                            onClick={() => onOpen("createArticleCategory", {})}>
                        Создать категорию
                    </Button>
                </div>
                <label className={styles.updateProfileBlockLabel}>Ключевые слова</label>
                <div className={styles.articlesKeyWordsBlock}>
                    <input
                        placeholder={'Ключевые слова'}
                        type="text"
                        className={styles.articlesKeyWordsInout}
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)} // Обновление состояния нового слова
                    />
                    <Button className={styles.articlesKeyWordsAdd}
                            onClick={() => addNewWord()}>
                        Добавить
                    </Button>
                </div>
                <div className={styles.selectedKeyWords}>
                    {article.keywords.map((word, index) => (
                        <div key={index} className={styles.keyWordItem}>
                            {word}
                            <X className={"ml-1 h-4 w-4"} onClick={() => removeKeyWord(index)}/>
                        </div>
                    ))}
                </div>
                <label className={styles.updateProfileBlockLabel}>Описание</label>
                <input placeholder={'Описание'} type="text" value={article.description}
                       onChange={handleDescriptionChange}/>
            </div>
            <label className={styles.updateProfileBlockLabel}>Контент статьи</label>
            <div className={styles.editorHeader}>
                {editor && <Toolbar editor={editor}/>}
                {editor && <SelectionMenu editor={editor}/>}
            </div>
            <div className={styles.editorPanel}>
                <EditorContent editor={editor} className={styles.editorContainer}/>
            </div>
            <div className={styles.updatePromoProfileBlock}>
                <label className={styles.updateProfileBlockLabel}>Соавторы</label>
                <input placeholder={'Соавторы'} type="text"/>
            </div>

            {editor && <OutputHtmlButton editor={editor} article={article} articleId={articleId}/>}
        </div>
    );
}

// Prevents a matchesNode error on hot reloading
EditorView.prototype.updateState = function updateState(state) {
    // @ts-ignore
    if (!this.docView) return;
    // @ts-ignore
    this.updateStateInner(state, this.state.plugins != state.plugins);
};
