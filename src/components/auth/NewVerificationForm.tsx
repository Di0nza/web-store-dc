"use client";
import '@/app/pagesStyle.css'
import React, {useCallback, useEffect, useState} from "react";
import {BeatLoader} from "react-spinners";
import {useSearchParams} from "next/navigation";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import {FormError} from "@/components//auth/FormError";
import {FormSuccess} from "@/components/auth/FormSuccess";
import axios from "axios";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import pageLoading from "@/img/loading/wwwwwda3c55c7-d2de-4ee6-83b6-8513e0a3c93a.gif";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(async () => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        await axios.post("/api/users/newVerification", {token: token})
            .then((data) => {
                setSuccess(data.data.success);
                setError(data.data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            })
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="max-h-screen h-[150%] w-full max-w-[600px] flex flex-col mx-auto pt-16 pb-24">
            <div className="flex justify-center">
                <Card className="w-[400px]">
                    <CardHeader style={{padding:'15px 15px 0 15px', fontWeight:'600', fontSize:'22px'}}>
                        Подтверждение почты
                    </CardHeader>
                    <CardContent style={{padding:'0'}}>
                        <div className="flex items-center flex-col justify-center" style={{width:'100%', padding:'0 15px'}}>
                            {!success && !error && (
                                // <BeatLoader/>
                                <div className='new-loading-block'>
                                    <Image className='new-loading-animation' src={pageLoading} alt='Loading...'/>
                                </div>

                            )}
                            <div style={{margin: '20px 15px 0', width:'100%'}}>
                                <FormSuccess message={success}/>
                                {!success && (
                                    <FormError message={error}/>
                                )}
                            </div>

                        </div>
                    </CardContent>

                    <CardFooter style={{padding:'0 15px 10px'}}>
                        <Button
                            variant="link"
                            className="font-normal w-full"
                            size="sm"
                        >
                            <Link href={"/login"}>
                                Назад к авторизации
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
