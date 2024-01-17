"use client"

import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import '../componentsStyles.css'


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
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const additionalInformation = ['Материал', 'Уход', '', ''];

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
export const CreateProductModal = () => {

    const {isOpen, onClose, type} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "createProduct";

    const [selectedPictures, setSelectedPictures] = useState([]);
    const [selectedPicturesFiles, setSelectedPicturesFiles] = useState<File[]>([]);

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
        //const compressedImage = await compressImage(files?.[0])
        const convertedFile = await convertBase64(files?.[0]) as File;
        setSelectedPicturesFiles([...selectedPicturesFiles, convertedFile]);
        setSelectedPictures((prevPictures) => [...prevPictures, ...newPictures]);
        console.log(selectedPictures)
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


    // const compressImage = async (file) => {
    //     return new Promise((resolve) => {
    //         const reader = new FileReader();
    //         reader.onload = async (event) => {
    //             const img = new Image();
    //             img.src = event.target.result;
    //
    //             img.onload = () => {
    //                 const maxWidth = 800;
    //                 const maxHeight = 600;
    //
    //                 let width = img.width;
    //                 let height = img.height;
    //
    //
    //                 if (width > maxWidth || height > maxHeight) {
    //                     const aspectRatio = width / height;
    //
    //                     if (width > height) {
    //                         width = maxWidth;
    //                         height = width / aspectRatio;
    //                     } else {
    //                         height = maxHeight;
    //                         width = height * aspectRatio;
    //                     }
    //                 }
    //
    //                 const canvas = document.createElement('canvas');
    //                 const ctx = canvas.getContext('2d');
    //
    //                 canvas.width = width;
    //                 canvas.height = height;
    //
    //                 ctx.drawImage(img, 0, 0, width, height);
    //
    //                 canvas.toBlob((blob) => {
    //                     const compressedFile = new File([blob], file.name, {
    //                         type: 'image/jpeg',
    //                     });
    //                     resolve(compressedFile);
    //                 }, 'image/jpeg', 1);
    //             };
    //         };
    //
    //         reader.readAsDataURL(file);
    //     });
    // };



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
            category: "",
            collection: "",
            sex: "",
            price: "",
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
    useEffect(() => {
        form.setValue('additionalInformation.0.title', 'Материал');
        form.setValue('additionalInformation.1.title', 'Уход');
    }, [form])

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        console.log(selectedPicturesFiles);
        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "sizes") {
                    values[key].forEach((size) => {
                        formData.append(size.size, size.amount);
                    });
                } else if (key === "additionalInformation") {
                    values[key].forEach((ai, index)=>{
                        if(ai.title.trim() !== "" && ai.description.trim() !== ""){
                            formData.append(`additionalInformation[${index}].title`, ai.title);
                            formData.append(`additionalInformation[${index}].description`, ai.description);
                        }
                    })
                } else {
                    formData.append(key, values[key]);
                }
            });

            selectedPicturesFiles.forEach((file, index) => {
                formData.append(`picturesFiles[${index}]`, file);
            });

            await axios.post("/api/admin/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Указываем, что это форма для передачи файлов
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

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black p-0 overflow-hidden addProdBlock" >
                <DialogHeader className="pt-8 px6 ml-6">
                    <DialogTitle className="text-2xl text-left font-bold">
                        Создайте товар
                    </DialogTitle>
                    <DialogDescription className="text-left text-zinc-500">
                        Дайте товару название, описание, категорию, добавьте фотографии и количество товара для каждого
                        размера.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-row space-y-6 px-6 addProdBlockBody">
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
                                                        <div key={index}>
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
                                                        style={{border:'1px solid #dadada', borderRadius:'10px'}}
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
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel className="mt-0 text-xs font-bold">Пол</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-row"
                                                >
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="М" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            М
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="Ж" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Ж
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="Унисекс" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Унисекс
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
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


                                <div className="flex flex-row addProdSizesBlock">
                                    {/* Добавьте этот блок для инпутов размеров */}

                                    {validSizes.map((size, index) => (
                                        <FormField
                                            key={size}
                                            control={form.control}
                                            name={`sizes.${index}.amount`}
                                            render={({field}) => (
                                                <FormItem className="flex items-center mt-3">
                                                    <div className={`flex flex-col items-start justify-start ${index === 0 ? "ml-0" : "ml-2"} addProdSizesBlockItem`}>
                                                        <FormLabel className="mb-1 mt-0 text-xs font-bold">{size}</FormLabel>
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
                                <div className="uppercase text-s font-bold text-zinc-700 dark:text-secondary/70"
                                     style={{marginTop: "40px"}}>
                                    Дополнительная информация о товаре
                                </div>
                                <div>
                                    {additionalInformation.map((info, index) => (
                                        <div key={index} style={{marginBottom:'15px'}}>
                                            <FormField
                                                control={form.control}
                                                name={`additionalInformation.${index}.title`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className="font-bold">Заголовок
                                                            №{index + 1}</FormLabel>
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
                                                        <FormLabel className="font-bold">Описание
                                                            №{index + 1}</FormLabel>
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
                                    <br/>
                                </div>
                            </div>
                        </div>
                        <footer style={{display:'flex', padding: '15px 10px', justifyContent:'flex-end', margin:'0', borderTop:'1px solid #dadada'}}>
                            <Button style={{backgroundColor:'#111111', color:'#fafafa'}} variant="secondary" disabled={isLoading}>
                                Создать
                            </Button>
                        </footer>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
