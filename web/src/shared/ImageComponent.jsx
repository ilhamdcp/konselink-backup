import LoaderImage from '../assets/interface.svg';
import React from 'react';
import '../assets/css/ImageComponent.css'

const ImageComponent = (url) => {
    if (url.url != null && url.url.length > 0) {
			return(
				<img className="ImageComponent" src={url.url} />
				)
		} else {
			return(
				<img className="ImageComponent" src={LoaderImage} />
				)
		}
}

export default ImageComponent