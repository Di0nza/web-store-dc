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
import {LoginSchema} from "@/types/authSchemas";
import {FormError} from "@/components/auth/FormError";
import {FormSuccess} from "@/components/auth/FormSuccess";
import {signIn} from "next-auth/react"
import {ensureLeadingSlash} from "next/dist/shared/lib/page-path/ensure-leading-slash";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {useSearchParams} from "next/navigation";
import {OrderProvider, useOrderContext} from "@/orderContext/store";


export const LoginForm = () => {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Этот адрес электронной почты уже занят, если он ваш, попробуйте другой способ авторизации" : "";


    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {

        setError("");
        setSuccess("");


        startTransition(async () => {
            const response = await axios.post("/api/users/login", values)
                .then((data) => {
                    console.log(data)
                    if (data.data.error) {
                        //form.reset();
                        setError(data.data.error);
                    } else if (data.data.success) {
                        form.reset();
                        setSuccess(data.data.success);
                    } else {
                        router.push("/profile")

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
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        })
    }

    useEffect(() => {
        console.log(`error : ${error}`)
        console.log(`success : ${success}`)

    }, [error, success])


    return (
        <OrderProvider>
            <div className='signUpBlock'>
                <h2>{"Авторизация"}</h2>
                <p className='signUpBlockText'>
                    Ещё нет аккаунта? <Link className='loginLink' href="/signup">Зарегистрируйтесь</Link>
                </p>
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
                                            <Button
                                                size="sm"
                                                variant="link"
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href="/resetPassword">
                                                    Забыли пароль?
                                                </Link>
                                            </Button>

                                        </FormItem>
                                    )}
                                />
                            </>
                            {/*)}*/}
                        </div>

                        <FormError message={error || urlError}/>
                        <FormSuccess message={success}/>

                        <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full"
                        >
                            {true ? "Авторизоваться" : "Login"}
                        </Button>
                    </form>
                </Form>
                <div className='googleLogin' onClick={() => googleAuth()}>
                    <p>Авторизироваться с помощью <Image className='Google-logo' src={googleLogo}
                                                         alt={'Google'}></Image>
                    </p>
                </div>
            </div>
        </OrderProvider>
    )
}

