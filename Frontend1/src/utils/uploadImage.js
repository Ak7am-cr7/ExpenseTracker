// src/utils/uploadImage.js
import axios from "axios";
import { API_PATHS, BASE_URL } from "./apiPaths";

const uploadImage = async (imageFile, token) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const fullUrl = BASE_URL.endsWith('/')
            ? `${BASE_URL}${API_PATHS.IMAGE.UPLOAD_IMAGE.replace(/^\//, "")}`
            : `${BASE_URL}/${API_PATHS.IMAGE.UPLOAD_IMAGE.replace(/^\//, '')}`;

        const headers = {
            'Content-Type': 'multipart/form-data',
        };


        if (token) {
            headers['Authorization'] = `Bearer ${token.replace(/"/g, '')}`;
        }

        const response = await axios.post(fullUrl, formData, { headers });
        return response.data;
    } catch (error) {
        console.error("Upload utility error:", error.response?.data || error.message);
        return null;
    }
};

export default uploadImage;