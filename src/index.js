import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from './component/Global/GlobalStyle/GlobalStyle';
import Auth from './component/auth/Auth';
import ProtectedRoute from './component/auth/ProtectedRoute';
import store from '~/component/redux/store';
import { Provider } from 'react-redux';
import CreateMessage from './component/createMessageBox/CreateMessage';
import Content from './component/content/Content';
import NoRoom from './component/content/NoRoom/NoRoom';
import Profile from './component/auth/Profile/Profile';
import CallContextProvider from './component/Call/callContext';
import Error404 from './page/Error404';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <GlobalStyle>
        <BrowserRouter>
            <Provider store={store}>
                <Routes>
                    <Route path='/auth' element={<Auth />}></Route>
                    <Route
                        path='/'
                        element={
                            <ProtectedRoute>
                                <App />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Content />}></Route>
                        <Route path='new' element={<CreateMessage />}></Route>
                        <Route
                            path='rooms/room/:roomid'
                            element={
                                <CallContextProvider>
                                    <Content />
                                </CallContextProvider>
                            }
                        ></Route>
                        <Route
                            path='rooms/profile/:profileid'
                            element={
                                <CallContextProvider>
                                    <Content />
                                </CallContextProvider>
                            }
                        ></Route>
                        <Route
                            path='rooms/no-room'
                            element={<NoRoom />}
                        ></Route>
                        <Route path='profile'>
                            <Route
                                path=':profileid'
                                element={<Profile />}
                            ></Route>
                            <Route index element={<Profile />}></Route>
                        </Route>
                    </Route>
                    <Route path='not-found' element={<Error404 />}></Route>
                    <Route path='*' element={<Error404 />}></Route>
                </Routes>
            </Provider>
        </BrowserRouter>
    </GlobalStyle>
    // </React.StrictMode>
);
