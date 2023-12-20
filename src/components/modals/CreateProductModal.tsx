"use client"

import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button"
import axios from "axios";
import {useRouter} from "next/navigation";
import {useModal} from "@/hooks/useModalStore"

const validSizes = ['xs', 's', 'm', 'l', 'xl'];

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'Необходимо ввести название товара.',
    }),
    description: z.string().min(1, {
        message: 'Необходимо ввести описание товара.',
    }),
    price: z
        .number().min(1, {
            message: 'Необходимо ввести цену.',
        })
        .refine((value) => value > 0, {
            message: 'Цена должна быть положительным числом.',
        }),
    sizes: z.array(
        z.object({
            size: z
                .string()
                .refine((value) => validSizes.includes(value), {
                    message: 'Недоступный размер. Доступные: xs, s, m, l, xl.',
                }),
            amount: z
                .number()
                .refine((value) => value >= 0, {
                    message: 'Количество товаров должно быть целым положительным числом.',
                })
                .refine((value) => /^\d+$/.test(value.toString()), {
                    message: 'Количество товаров должно быть целым положительным числом.',
                })
        })
    ),
    pictures: z.array(
        z.object({
            picture: z.string()
        })
    ),
    additionalInformation: z.array(
        z.object({
            title: z.string(),
            description: z.string()
        })
    ),
});
export const CreateProductModal = () => {

    const {isOpen, onClose, type} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "createProduct";

    const handleClose =()=>{
        form.reset();
        onClose();
    }


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price:"",
            sizes:[],
            pictures:[],
            additionalInformation:[]
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            onClose();
        }catch (error){
            console.log(error)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Создайте товар
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Дайте товару название, описание, добавьте фотографии и количество товара для каждого размера.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6 px-6">
                            {/*<div className="flex items-center justify-center text-center">*/}
                            {/*    <FormField control={form.control}*/}
                            {/*               name="imageUrl"*/}
                            {/*               render={({field}) => (*/}
                            {/*                   <FormItem>*/}
                            {/*                       <FormControl>*/}
                            {/*                           <FileUpload*/}
                            {/*                               endpoint="serverImage"*/}
                            {/*                               value={field.value}*/}
                            {/*                               onChange={field.onChange}*/}
                            {/*                           />*/}
                            {/*                       </FormControl>*/}
                            {/*                   </FormItem>*/}
                            {/*               )}*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Название товара
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Введите название товара"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}>
                            </FormField>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Описание
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Введите описание товара"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Цена
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Введите цену"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-200 px-6 py-4">
                            <Button variant="ghost" disabled={isLoading}>
                                Создать
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}