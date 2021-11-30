import React, { useEffect, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './General.css';

const General = ({ response, isLoading, showModal, setShowModal }) => {
  const [modalVisibility, setModalVisibility] = useState(showModal);
  useEffect(() => {
    setModalVisibility(showModal);
    return () => {};
  }, [showModal]);
  return (
    <Modal
      show={modalVisibility}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => {
        setModalVisibility(false);
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>
        <h4>General model report</h4>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="spinnerWrapper">
            <Spinner animation="border" role="status" />
            <span>Loading report...</span>
          </div>
        ) : (
          <div className="mt2">
            {/* <img id='inputimage' alt='' src={imageUrl} alt="" width='500px' height='auto' /> */}
            {response.outputs &&
              response.outputs[0].data &&
              response.outputs[0].data.concepts.map((concept) => (
                <div className="center w-100 pa2">
                  <div className="w-30 tl ttc">{concept.name}</div>
                  <div className="w-30 generalProgress">
                    <ProgressBar
                      now={Math.round(concept.value * 100)}
                      label={`${Math.round(concept.value * 1000) / 10}%`}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default General;
