import axios from 'axios';
import { instanceAxios } from './axios';
//Get user when refresh page
const getUserThroughToken = async () => {
    try {
        const { data } = await axios.get(
            `${process.env.REACT_APP_AUTH_SERVER_URL}api/auth`
        );
        if (data.status === 'success') {
            return data;
        }
    } catch (error) {
        return error.response.data;
    }
};
//Login
const login = async (formData) => {
    try {
        const { data } = await axios.post(
            `${process.env.REACT_APP_AUTH_SERVER_URL}api/auth/login`,
            formData
        );
        if (data.status === 'success') {
            return data;
        }
    } catch (error) {
        return error.response.data;
    }
};
//Register
const register = async (formData) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_AUTH_SERVER_URL}api/auth/register`,
            formData
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
// Upload image to cloundinary
const uploadToCloudinary = async (formData, type) => {
    const cloundinaryName = 'ninhnam';
    try {
        const res = await instanceAxios.post(
            'https://api.cloudinary.com/v1_1/' +
                cloundinaryName +
                '/' +
                type +
                '/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        console.log(error);
    }
};
// update my profile
const updateProfile = async (formData) => {
    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_AUTH_SERVER_URL}api/profile`,
            formData
        );
        if (data.status === 'success') {
            return data;
        }
    } catch (error) {
        return error.response.data;
    }
};
// get my rooms
const getMyRooms = async () => {
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_CHAT_SERVER_URL}api/chat/room/me`
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//get specific room
const getRoom = async (roomid) => {
    try {
        const { data } = await axios.get(
            `${process.env.REACT_APP_CHAT_SERVER_URL}api/chat/room/${roomid}`
        );
        if (data.status === 'success') {
            return data;
        }
    } catch (error) {
        return error.response.data;
    }
};

// UPDATE a part of specific room
const patchRoom = async (profileid, roomid, action, field) => {
    try {
        const { data } = await axios.patch(
            `${process.env.REACT_APP_CHAT_SERVER_URL}api/chat/room`,
            {
                patch: {
                    id: profileid,
                    roomid,
                    action, //$push, $pull
                    field, //field of model that need modified
                },
            }
        );
        if (data.status === 'success') {
            return data;
        }
    } catch (error) {
        return error.response.data;
    }
};
export {
    getUserThroughToken,
    login,
    register,
    uploadToCloudinary,
    updateProfile,
    getMyRooms,
    patchRoom,
    getRoom,
};
