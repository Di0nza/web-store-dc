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
import {useEffect, useState} from "react";
import {X} from "lucide-react"
import {Textarea} from "@/components/ui/textarea";
import {IProduct} from "@/types/Product";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const additionalInformation = [1, 1, 1, 1];

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'Необходимо ввести название товара.',
    }),
    description: z.string().min(1, {
        message: 'Необходимо ввести описание товара.',
    }),
    category: z.string().min(1, {
        message: 'Необходимо ввести категорию товара.',
    }),
    collection: z.string(),
    sex: z.enum(["Унисекс", "М", "Ж"], {
        required_error: "Необходимо выбрать один из представленных типов.",
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
                    message: 'Недоступный размер. Доступные: xs, s, m, l, xl, xxl.',
                }),
            amount: z
                .string()
                .refine((value) => /^\d+$/.test(value), {
                    message: 'Количество товаров должно быть целым положительным числом.',
                }),
        })
    ),
    additionalInformation: z.array(
        z.object({
            title: z.string(),
            description: z.string()
        })
    ),
});

export const EditProductModal = () => {

    const {isOpen, onClose, type, data} = useModal();
    const {product} = data;
    const [selectedPictures, setSelectedPictures] = useState([]);
    const [selectedPicturesFiles, setSelectedPicturesFiles] = useState<any[]>([]);
    const router = useRouter();

    const isModalOpen = isOpen && type === "editProduct";

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handlePictureChange = async (event) => {
        const files = event.target.files;
        const newPictures = Array.from(files).map((file: File) =>
            URL.createObjectURL(file)
        );
        const convertedFile = await convertBase64(files?.[0]) as File;
        setSelectedPicturesFiles([...selectedPicturesFiles, convertedFile]);
        setSelectedPictures((prevPictures) => [...prevPictures, ...newPictures]);
        //console.log(selectedPictures)
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
        const updatedPicturesFiles = [...selectedPicturesFiles];
        updatedPictures.splice(index, 1);
        updatedPicturesFiles.splice(index, 1);
        setSelectedPictures(updatedPictures);
        setSelectedPicturesFiles(updatedPicturesFiles);
    }

    const handleClose = () => {
        setSelectedPictures([]);
        form.reset();
        setSelectedPictures([]);
        setSelectedPicturesFiles([]);
        onClose();
    }


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            category: "",
            collection: "",
            sex: "",
            sizes: [
                {size: "XS", amount: null},
                {size: "S", amount: null},
                {size: "M", amount: null},
                {size: "L", amount: null},
                {size: "XL", amount: null},
                {size: "XXL", amount: null},
            ],
            additionalInformation: [
                {title: "", description: ""},
                {title: "", description: ""},
                {title: "", description: ""},
                {title: "", description: ""},
            ]
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //console.log(values);
        //console.log(selectedPicturesFiles);
        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "sizes") {
                    values[key].forEach((size) => {
                        formData.append(size.size, size.amount);
                    });
                } else if (key === "additionalInformation") {
                    values[key].forEach((ai, index) => {
                        if (ai.title.trim() !== "" && ai.description.trim() !== "") {
                            formData.append(`additionalInformation[${index}].title`, ai.title);
                            formData.append(`additionalInformation[${index}].description`, ai.description);
                        }
                    })
                } else {
                    formData.append(key, values[key]);
                }
            });

            selectedPicturesFiles.forEach((file, index) => {
                if (file.length > 1000) {
                    formData.append(`picturesFiles[${index}]`, file);
                } else {
                    formData.append(`picturesString[${index}]`, file);
                }
            });

            await axios.patch(`/api/admin/products/${product._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });


            form.reset();
            setSelectedPictures([]);
            setSelectedPicturesFiles([]);
            onClose();
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (product) {
            form.setValue("title", product.title);
            form.setValue("description", product.description);
            form.setValue("price", product.price);
            form.setValue("category", product.category);
            form.setValue("collection", product?.collection);
            form.setValue("sex", product?.sex);
            form.setValue("sizes.0.amount", product.sizes[0].amount);
            form.setValue("sizes.1.amount", product.sizes[1].amount);
            form.setValue("sizes.2.amount", product.sizes[2].amount);
            form.setValue("sizes.3.amount", product.sizes[3].amount);
            form.setValue("sizes.4.amount", product.sizes[4].amount);
            form.setValue("sizes.5.amount", product.sizes[5].amount);
            for (let i = 0; i < product.additionalInformation.length; i++) {
                form.setValue(`additionalInformation.${i}.title`, product.additionalInformation[i].title);
                form.setValue(`additionalInformation.${i}.description`, product.additionalInformation[i].description);
            }
            setSelectedPictures(product.pictures);
            setSelectedPicturesFiles(product.pictures);
        }
    }, [product, form])

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden"
                           style={{fontFamily: "Century Gothic", backgroundColor: '#fafafa', maxWidth: '800px'}}>
                <DialogHeader className="pt-8 px6 ml-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Отредактируйте товар
                    </DialogTitle>
                    <DialogDescription className="text-left text-zinc-500">
                        Отредактируйте название, описание, фотографии и количество товаров для каждого размера.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-row space-y-6 px-6" style={{maxHeight: '63vh', overflowY: 'auto'}}>
                            <div className="flex-1 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="pictures"
                                    render={({field}) => (
                                        <FormItem className="addImagesConteiner">
                                            {/*<FormLabel*/}
                                            {/*    className="uppercase  text-xs font-bold text-zinc-500 dark:text-secondary/70">*/}
                                            {/*    Фотографии*/}
                                            {/*</FormLabel>*/}
                                            <FormControl>
                                                <div className="addImagesBlock">
                                                    {selectedPictures.map((picture, index) => (
                                                        <div key={index} className="relative">
                                                            <div
                                                                className={`relative ${index === 0 ? 'h-72 w-72' : 'h-20 w-20 mt-3 mr-5'}`}>
                                                                <img
                                                                    src={picture}
                                                                    alt={`Uploaded Picture ${index + 1}`}
                                                                    className="w-full h-full object-cover rounded"
                                                                    onClick={() => handleSelectPicture(index)}
                                                                />
                                                                <button
                                                                    onClick={() => handleDeletePicture(index)}
                                                                    className="bg-black text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                                                                    type="button"
                                                                >
                                                                    <X className="h-4 w-4"/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <label
                                                        htmlFor="fileInput"
                                                        style={{border: '1px solid #dadada', borderRadius: '10px'}}
                                                        className={`cursor-pointer flex items-center justify-center ${selectedPictures.length === 0 ? 'h-72 w-72' : 'h-20 w-20 mt-3 mr-5'} bg-white rounded`}
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
                            <div className="flex-1 space-y-3 mt-0">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="mt-0 text-xs font-bold">
                                                Название товара
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="text-black bg-white"
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
                                    name="category"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="mt-0 text-xs font-bold">
                                                Категория товара
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="text-black bg-white"
                                                    placeholder="Введите категорию товара"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}>
                                </FormField>
                                <FormField
                                    control={form.control}
                                    name="collection"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="mt-0 text-xs font-bold">
                                                Коллекция
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="text-black bg-white"
                                                    placeholder="Введите название коллекции"
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
                                            <FormLabel className="mt-0 text-xs font-bold">
                                                Цена
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={"number"}
                                                    disabled={isLoading}
                                                    className="text-black bg-white"
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
                                    name="sex"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="mt-0 text-xs font-bold">Пол</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-row"
                                                >
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="М"/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            М
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="Ж"/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Ж
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="Унисекс"/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Унисекс
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
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
                                            <FormLabel className="mt-0 text-xs font-bold">
                                                Описание
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={isLoading}
                                                    className="text-black input-product"
                                                    placeholder="Введите описание товара"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />


                                <div className="flex flex-row ">
                                    {validSizes.map((size, index) => (
                                        <FormField
                                            key={size}
                                            control={form.control}
                                            name={`sizes.${index}.amount`}
                                            render={({field}) => (
                                                <FormItem className="flex items-center mt-3">
                                                    <div
                                                        className={`flex flex-col items-start justify-start ${index === 0 ? "ml-0" : "ml-2"}`}>
                                                        <FormLabel
                                                            className="mb-1 mt-0 text-xs font-bold">{size}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                disabled={isLoading}
                                                                className="text-black bg-white"
                                                                style={{
                                                                    WebkitAppearance: 'none',
                                                                }}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="uppercase text-s font-bold text-zinc-700 dark:text-secondary/70 pb-1"
                                     style={{marginTop: "40px"}}>
                                    Дополнительная информация о товаре
                                </div>
                                <div style={{marginBottom: '15px', paddingBottom: '20px'}}>
                                    {additionalInformation.map((info, index) => (
                                        <div key={index} style={{marginBottom: '15px'}}>
                                            <FormField
                                                control={form.control}
                                                name={`additionalInformation.${index}.title`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel
                                                            className="font-bold"
                                                        >Заголовок №{index + 1}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="text-black bg-white"
                                                                {...field}
                                                                placeholder="Введите заголовок"/>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`additionalInformation.${index}.description`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className="font-bold"
                                                        >Описание №{index + 1}</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                placeholder="Введите описание"
                                                                className={`text-black`}/>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <footer style={{
                            display: 'flex',
                            padding: '15px 10px',
                            justifyContent: 'flex-end',
                            margin: '0',
                            borderTop: '1px solid #dadada'
                        }}>
                            <Button style={{backgroundColor: '#111111', color: '#fafafa'}} variant="secondary"
                                    disabled={isLoading}>
                                Сохранить
                            </Button>
                        </footer>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
