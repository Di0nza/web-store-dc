import axios from "axios";

export const patchNewCollection = async ( data )=>{
    try {
        return await axios.patch(`/api/admin/customizations/newCollection`, data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const getNewCollectionAdmin = async ()=>{
    try {
        return await axios.get("/api/admin/customizations/newCollection");
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}



