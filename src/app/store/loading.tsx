import '../profile/profileStyles.css'
import {Metadata} from "next";
export const metadata: Metadata = {
    title: 'Store | MariDeniz',
}
export default function LoadingProducts(){
    return (
            <div className='loading-container'>
                <h4>Loading...</h4>
            </div>
        )
}
