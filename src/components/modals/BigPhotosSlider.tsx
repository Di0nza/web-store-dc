"use client";
import React,{useState,useEffect,useRef} from 'react';
import Image from "next/image";
import tableInfo from '../../img/sizesinfo.png'
import '../componentsStyles.css'


const BigPhotosSlider = ({ product, onClose }) => {
    const [currentImage, setCurrentImage] = useState(product.pictures[0]);
    const [glassVisible, setGlassVisible] = useState(true);
    const imgRef = useRef(null);
    const glassRef = useRef(null);

    const toggleGlassVisibility = () => {
        setGlassVisible(!glassVisible);
    };

    const handleContainerClick = () => {
        toggleGlassVisibility();
    };

    const magnify = (img, zoom) => {
        const glass = glassRef.current;
        if (img && glass) {
            glass.style.backgroundImage = `url('${img.src}')`;
            glass.style.backgroundRepeat = 'no-repeat';
            glass.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;

            const bw = 3;
            const w = glass.offsetWidth / 2;
            const h = glass.offsetHeight / 2;

            const moveMagnifier = (e) => {
                e.preventDefault();
                const pos = getCursorPos(e);
                let x = pos.x;
                let y = pos.y;

                if (x > img.width - w / zoom) {
                    x = img.width - w / zoom;
                }
                if (x < w / zoom) {
                    x = w / zoom;
                }
                if (y > img.height - h / zoom) {
                    y = img.height - h / zoom;
                }
                if (y < h / zoom) {
                    y = h / zoom;
                }

                glass.style.left = `${x - w}px`;
                glass.style.top = `${y - h}px`;
                glass.style.backgroundPosition = `-${x * zoom - w + bw}px -${y * zoom - h + bw}px`;
            };

            const getCursorPos = (e) => {
                let x = 0;
                let y = 0;
                e = e || window.event;
                const a = img.getBoundingClientRect();
                x = e.pageX - a.left;
                y = e.pageY - a.top;
                x -= window.pageXOffset;
                y -= window.pageYOffset;
                return { x, y };
            };

            glass.addEventListener('mousemove', moveMagnifier);
            img.addEventListener('mousemove', moveMagnifier);
            glass.addEventListener('touchmove', moveMagnifier);
            img.addEventListener('touchmove', moveMagnifier);
        }
    };

    const changeImage = (newImage) => {
        setGlassVisible(true);
        setCurrentImage(() => {
            magnify(imgRef.current, 4);
            return newImage;
        });
    };

    useEffect(() => {
        magnify(imgRef.current, 4);
    }, [currentImage]);

    return (
        <div className='size-table-modal'>
            <div className='big-photo-modal-content'>
                <div className='big-photos-content-info'>
                    <div className='big-photos-container-slider'>
                        <div className='img-magnifier-container' onClick={handleContainerClick}>
                            <img
                                ref={imgRef}
                                id='myimage'
                                src={currentImage}
                                alt={product.title}
                                className={'big-photo-slider-preview'}
                            />
                            <div
                                ref={glassRef}
                                className={`img-magnifier-glass ${glassVisible ? 'visible' : ''}`}
                            ></div>
                        </div>
                        <div className={'big-photo-slider-info'}>
                            <div className='big-photo-thumbnails'>
                            {product.pictures.map((image, index) => (
                                    <img
                                        key={index}
                                        className={`big-photo-thumbnail ${image === currentImage ? 'selected' : ''}`}
                                        src={image}
                                        alt={`Thumbnail ${index}`}
                                        onClick={() => changeImage(image)}
                                    />
                                ))}
                            </div>
                            <p>Чтобы детальнее рассмотреть фотографии, наведите курсор на изображение. Для отключения лупы нажмите на изображение, для включения нажмите повторно</p>
                        </div>
                        <span className='big-photo-close' onClick={onClose}>&times;</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BigPhotosSlider;