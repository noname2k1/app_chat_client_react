import React from 'react';
import './CreateMessage.scss';
import { IoSend, IoRemoveCircleSharp } from 'react-icons/io5';
import { useLanguageSelector } from '../redux/selector';
const CreateMessage = () => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const refInput = React.useRef();
    const [tags, setTags] = React.useState([]);
    React.useEffect(() => {
        if (refInput.current) {
            refInput.current.setAttribute(
                'size',
                refInput.current.getAttribute('placeholder').length
            );
            refInput.current.focus();
        }
        const roomLinks = document.querySelectorAll('.room-link');
        if (roomLinks.length > 0) {
            roomLinks.forEach((element) => element.classList.remove('active'));
        }
    }, []);
    return (
        <div className='create-message-container'>
            <div className='create-message-header'>
                {currentLanguage.to}:&nbsp;&nbsp;&nbsp;
                <div className='send-to'>
                    <div className='tag'>
                        <div className='avatar'>
                            <img src='' alt='avt' width='100%' height='100%' />
                        </div>
                        <div className='name'>Ninh Ngọc Nam</div>
                        <span className='remove-tag'>
                            <IoRemoveCircleSharp />
                        </span>
                    </div>
                    <div className='search-receiver-wrapper'>
                        <input
                            type='text'
                            placeholder={currentLanguage.toPlaceholder}
                            ref={refInput}
                            autoComplete='false'
                            spellCheck='false'
                        />
                        <ul className='suggestions-list'>
                            <li className='suggestions-item'>
                                <div className='avatar'>
                                    <img
                                        src=''
                                        alt='avt'
                                        width='100%'
                                        height='100%'
                                    />
                                </div>
                                <div className='name'>
                                    Naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='create-message-body'>
                <div className='message-content'>
                    <textarea
                        name=''
                        id=''
                        cols='30'
                        rows='10'
                        placeholder={currentLanguage.placeholder}
                        autoComplete='false'
                        spellCheck='false'
                    ></textarea>
                </div>
                <button className='create-message__button'>
                    {currentLanguage.send}&nbsp;
                    <IoSend />
                </button>
            </div>
        </div>
    );
};

export default CreateMessage;
