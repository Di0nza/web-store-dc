import axios from "axios";

export const postPhoto = async (data)=>{
    try {
        return await axios.post("/api/admin/customizations/mainPagePhoto", data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const getAllPhotos = async ()=>{
    try {
        return await axios.get("/api/admin/customizations/mainPagePhoto");
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const getActivePhotos = async ()=>{
    try {
        return await axios.get("/api/users/customizations/mainPagePhoto");
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}


export const patchPhoto = async ( id )=>{
    try {
        return await axios.patch(`/api/admin/customizations/mainPagePhoto/${id}`);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const deletePhoto = async ( id )=>{
    try {
        return await axios.delete(`/api/admin/customizations/mainPagePhoto/${id}`);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}