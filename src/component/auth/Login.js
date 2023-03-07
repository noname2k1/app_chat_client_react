import React from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authSlice } from '../redux/slices';
import { useLanguageSelector } from '~/component/redux/selector';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { validateFormInput, removeValidateError } from './validateFormInput';
import { login } from '~/tools/callApi';
import socket from '~/tools/socket.io';
import axiosDefaultHeader from '~/tools/axios';
const Login = () => {
    const [isErrorPattern, setIsErrorPattern] = React.useState({
        username: false,
        password: false,
        cfpassword: false,
        email: false,
    });
    const [isErrorRequired, setIsErrorRequired] = React.useState({
        username: false,
        password: false,
        cfpassword: false,
        email: false,
    });
    const [disabled, setDisabled] = React.useState(true);
    const [error, setError] = React.useState('');
    const currentLanguage = useLanguageSelector().currentLanguage;
    const [typeInputPassWord, setTypeInputPassWord] =
        React.useState('password');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = React.useState({
        username: '',
        password: '',
    });
    const handleLogin = async (e) => {
        e.preventDefault();
        socket.connect();
        const user = await login(data);
        if (user.status === 'success') {
            axiosDefaultHeader(user.token);
            dispatch(
                authSlice.actions.login({
                    profile: user.profile,
                    role: user.role,
                    token: user.token,
                })
            );
            navigate('/', { replace: true });
        } else {
            if (currentLanguage.languageCode === 'en') {
                setError(user.message);
            } else if (currentLanguage.languageCode === 'vn') {
                setError(user.messagevn);
            }
        }
    };

    React.useEffect(() => {
        const { username, password, cfpassword, email } = isErrorPattern;
        if (
            !username &&
            !password &&
            !cfpassword &&
            !email &&
            !isErrorRequired.username &&
            !isErrorRequired.password &&
            !isErrorRequired.cfpassword &&
            !isErrorRequired.email &&
            data.username !== '' &&
            data.password !== ''
        ) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [
        data,
        isErrorPattern,
        isErrorRequired.username,
        isErrorRequired.password,
        isErrorRequired.cfpassword,
        isErrorRequired.email,
    ]);
    const loginForm = [
        {
            index: 0,
            type: 'text',
            name: 'username',
            id: 'username',
            placeholder: currentLanguage?.username,
            required: true,
            requireFailMessage: currentLanguage?.usernameRequired,
            errorMessage: currentLanguage?.invalidUserName,
        },
        {
            index: 1,
            type: typeInputPassWord,
            name: 'password',
            id: 'password',
            placeholder: currentLanguage?.password,
            required: true,
            requireFailMessage: currentLanguage?.passwordRequired,
            errorMessage: currentLanguage?.invalidPassword,
        },
        {
            index: 2,
            type: 'checkbox',
            name: 'remember',
            id: 'remember',
            placeholder: currentLanguage?.remember,
            required: false,
        },
    ];
    return (
        <form className='auth-body-item login'>
            {loginForm.map((formItem, index) => {
                return (
                    <div
                        className={'form-group ' + formItem.name}
                        key={formItem.index}
                    >
                        <label htmlFor={formItem.id} className='form-label'>
                            {formItem.placeholder}
                        </label>
                        <div className='input-wrapper'>
                            <input
                                type={formItem.type}
                                name={formItem.name}
                                id={formItem.id}
                                placeholder={formItem.placeholder}
                                spellCheck='false'
                                required={formItem.required}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        [e.target.name]: e.target.value,
                                    });
                                }}
                                onBlur={(e) => {
                                    validateFormInput(
                                        e,
                                        isErrorRequired,
                                        setIsErrorRequired,
                                        isErrorPattern,
                                        setIsErrorPattern
                                    );
                                }}
                                onFocus={(e) => {
                                    setError('');
                                }}
                                onInput={(e) => {
                                    removeValidateError(
                                        e,
                                        isErrorRequired,
                                        setIsErrorRequired,
                                        isErrorPattern,
                                        setIsErrorPattern
                                    );
                                }}
                            />
                            <div
                                className='change-type-input'
                                onClick={() => {
                                    if (typeInputPassWord === 'password') {
                                        setTypeInputPassWord('text');
                                    } else {
                                        setTypeInputPassWord('password');
                                    }
                                }}
                            >
                                {typeInputPassWord === 'password' ? (
                                    <BsEyeSlash />
                                ) : (
                                    <BsEye />
                                )}
                            </div>
                        </div>
                        {isErrorRequired[formItem.name] && (
                            <div className='error-message-required'>
                                {formItem.requireFailMessage}
                            </div>
                        )}
                        {isErrorPattern[formItem.name] && (
                            <div className='error-message'>
                                {formItem.errorMessage}
                            </div>
                        )}
                    </div>
                );
            })}
            <button
                className={clsx('auth-button', {
                    disabled: disabled,
                })}
                onClick={handleLogin}
                disabled={disabled}
            >
                {currentLanguage?.loginButton}
            </button>
            {error && <div className='error-message-after-submit'>{error}</div>}
            <div className='navigate'>
                {currentLanguage?.forgotPasswordMessage}{' '}
                <span>{currentLanguage?.forgotPassword}</span>
            </div>
        </form>
    );
};

export default Login;
