import React from 'react';
import { Spinner } from 'react-bootstrap';
import './FaceRecognition.css';

const FaceRecognition = ({ image, response, isLoading }) => {
  if (isLoading) {
    return (
      <Spinner
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: '100px',
          height: '100px',
        }}
        animation="border"
      />
    );
  }
  if (!response.outputs || !image || !response.outputs[0].data.regions) {
    return <div></div>;
  }
  const width = Number(image.width);
  const height = Number(image.height);
  return response.outputs[0].data.regions.map((region, index) => {
    const clarifaiFace = region.region_info.bounding_box;
    const leftCol = clarifaiFace.left_col * width;
    const topRow = clarifaiFace.top_row * height;
    const rightCol = width - clarifaiFace.right_col * width;
    const bottomRow = height - clarifaiFace.bottom_row * height;
    return (
      <div
        key={index}
        className="bounding-box"
        style={{
          top: topRow,
          right: rightCol,
          left: leftCol,
          bottom: bottomRow,
        }}
      ></div>
    );
  });
};

export default FaceRecognition;
