import React, { useState, useRef } from 'react';
import CandidateList from '../CandidateList/CandidateList';
import './Celebrity.css';
import { CSSTransition } from 'react-transition-group';
import { Tooltip, Overlay } from 'react-bootstrap';

const Celebrity = ({ image, response }) => {
  const [displayingList, setDisplayingList] = useState(-1);
  const [show, setShow] = useState(true);

  const target = useRef(null);
  if (!response.outputs || !image || !response.outputs[0].data.regions) {
    return <div></div>;
  }
  const width = Number(image.width);
  const height = Number(image.height);
  const handleOnMouseEnter = (index) => {
    if (displayingList === index) {
      setDisplayingList(index);
      setShow(false);
    }
  };
  return response.outputs[0].data.regions.map((region, index) => {
    const clarifaiFace = region.region_info.bounding_box;
    const leftCol = clarifaiFace.left_col * width;
    const topRow = clarifaiFace.top_row * height;
    const rightCol = width - clarifaiFace.right_col * width;
    const bottomRow = height - clarifaiFace.bottom_row * height;
    if (!region.data.concepts[0]) {
      return null;
    }
    const { name, value } = region.data.concepts[0];

    return (
      <div style={{ height: 'auto' }}>
        <Overlay show={show} target={target.current} placement="right">
          <Tooltip>Hover on faces to view more info about it.</Tooltip>
        </Overlay>
        <div
          ref={target}
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
            setShow(false);
          }}
          onMouseLeave={() => setDisplayingList(-1)}
        >
          {/* <div className='bounding-box-concept'>
                                <div className='bouding-box_concept'>
                                    <span className='concept_name'>{name}</span>
                                    <span className='concept_prediction-val'>{value}</span>
                                </div>
                            </div> */}
        </div>
        {displayingList === index && (
          <div
            key={index}
            className={
              'CandidateList' + (displayingList === index ? ' Show' : ' Hidden')
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
    );
  });
};

export default Celebrity;
