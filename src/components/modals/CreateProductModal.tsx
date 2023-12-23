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
import {useState} from "react";
import Image from "next/image"
import {X} from "lucide-react"
// import {Textarea} from "@/components/ui/textarea";
import {log} from "util";

const validSizes = ['XS', 'S', 'M', 'L', 'XL'];

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'Необходимо ввести название товара.',
    }),
    description: z.string().min(1, {
        message: 'Необходимо ввести описание товара.',
    }),
    price: z
        .string().min(1, {
            message: 'Необходимо ввести цену.',
        })
        .refine((value) => parseFloat(value) > 0, {
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

    const [selectedPictures, setSelectedPictures] = useState([]);

    const handlePictureChange = (event) => {
        const files = event.target.files;
        const newPictures = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );
        setSelectedPictures((prevPictures) => [...prevPictures, ...newPictures]);
    };

    const handleSelectPicture = (index) => {


        // if (index === 0) {
        //
        // } else {
        //
        //     const updatedPictures = [...selectedPictures];
        //     const selectedPicture = updatedPictures[index];
        //     updatedPictures.splice(index, 1);
        //     updatedPictures.unshift(selectedPicture);
        //     setSelectedPictures(updatedPictures);
        // }
    };

    const handleDeletePicture = (index) => {
        const updatedPictures = [...selectedPictures];
        updatedPictures.splice(index, 1);
        setSelectedPictures(updatedPictures);
    }

    const handleClose = () => {
        setSelectedPictures([]);
        form.reset();
        onClose();
    }


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            sizes: [],
            pictures: [],
            additionalInformation: []
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log(values)
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
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
                        <div className="flex flex-row space-y-6 px-6">
                            <div className="flex-1 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="pictures"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col items-center justify-center mt-10">
                                            {/*<FormLabel*/}
                                            {/*    className="uppercase  text-xs font-bold text-zinc-500 dark:text-secondary/70">*/}
                                            {/*    Фотографии*/}
                                            {/*</FormLabel>*/}
                                            <FormControl>
                                                <div className="flex space-x-2 items-center justify-center">
                                                    {selectedPictures.map((picture, index) => (
                                                        <div key={index}>
                                                            <div
                                                                className={`relative ${index === 0 ? 'h-52 w-52' : 'h-20 w-20'}`}>
                                                                <img
                                                                    src={picture}
                                                                    alt={`Uploaded Picture ${index + 1}`}
                                                                    className="w-full h-full object-cover rounded"
                                                                    onClick={() => handleSelectPicture(index)}
                                                                />
                                                                <button
                                                                    onClick={() => handleDeletePicture(index)}
                                                                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                                                                    type="button"
                                                                >
                                                                    <X className="h-4 w-4"/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <label
                                                        htmlFor="fileInput"
                                                        className={`cursor-pointer flex items-center justify-center ${selectedPictures.length === 0 ? 'h-52 w-52' : 'h-20 w-20'} bg-gray-200 rounded`}
                                                    >
                                                        <Input
                                                            id="fileInput"
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handlePictureChange}
                                                            className="hidden"
                                                        />
                                                        <span className="text-gray-600 text-lg">+</span>
                                                    </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                ></FormField>
                            </div>
                            <div className="flex-1 space-y-5">
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
                                                    type={"number"}
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
                                                {/*<Textarea*/}
                                                {/*    disabled={isLoading}*/}
                                                {/*    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"*/}
                                                {/*    placeholder="Введите описание товара"*/}
                                                {/*    {...field}*/}
                                                {/*/>*/}
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />


                                <div className="flex flex-row ">
                                    {/* Добавьте этот блок для инпутов размеров */}

                                    {validSizes.map((size, index) => (
                                        <FormField
                                            key={size}
                                            control={form.control}
                                            name={`sizes.${size}.amount`}
                                            render={({field}) => (
                                                <FormItem className="flex items-center mt-3">
                                                    <div className="flex flex-row items-center justify-center">
                                                        <div
                                                            className={`uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 ${index === 0 ? "ml-0" : "ml-5"}`}>{size}</div>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                disabled={isLoading}
                                                                className=" bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 w-16 ml-1"
                                                                style={{
                                                                    WebkitAppearance: 'none',
                                                                }}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-200 px-6 py-4">
                            <Button variant="secondary" disabled={isLoading}>
                                Создать
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
