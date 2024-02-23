"use client";

import axios from "axios";
import {useState} from "react";
import {useRouter} from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {useModal} from "@/hooks/useModalStore";
import {Button} from "@/components/ui/button";
import '../componentsStyles.css'
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {FormError} from "@/components/auth/FormError";

export const CreateArticleCategoryModal = () => {
    const {isOpen, onClose, type} = useModal();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    const isModalOpen = isOpen && type === "createArticleCategory";

    const formSchema = z.object({
        name: z.string().min(1, {
            message: 'Необходимо ввести название категории.',
        }),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/admin/articleCategory", values)
                .then((data) => {
                    if (data.data.error) {
                        console.log(data.data.error)
                        setErrorMessage(data.data.error);
                    } else {
                        form.reset();
                        onClose();
                    }
                })

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="m-0 gap-0 bg-white text-black p-0 overflow-hidden deleteModalBlock"
                           style={{fontFamily: "Raleway", backgroundColor: '#fafafa', maxWidth: '450px'}}>
                <DialogHeader className="m-0 pt-8 px-6">
                    <DialogTitle className="text-xl text-left font-bold">
                        Введите название новой категории для статей
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <div className="p-5 space-y-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="mt-0 text-xs font-bold">
                                            Название категории
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="text-black bg-white"
                                                placeholder="Введите название категории"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}>
                            </FormField>
                            {errorMessage !== "" && <FormError message={errorMessage}/>}
                        </div>
                        <DialogFooter className="px-6 py-4">
                            <Button style={{backgroundColor: '#111111', color: '#fafafa'}} variant="secondary"
                                    disabled={isLoading}>
                                Создать
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
