'use client';
import '../../app/profile/profileStyles.css'
import Link from "next/link";
import {FormEventHandler, useState} from "react";
import {getDataBySearch} from "../../services/getData";
import searchIco from '../../img/searchIco.png'
import Image from "next/image";

type Props = {
    onSearch: (value: any[]) => void;
}

const ProductsSearch = ({onSearch}: Props) => {
    const [search, setSearch] = useState('');
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        const products = await getDataBySearch(search);
        onSearch(products);
    }

    return (
        <form className='products-search-block' onSubmit={handleSubmit}>
            <input type='search' placeholder='Поиск' value={search} onChange={event => setSearch(event.target.value)}/>
            <button type='submit'><Image src={searchIco} alt={"Искать"}/></button>
        </form>
    )
}
export {ProductsSearch};
