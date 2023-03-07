import React from 'react';
import { useAuthSelector, useComponentSelector } from '../redux/selector';
import { Navigate, useNavigate } from 'react-router-dom';
import { authSlice } from '../redux/slices';
import axiosDefaultHeader from '~/tools/axios';
import { useDispatch } from 'react-redux';
import { getUserThroughToken } from '~/tools/callApi';
const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = window.localStorage.getItem('token');
    React.useEffect(() => {
        if (token) {
            const loadUser = async () => {
                axiosDefaultHeader(token);
                const user = await getUserThroughToken();
                if (user.status === 'success') {
                    dispatch(
                        authSlice.actions.login({
                            profile: user.profile,
                            role: user.role,
                            token: user.token,
                        })
                    );
                } else {
                    console.log(user?.message);
                    navigate('/auth', { replace: true });
                }
            };
            loadUser();
        } else {
            navigate('/auth', { replace: true });
        }
    }, [token, dispatch, navigate]);

    const isAuthenticated = useAuthSelector().isAuthenticated;
    if (isAuthenticated) {
        return children;
    }
};

export default ProtectedRoute;
