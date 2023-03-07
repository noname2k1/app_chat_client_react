import React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { useDispatch } from 'react-redux';
import { useComponentSelector } from '~/component/redux/selector';
import { componentSlice } from '~/component/redux/slices';
const ReactLightBox = () => {
    const { viewFileModal } = useComponentSelector();
    const dispatch = useDispatch();
    const [src, setSrc] = React.useState({
        prevSrc: '',
        mainSrc: '',
        nextSrc: '',
    });
    const [index, setIndex] = React.useState({
        prevIndex: 0,
        nextIndex: 0,
    });

    const closeZoomBox = () => {
        dispatch(
            componentSlice.actions.setViewFileModal({
                zoomFile: false,
                enable: true,
            })
        );
    };

    React.useEffect(() => {
        const filterImages = viewFileModal.files.filter(
            (file) => file.type === 'image'
        );
        const mainSrc = filterImages.find(
            (file) =>
                file.link ===
                viewFileModal.files[viewFileModal.currentIndex].link
        );
        const mainSrcIndex = filterImages.indexOf(mainSrc);
        let prevIndex =
            mainSrcIndex > 0 ? mainSrcIndex - 1 : filterImages.length - 1;
        let nextIndex =
            mainSrcIndex < filterImages.length - 1 ? mainSrcIndex + 1 : 0;
        const prevSrcIndex = viewFileModal.files.indexOf(
            filterImages[prevIndex]
        );
        const nextSrcIndex = viewFileModal.files.indexOf(
            filterImages[nextIndex]
        );
        setSrc((prev) => ({
            ...prev,
            mainSrc: mainSrc.link,
            prevSrc: filterImages[prevIndex].link,
            nextSrc: filterImages[nextIndex].link,
        }));
        setIndex((prev) => ({
            ...prev,
            prevIndex: prevSrcIndex,
            nextIndex: nextSrcIndex,
        }));
    }, [viewFileModal.currentIndex]);

    const nextItem = () => {
        dispatch(
            componentSlice.actions.setViewFileModal({
                currentIndex: index.nextIndex,
            })
        );
    };
    const previousItem = () => {
        dispatch(
            componentSlice.actions.setViewFileModal({
                currentIndex: index.prevIndex,
            })
        );
    };
    return (
        <div className='zoom-box-container'>
            <Lightbox
                mainSrc={src.mainSrc}
                nextSrc={src.nextSrc}
                prevSrc={src.prevSrc}
                onCloseRequest={closeZoomBox}
                onMovePrevRequest={previousItem}
                onMoveNextRequest={nextItem}
            />
        </div>
    );
};

export default ReactLightBox;
