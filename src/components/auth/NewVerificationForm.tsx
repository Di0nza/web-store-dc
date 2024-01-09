"use client";
import '@/app/pagesStyle.css'
import {useCallback, useEffect, useState} from "react";
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
                <Card className="w-[400px] shadow-md">
                    <CardHeader>
                        Подтверждение почты
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center w-full justify-center">
                            {!success && !error && (
                                <BeatLoader/>
                            )}
                            <FormSuccess message={success}/>
                            {!success && (
                                <FormError message={error}/>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
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
