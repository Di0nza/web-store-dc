import {useRouter} from "next/navigation";
import React, {useEffect, useState, useTransition} from "react";
import axios from "axios";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import googleLogo from "@/img/pngwinggoogleLogo.png";
import '@/app/pagesStyle.css'
import {signIn} from "next-auth/react"
import {DEFAULT_USER_LOGIN_REDIRECT} from "@/routes";
import {SignUpSchema} from "@/types/authSchemas";
import {FormError} from "@/components/auth/FormError";
import {FormSuccess} from "@/components/auth/FormSuccess";


export const SignUpForm = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",

    })

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();



    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {

        setError("");
        setSuccess("");

        startTransition(async () => {
            const response = await axios.post("/api/users/signup", values)
                .then((data) => {
                    console.log(data)
                    if (data.data.error) {
                        form.reset();
                        setError(data.data.error);
                    }

                    if (data.data.success) {
                        form.reset();
                        setSuccess(data.data.success);
                    }

                    // if (data?.twoFactor) {
                    //     setShowTwoFactor(true);
                    // }
                })
                .catch(() => setError("Что-то пошло не так :("));
        });
    };

    const googleAuth = () => {
        signIn("google", {
            callbackUrl: DEFAULT_USER_LOGIN_REDIRECT
        })
    }

    useEffect(()=>{
        console.log(`error : ${error}`)
        console.log(`success : ${success}`)

    }, [error,success])


    return (
        <div className='signUpBlock'>
            <h2>{"Регистрация"}</h2>
            <p className='signUpBlockText'>Уже есть аккаунт? <Link className='loginLink' href="/login">Войти</Link></p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {/*{showTwoFactor && (*/}
                        {/*    <FormField*/}
                        {/*        control={form.control}*/}
                        {/*        name="code"*/}
                        {/*        render={({ field }) => (*/}
                        {/*            <FormItem>*/}
                        {/*                <FormLabel>Two Factor Code</FormLabel>*/}
                        {/*                <FormControl>*/}
                        {/*                    <Input*/}
                        {/*                        {...field}*/}
                        {/*                        //disabled={isPending}*/}
                        {/*                        placeholder="123456"*/}
                        {/*                    />*/}
                        {/*                </FormControl>*/}
                        {/*                <FormMessage />*/}
                        {/*            </FormItem>*/}
                        {/*        )}*/}
                        {/*    />*/}
                        {/*)}*/}
                        {/*{true && (*/}
                        <>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel style={{fontWeight: '600'}}>Имя</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="John Doe"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel style={{fontWeight: '600'}}>Email</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel style={{fontWeight: '600'}}>Пароль</FormLabel>
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
                        {/*)}*/}
                    </div>
                    <div style={{margin: '20px 0 0 0'}}>
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                    </div>
                    <Button
                        style={{margin: '10px 0 0 0'}}
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        {true ? "Зарегистрироваться" : "Login"}
                    </Button>
                </form>
            </Form>
            <div className='googleLogin' onClick={() => googleAuth()}>
                <p>Зарегистрироваться с помощью <Image className='Google-logo' src={googleLogo} alt={'Google'}></Image></p>
            </div>
        </div>
    )

}

