export interface IArticle {
    title: string,
    category: string,
    backgroundImage: string,
    description: string,
    keywords: string,
    content: string,
    likes: any,
    comments: any,
    views: number,
    coAuthors: any,
    createdAt: Date;
}