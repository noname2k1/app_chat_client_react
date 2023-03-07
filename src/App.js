import React from 'react';
import Daskboard from './component/daskboard/Daskboard';
import './App.scss';
import TypeName from './component/auth/TypeName/TypeName';
import {
    useAuthSelector,
    useComponentSelector,
} from './component/redux/selector';
import {
    authSlice,
    usersOnlineSlice,
    componentSlice,
} from './component/redux/slices';
import { useDispatch } from 'react-redux';
import socket from './tools/socket.io';
import { Outlet } from 'react-router-dom';
import Modal from './component/Modal/Modal';
import CallContextProvider from './component/Call/callContext';
import ViewMediasFilesLinks from './component/dropdown/RoomDropDown/ViewMediasFilesLinks/ViewMediasFilesLinks';
import MobileSearchBar from './mobile/mobileSearchbar/MobileSearchBar';
import MobileAccountsOnline from './mobile/mobileAccountOnlines/MobileAccountsOnline';
import ComingSoon from './component/custom/comingSoon/ComingSoon';
import Contribute from './component/custom/contribute/Contribute';
import Room from './component/Room/Room';

function App() {
    const { isAuthenticated, profile } = useAuthSelector();
    const {
        mobileSearchBar,
        mobileAccountsOnline,
        comingSoon,
        contribute,
        roomBox,
    } = useComponentSelector();
    const dispatch = useDispatch();

    const handleCloseRoomBox = () => {
        dispatch(componentSlice.actions.setPropertie({ roomBox: false }));
    };

    React.useEffect(() => {
        socket.emit('login', {
            profileid: profile._id,
            avatarlink: profile.avatarlink,
            name: profile.name,
        });
        //update users online
        socket.on('online', (usersOnl) => {
            const subtractMe = usersOnl.filter(
                (user) => user.profileid !== profile._id
            );
            dispatch(authSlice.actions.updateSocketid(socket.id));
            dispatch(usersOnlineSlice.actions.update(subtractMe));
        });

        //eslint-disable-next-line
    }, []);
    const handleMouseOver = () => {
        if (!socket.connected) {
            socket.connect();
        }
    };
    let locationJS = window.location.pathname;
    React.useEffect(() => {
        if (window.location.pathname.indexOf('/rooms/room/') === -1) {
            dispatch(componentSlice.actions.setMessages([]));
        }
    }, [locationJS]);
    return (
        <div className='App' onMouseOver={handleMouseOver}>
            <Daskboard />
            <CallContextProvider>
                <Modal />
            </CallContextProvider>
            <Outlet />
            <ViewMediasFilesLinks />
            {isAuthenticated && !profile.name && <TypeName />}
            {mobileSearchBar && <MobileSearchBar />}
            {mobileAccountsOnline && <MobileAccountsOnline />}
            {comingSoon && <ComingSoon />}
            {contribute && <Contribute />}
            {roomBox && <Room closeBox={handleCloseRoomBox} />}
        </div>
    );
}

export default App;
