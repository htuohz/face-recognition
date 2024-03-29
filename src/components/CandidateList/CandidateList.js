import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './CandidateList.css';
import { ProgressBar, Spinner } from 'react-bootstrap';

let imageCache = {};

const CandidateList = ({ concepts, topRow, rightCol, index, bottomRow }) => {
  const [images, setImages] = useState(imageCache);
  useEffect(() => {
    //if any of image does not exists in the cache, it will call the backend to get the url
    const conceptsHasNoImage = concepts.filter(
      (concept) => !imageCache[concept.name]
    );
    if (conceptsHasNoImage.length > 0) {
      // fetch(`https://arcane-inlet-73155.herokuapp.com/avatar`, {
      fetch(`http://127.0.0.1:3000/avatar`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concepts: conceptsHasNoImage,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          imageCache = { ...imageCache, ...data };
          setImages(imageCache);
        })
        .catch((err) => console.log(err));
    }
    return () => {};
  }, [concepts]);
  return (
    <Box
      className="candidateList"
      sx={
        topRow <= 200
          ? {
              top: topRow,
              bgcolor: 'background.paper',
              left: rightCol - 10,
              zIndex: index + 1,
            }
          : {
              bottom: bottomRow,
              bgcolor: 'background.paper',
              left: rightCol - 10,
              zIndex: index + 1,
            }
      }
    >
      <List component="nav" aria-label="main mailbox folders">
        {concepts.map((concept, index) => {
          const { name, value } = concept;
          return (
            <ListItemButton key={index + name}>
              <ListItemText
                sx={{ width: '60%', maxWidth: 120 }}
                primary={name}
              />

              <div className="imgWrapper">
                {images[name] ? (
                  <img src={imageCache[name]} alt={imageCache[name]} />
                ) : (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
              </div>
              <span>
                <ProgressBar
                  now={Math.round(value * 100)}
                  label={`${Math.round(value * 1000) / 10}%`}
                />
              </span>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default CandidateList;
