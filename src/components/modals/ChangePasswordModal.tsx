"use client"
import React, {useState, useTransition} from 'react';
import * as z from "zod"
import {useModal} from "@/hooks/useModalStore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChangePasswordSchema} from "@/types/authSchemas";
import {FormError} from "@/components/auth/FormError";
import {FormSuccess} from "@/components/auth/FormSuccess";
import axios from "axios";

export const ChangePasswordModal = () => {

    const {isOpen, onClose, type, data, onOpen} = useModal();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const isModalOpen = isOpen && type === "changePassword";

    const form = useForm({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
        }
    });

    const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
        startTransition(async () => {
            await axios.post("/api/users/changePassword", values)
                .then((data) => {
                    if (data.data.error) {
                        setError(data.data.error);
                    }

                    if (data.data.success) {
                        setSuccess(data.data.success);
                    }
                })
                .catch(() => setError("Что-то пошло не так!"));
        });
    }

    const handleClose = () => {
        form.reset();
        setError("");
        setSuccess("");
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden"
                           style={{fontFamily: "Century Gothic", backgroundColor: '#fafafa', maxWidth: '700px'}}>
                <DialogHeader className="pt-6 px4 ml-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Смена пароля
                    </DialogTitle>
                    <DialogDescription className="text-left text-zinc-500">
                        Для смены пароля необходимо ввести старый пароль, а затем новый, содержащий не менее 6 символов.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4 pr-12 pl-12">

                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Пароль</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Новый пароль</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormSuccess message={success}/>
                            {!success && (
                                <FormError message={error}/>
                            )}
                        </div>
                        <DialogFooter className="flex items-center justify-end p-4 border-t border-gray-300">
                            <div className="flex items-center justify-between w-full">
                                <Button
                                    className="p-3"
                                    type="reset"
                                    disabled={isPending}
                                    onClick={handleClose}
                                    variant="ghost"
                                >
                                    Отмена
                                </Button>
                                <Button
                                    disabled={isPending}
                                    type="submit"
                                >
                                    Сохранить
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
