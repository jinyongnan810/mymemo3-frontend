import React from 'react'
import { CSSTransition } from 'react-transition-group';


const ImageModal = ({ img, onClose }: { img: string | null, onClose: Function }) => {
    // if (!img) return null;
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const clicked = e.target as HTMLElement;
        if (clicked.tagName !== 'IMG') {
            e.stopPropagation()
            onClose()
        }
    }
    return (
        <CSSTransition in={img != null} timeout={300} unmountOnExit classNames='k-image-modal'>

            <div className='k-image-modal' onClick={onClick}>
                <img src={img!} alt="" />
                <img
                    src="assets/imgs/close.svg"
                    alt="close..."
                    className="k-close-image-modal"
                    onClick={e => onClose()}
                />
            </div>
        </CSSTransition>
    )
}

export default ImageModal
