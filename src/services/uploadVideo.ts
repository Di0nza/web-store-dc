import axios from "axios";

export const postVideo = async (data)=>{
    try {
        return await axios.post("/api/admin/customizations/mainPageVideo", data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}