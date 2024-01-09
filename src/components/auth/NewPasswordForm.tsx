"use client";
import '@/app/pagesStyle.css'
import React, {useCallback, useEffect, useState, useTransition} from "react";
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
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {NewPasswordSchema} from "@/types/authSchemas";
import {zodResolver} from "@hookform/resolvers/zod";

export const NewPasswordForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();


    const searchParams = useSearchParams();

    let token = searchParams.get("token");


    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {

        setError("");
        setSuccess("");


        startTransition(async () => {
            if(token===null){
                token = "";
            }
            const response = await axios.post("/api/users/newPassword", {password:values.password, token: token})//{password: values.password, token:token})
                .then((data) => {
                    console.log(data)
                    if (data.data.error) {
                        form.reset();
                        setError(data.data.error);
                    } else if (data.data.success) {
                        form.reset();
                        setSuccess(data.data.success);
                    }

                })
                .catch(() => setError("Что-то пошло не так :("));
        });
    };

    return (
        <div className="max-h-screen h-[150%] w-full max-w-[600px] flex flex-col mx-auto pt-16 pb-24">
            <div className="flex justify-center">
                <Card className="w-[400px] shadow-md">
                    <CardHeader>
                        Введите новый пароль
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Пароль</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder="******"
                                                            type="password"
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                    </>
                                </div>

                                <FormError message={error}/>
                                <FormSuccess message={success}/>

                                <Button
                                    disabled={isPending}
                                    type="submit"
                                    className="w-full"
                                >
                                    Сохранить
                                </Button>
                            </form>
                        </Form>
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

