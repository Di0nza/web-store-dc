import {create} from "zustand"
import {IProduct} from "@/types/Product";

export type ModalType = "createProduct" | "editProduct" | "deleteProduct" | "editMainPageVideo" | "deleteMainPageVideo"

interface ModalData {
    product?: any;
    reload?:string
    video?: any;
    channelType?: any;
    apiUrl?: string;
    query?: Record<string, any>;
}

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    data: ModalData;
    onOpen: (type: ModalType, data?:ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set)=> ({
    type:null,
    isOpen:false,
    data:{},
    onOpen: (type, data={})=> set({isOpen:true, type, data}),
    onClose: () => set({type:null, isOpen: false, data:{}})
}))