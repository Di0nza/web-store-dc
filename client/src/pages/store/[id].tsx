import React from 'react';
import {useRouter} from 'next/router';

const Id: React.FC = () => {
    const router = useRouter();
    const {id} = router.query
    return (
        <div>
            <p>{id} product page</p>
        </div>
    );
};

export default Id;