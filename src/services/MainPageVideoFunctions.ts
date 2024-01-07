import axios from "axios";

export const postVideo = async (data)=>{
    try {
        return await axios.post("/api/admin/customizations/mainPageVideo/active", data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const getVideo = async ()=>{
    try {
        return await axios.get("/api/admin/customizations/mainPageVideo/active");
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const getAllVideos = async ()=>{
    try {
        return await axios.get("/api/admin/customizations/mainPageVideo/all");
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const patchVideo = async ( id )=>{
    try {
        return await axios.patch(`/api/admin/customizations/mainPageVideo/${id}`);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}