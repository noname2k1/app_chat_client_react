import axios from 'axios';
import { Navigate } from 'react-router-dom';
const instanceAxios = axios.create();
const roomInstance = axios.create();
const uploadFileInstance = axios.create();
const axiosDefaultHeader = (token) => {
    if (token) {
        axios.defaults.headers.authorization = 'Bearer ' + token;
        roomInstance.defaults.headers.authorization = 'Bearer ' + token;
        uploadFileInstance.defaults.headers.authorization = 'Bearer ' + token;
    } else {
        delete axios.defaults.headers.authorization;
        delete roomInstance.defaults.headers.authorization;
        delete uploadFileInstance.defaults.headers.authorization;
    }
};
delete instanceAxios.defaults.headers['authorization'];
export default axiosDefaultHeader;

axios.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return <Navigate to='not-found' />;
        // return Promise.reject(error);
    }
);
export { instanceAxios, roomInstance, uploadFileInstance };
