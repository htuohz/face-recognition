import React, { useState, useRef } from 'react';
import CandidateList from '../CandidateList/CandidateList';
import './Celebrity.css';
import { CSSTransition } from 'react-transition-group';
import { Tooltip, Overlay, Spinner } from 'react-bootstrap';

const Celebrity = ({ image, response, isLoading }) => {
  const [displayingList, setDisplayingList] = useState(-1);
  const [show, setShow] = useState(true);
  const target = useRef(null);
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
    return <></>;
  }
  const width = Number(image.width);
  const height = Number(image.height);
  const handleOnMouseEnter = (index) => {
    if (displayingList === index) {
      setDisplayingList(index);
      //setShow(false);
    }
  };
  return (
    <>
      <Overlay show={true} target={target.current} placement="bottom">
        <Tooltip>Hover on faces to view more info about it.</Tooltip>
      </Overlay>
      <div ref={target}>
        {response.outputs[0].data.regions.map((region, index) => {
          const clarifaiFace = region.region_info.bounding_box;
          const leftCol = clarifaiFace.left_col * width;
          const topRow = clarifaiFace.top_row * height;
          const rightCol = width - clarifaiFace.right_col * width;
          const bottomRow = height - clarifaiFace.bottom_row * height;
          if (!region.data.concepts[0]) {
            return null;
          }
          return (
            <>
              <div style={{ height: 'auto' }}>
                <div
                  key={index}
                  className="bounding-box"
                  style={{
                    top: topRow,
                    right: rightCol,
                    left: leftCol,
                    bottom: bottomRow,
                  }}
                  onMouseEnter={() => {
                    setDisplayingList(index);
                    // setShow(false);
                  }}
                  onMouseLeave={() => setDisplayingList(-1)}
                ></div>
                {displayingList === index && (
                  <div
                    key={index}
                    className={
                      'CandidateList' +
                      (displayingList === index ? ' Show' : ' Hidden')
                    }
                    onMouseEnter={() => handleOnMouseEnter(index)}
                    onMouseLeave={() => setDisplayingList(-1)}
                  >
                    <CandidateList
                      index={index}
                      concepts={region.data.concepts}
                      topRow={topRow}
                      rightCol={clarifaiFace.right_col * width}
                      bottomRow={bottomRow}
                    />
                  </div>
                )}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default Celebrity;
