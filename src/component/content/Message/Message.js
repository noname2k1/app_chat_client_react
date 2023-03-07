import React from 'react';
import clsx from 'clsx';
import './Message.scss';
import { FaReply, FaRegHeart, FaHeart } from 'react-icons/fa';
import { RiShareForwardFill } from 'react-icons/ri';
import {
    BsChevronCompactDown,
    BsChevronDown,
    BsChevronDoubleDown,
} from 'react-icons/bs';
import axios from 'axios';
import {
    useAuthSelector,
    useComponentSelector,
    useLanguageSelector,
} from '~/component/redux/selector';
import socket from '~/tools/socket.io';
import LoadingFaceBook from '~/component/custom/loadingFaceBook/LoadingFaceBook';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Overlay from '~/component/Overlay';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';
import DisplayFile from '~/component/custom/DisplayFile/DisplayFile';
import LockRoom from './LockRoom/LockRoom';
const Message = () => {
    const dispatch = useDispatch();
    const { roomid } = useParams();
    const bottomRef = React.useRef();
    const goToBottomRef = React.useRef();
    const scrollPosition = React.useRef();
    const messagesContainerRef = React.useRef();
    const currentLanguage = useLanguageSelector().currentLanguage;
    const profile = useAuthSelector().profile;
    const { selectedRoomid, currentMessages, messagesLastPage, currentRoom } =
        useComponentSelector();
    const [contextid, setContextid] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [iconIndex, setIconIndex] = React.useState(0);
    const [gotoBottomButton, setGoToBottomButton] = React.useState(false);

    const limit = 30;
    const loadMessages = React.useCallback(async () => {
        const res = await axios.get(
            `${process.env.REACT_APP_CHAT_SERVER_URL}api/chat/message?id=${
                window.location.pathname.split('/')[3] || roomid
            }&page=0&limit=${limit}`
        );
        if (res && res.message) {
            const newMessages = res.messages.reverse();
            dispatch(
                componentSlice.actions.setMessages([
                    ...new Set([...newMessages, ...currentMessages]),
                ])
            );
        }

        //eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        const loadPreviousMessages = async () => {
            if (+messagesLastPage > 0) {
                const { data } = await axios.get(
                    `${
                        process.env.REACT_APP_CHAT_SERVER_URL
                    }api/chat/message?id=${
                        window.location.pathname.split('/')[3]
                    }&page=${messagesLastPage}&limit=${limit}`
                );
                if (data.status !== 'success') {
                    return;
                }
                if (data.messages.length > 0) {
                    setIsLoading(true);
                    setTimeout(() => {
                        setIsLoading(false);
                        const newMessages = data.messages.reverse();
                        dispatch(
                            componentSlice.actions.setMessages([
                                ...new Set([
                                    ...newMessages,
                                    ...currentMessages,
                                ]),
                            ])
                        );
                        if (scrollPosition.current) {
                            scrollPosition.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                                inline: 'nearest',
                            });
                        }
                    }, 1000);
                }
            } else {
                dispatch(componentSlice.actions.setPage(0));
            }
        };
        loadPreviousMessages();
        // eslint-disable-next-line
    }, [messagesLastPage]);

    React.useEffect(() => {
        dispatch(componentSlice.actions.setPage(0));
        loadMessages();
        // eslint-disable-next-line
    }, [selectedRoomid, roomid]);

    React.useEffect(() => {
        if (currentMessages.length === limit && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
        // eslint-disable-next-line
    }, [selectedRoomid, currentRoom]);

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0) {
            if (currentMessages.length / limit > messagesLastPage * limit) {
                dispatch(
                    componentSlice.actions.setPage(
                        Math.floor(currentMessages.length / limit)
                    )
                );
            }
            dispatch(componentSlice.actions.setPage(messagesLastPage + 1));
        }
    };

    const handleReply = (e) => {
        let id;
        e.target.closest('.option-reply')
            ? (id = e.target.closest('.option-reply').id)
            : (id = e.target.dataset.id);
        const repliedMessage = currentMessages.find(
            (message) => message._id === id
        );
        if (repliedMessage) {
            dispatch(
                componentSlice.actions.setReplying({
                    enabled: true,
                    message: repliedMessage,
                })
            );
        }
    };
    //like/dislike
    const handleLike = (e) => {
        socket.emit('like', {
            roomid: selectedRoomid,
            profileid: profile._id,
            messageid: e.target.closest('.option-react').id,
        });
    };
    const handleDisLike = (e) => {
        socket.emit('dislike', {
            roomid: selectedRoomid,
            profileid: profile._id,
            messageid: e.target.closest('.option-react').id,
        });
    };
    //show/hide my-message
    const handleShowMessage = (e) => {
        socket.emit('show-message', {
            roomid: selectedRoomid,
            profileid: profile._id,
            messageid: e.target.dataset.id,
        });
    };
    const handleHideMessage = (e) => {
        socket.emit('hide-message', {
            roomid: selectedRoomid,
            profileid: profile._id,
            messageid: e.target.dataset.id,
        });
    };

    const removeContext = () => {
        setContextid('');
    };

    const scrollToView = (e) => {
        const id = e.target.closest('.reply-message-wrapper').dataset.id;
        const messageScrollTo = document.getElementById(id);
        if (messageScrollTo) {
            messageScrollTo.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
        }
    };

    React.useEffect(() => {
        const showGoToBottomButton = () => {
            if (
                messagesContainerRef.current &&
                messagesContainerRef.current.scrollTop < 1500
            ) {
                setGoToBottomButton(true);
            } else {
                setGoToBottomButton(false);
            }
        };
        if (messagesContainerRef.current) {
            messagesContainerRef.current.addEventListener(
                'scroll',
                showGoToBottomButton
            );
        }
    }, []);

    const goToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
            });
        }
    };

    React.useEffect(() => {
        if (gotoBottomButton) {
            setTimeout(() => {
                if (iconIndex === 2) {
                    setIconIndex(0);
                } else {
                    setIconIndex(iconIndex + 1);
                }
            }, 3000);
        }
    }, [iconIndex, gotoBottomButton]);

    //socket.io
    React.useLayoutEffect(() => {
        socket.on('new-message', (newMessage) => {
            if (window.location.pathname.split('/')[3] === newMessage.roomid) {
                socket.emit(
                    'view',
                    window.location.pathname.split('/')[3],
                    profile._id
                );
                loadMessages();
                goToBottom();
            }
        });
        //eslint-disable-next-line
    }, [selectedRoomid]);
    React.useEffect(() => {
        socket.on('like', (message) => {
            loadMessages();
        });
        socket.on('dislike', (message) => {
            loadMessages();
        });
        socket.on('show-message', (message) => {
            loadMessages();
        });
        socket.on('hide-message', (message) => {
            loadMessages();
        });
        // eslint-disable-next-line
    }, []);
    if (currentRoom.mode === 'private' && currentRoom.blocked) {
        return <LockRoom />;
    }
    return (
        <div
            ref={messagesContainerRef}
            className={clsx('content-body-text', {
                flex: currentMessages.length === 0,
            })}
            onScroll={handleScroll}
        >
            {isLoading && <LoadingFaceBook />}
            {currentMessages?.map((message, index) => {
                //message of others
                if (message.sender._id !== profile._id) {
                    return (
                        <div
                            className='message-wrapper'
                            key={message._id}
                            ref={index === limit - 1 ? scrollPosition : null}
                            id={message._id}
                        >
                            {message.reply && (
                                <div
                                    className='reply-message-wrapper'
                                    data-id={message.replymessageid._id}
                                    onClick={scrollToView}
                                >
                                    <header>
                                        <FaReply size={15} />
                                        &nbsp;
                                        {message.sender.name}
                                        {currentLanguage.repliedTo}
                                        <strong>
                                            &nbsp;
                                            {message.replymessageid.sender
                                                ._id !== profile._id
                                                ? message.replymessageid.sender
                                                      .name
                                                : currentLanguage.yourSelf}
                                        </strong>
                                    </header>
                                    <div className='mesage'>
                                        {message.replymessageid.message}
                                        {message.replymessageid.attachmentsLink
                                            .length > 0 &&
                                            currentLanguage.attachments}
                                    </div>
                                </div>
                            )}
                            <div className='other-message message'>
                                <div className='other-avatar'>
                                    <img
                                        src={message.sender.avatarlink}
                                        alt='other-avatar'
                                        className='other-avt-img'
                                        width='100%'
                                        height='100%'
                                    />
                                </div>
                                <div className='other-message-text'>
                                    <div className='other-name'>
                                        {message.sender.name}
                                    </div>
                                    <div className='inside-wrap'>
                                        {message.hide ? (
                                            <div className='hidden'>
                                                {
                                                    currentLanguage.displayMsgWhenHide
                                                }
                                            </div>
                                        ) : (
                                            <>
                                                <div className='message-attachments'>
                                                    {message.attachmentsLink.map(
                                                        (attachment, index) => (
                                                            <DisplayFile
                                                                key={index}
                                                                item={
                                                                    attachment
                                                                }
                                                                link={
                                                                    attachment.link
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                {message.message && (
                                                    <div>{message.message}</div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {message.reacter.length > 0 && (
                                        <span className='react-total'>
                                            <div>
                                                <FaHeart size={20} />
                                                <span>
                                                    {message.reacter.length > 9
                                                        ? message.reacter
                                                              .length + '+'
                                                        : message.reacter
                                                              .length}
                                                </span>
                                            </div>
                                        </span>
                                    )}
                                </div>
                                <div className='other-message-options options'>
                                    <div
                                        className='options-item option-reply'
                                        id={message._id}
                                        onClick={handleReply}
                                    >
                                        <FaReply size={20} />
                                    </div>
                                    <div className='options-item-separate'></div>
                                    {!message.reacter.find(
                                        (reacter) => reacter._id === profile._id
                                    ) && (
                                        <div
                                            className='options-item option-react'
                                            id={message._id}
                                            onClick={handleLike}
                                        >
                                            <FaRegHeart size={20} />
                                        </div>
                                    )}
                                    {message.reacter.length > 0 &&
                                        message.reacter.find(
                                            (reacter) =>
                                                reacter._id === profile._id
                                        ) && (
                                            <div
                                                className='options-item option-react liked'
                                                id={message._id}
                                                onClick={handleDisLike}
                                            >
                                                <FaHeart size={20} />
                                            </div>
                                        )}
                                    <div className='options-item-separate'></div>
                                    <div
                                        className='options-item option-forward'
                                        id={message._id}
                                    >
                                        <RiShareForwardFill size={20} />
                                    </div>
                                </div>
                                <div className='message-createdAt'>
                                    {moment(message.createdAt).format(
                                        'DD/MM/YYYY hh:mm'
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }
                //my message
                return (
                    <div
                        className='message-wrapper'
                        key={message._id}
                        ref={index === limit - 1 ? scrollPosition : null}
                        id={message._id}
                    >
                        {message.reply && (
                            <div
                                className='reply-message-wrapper my-message'
                                data-id={message.replymessageid._id}
                                onClick={scrollToView}
                            >
                                <header>
                                    <FaReply size={15} />
                                    &nbsp;
                                    {currentLanguage.you}
                                    {currentLanguage.repliedTo}
                                    <strong>
                                        &nbsp;
                                        {message.replymessageid.sender._id !==
                                        profile._id
                                            ? message.replymessageid.sender.name
                                            : currentLanguage.yourSelf}
                                    </strong>
                                </header>
                                <div className='mesage'>
                                    {message.replymessageid.message}
                                    {message.replymessageid.attachmentsLink
                                        .length > 0 &&
                                        currentLanguage.attachments}
                                </div>
                            </div>
                        )}
                        <div
                            className='my-message-text message'
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setContextid(message._id);
                            }}
                        >
                            <div className='inside-wrap'>
                                {message.hide ? (
                                    <div className='hidden'>
                                        {currentLanguage.displayMsgWhenHide}
                                    </div>
                                ) : (
                                    <>
                                        <div className='message-attachments'>
                                            {message.attachmentsLink.map(
                                                (attachment, index) => (
                                                    <DisplayFile
                                                        key={index}
                                                        item={attachment}
                                                        link={attachment.link}
                                                    />
                                                )
                                            )}
                                        </div>
                                        {message.message && (
                                            <div>{message.message}</div>
                                        )}
                                    </>
                                )}
                            </div>
                            {contextid === message._id && (
                                <Overlay onClick={removeContext} />
                            )}
                            <div
                                className={clsx(
                                    'message-context-menu',
                                    'my-context-menu',
                                    {
                                        show: contextid === message._id,
                                    }
                                )}
                            >
                                {message.hide ? (
                                    <div
                                        className='context-menu-item'
                                        data-id={message._id}
                                        onClick={(e) => {
                                            removeContext();
                                            handleShowMessage(e);
                                        }}
                                    >
                                        {currentLanguage.show}
                                    </div>
                                ) : (
                                    <div
                                        className='context-menu-item'
                                        data-id={message._id}
                                        onClick={(e) => {
                                            removeContext();
                                            handleHideMessage(e);
                                        }}
                                    >
                                        {currentLanguage.hide}
                                    </div>
                                )}
                                <div
                                    className='context-menu-item'
                                    data-id={message._id}
                                    onClick={(e) => {
                                        removeContext();
                                        handleReply(e);
                                    }}
                                >
                                    {currentLanguage.reply}
                                </div>
                                <div
                                    className='context-menu-item'
                                    data-id={message._id}
                                    onClick={removeContext}
                                >
                                    {currentLanguage.forward}
                                </div>
                            </div>
                            <div className='message-createdAt'>
                                {moment(message.createdAt).format(
                                    'DD/MM/YYYY hh:mm'
                                )}
                            </div>
                            {message.reacter.length > 0 && (
                                <span className='react-total'>
                                    <div>
                                        <FaHeart size={20} />
                                        <span>
                                            {message.reacter.length > 9
                                                ? message.reacter.length + '+'
                                                : message.reacter.length}
                                        </span>
                                    </div>
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
            <div className='hidden-bottom-position' ref={bottomRef}></div>
            {currentMessages.length === 0 && (
                <div className='content-body-text-empty'>
                    {currentLanguage.noMessage}
                </div>
            )}
            {gotoBottomButton && (
                <div className='to-bottom-wrapper' ref={goToBottomRef}>
                    <button className='to-bottom-button' onClick={goToBottom}>
                        <div
                            className={clsx('down', {
                                active: iconIndex === 0,
                            })}
                        >
                            <BsChevronCompactDown />
                        </div>
                        <div
                            className={clsx('down', {
                                active: iconIndex === 1,
                            })}
                        >
                            <BsChevronDown />
                        </div>
                        <div
                            className={clsx('down', {
                                active: iconIndex === 2,
                            })}
                        >
                            <BsChevronDoubleDown />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Message;
