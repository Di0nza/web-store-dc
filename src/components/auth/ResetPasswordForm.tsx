"use client"
import '@/app/pagesStyle.css'
import React, {useEffect, useState, useTransition} from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/auth/FormError";
import {FormSuccess} from "@/components/auth/FormSuccess";
import {useRouter, useSearchParams} from "next/navigation";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {ResetPasswordSchema} from "@/types/authSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {signIn} from "next-auth/react";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";

export const ResetPasswordForm = () => {

    const router = useRouter();


    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();


    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {

        setError("");
        setSuccess("");


        startTransition(async () => {
            const response = await axios.post("/api/users/resetPassword", values)
                .then((data) => {
                    console.log(data)
                    if (data.data.error) {
                        form.reset();
                        setError(data.data.error);
                    } else if (data.data.success) {
                        form.reset();
                        setSuccess(data.data.success);
                    }
                    // } else {
                    //     router.push("/profile")
                    // }

                })
                .catch(() => setError("Что-то пошло не так :("));
        });
    };

    useEffect(() => {
        console.log(`error : ${error}`)
        console.log(`success : ${success}`)

    }, [error, success])

    return (
        <div className='signUpBlock'>
            <h2>{"Восстановление пароля"}</h2>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="john.doe@example.com"
                                                type="email"
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
                        Отправить письмо
                    </Button>
                </form>
            </Form>

        </div>
    );
};
