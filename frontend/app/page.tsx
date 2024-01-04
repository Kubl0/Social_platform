'use client'


import PostForm from "@/app/components/PostForm";
import {useState} from "react";


export default function Home() {
    const [, setIsAddPostPopupOpen] = useState(false);

    const handleCloseAddPostPopup = () => {
        setIsAddPostPopupOpen(false);
    };


    //generalnie ten popup jak bedziesz robil i mial koncepcje jak w tym profilu to mozesz zajumac kod stamtąd, jedynie wallId zmienic na glowne tak jak jest teraz, a tak to lux
    //narazie tak dla testu to wrzucilem, sam formularz dziala ale wiadomo, nie jest tam gdzie powinien byc

    return (
        <div>
            <br/>
            Home Page
            <PostForm onClose={handleCloseAddPostPopup} wallId={"/"} />
        </div>
    )
}