import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './CandidateList.css';
import { ProgressBar, Spinner } from 'react-bootstrap';

let imageCache = {};

// const { ImageSearchClient } = require('@azure/cognitiveservices-imagesearch');
// const CognitiveServicesCredentials =
//   require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;

// let serviceKey = 'cb3db18f3a7544cfbfc3e1f419d44787';
// let credentials = new CognitiveServicesCredentials(serviceKey);
// let imageSearchApiClient = new ImageSearchClient(credentials, {
//   endpoint: 'https://celebritysearchnew.cognitiveservices.azure.com/',
// });
// const sendQuery = async (searchTerm) => {
//   return await imageSearchApiClient.images.search(searchTerm);
// };

const CandidateList = ({ concepts, topRow, rightCol, index, bottomRow }) => {
  const [images, setImages] = useState(imageCache);
  useEffect(() => {
    //if any of image does not exists in the cache, it will call the backend to get the url
    const conceptsHasNoImage = concepts.filter(
      (concept) => !imageCache[concept.name]
    );
    if (conceptsHasNoImage.length > 0) {
      fetch(`https://arcane-inlet-73155.herokuapp.com/avatar`, {
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
    // sendQuery('zhang ziyi')
    //   .then((imageResults) => {
    //     if (imageResults == null) {
    //       console.log('No image results were found.');
    //     } else {
    //       const firstImageResult = imageResults.value[0];
    //       console.log(firstImageResult.thumbnailUrl);
    //     }
    //   })
    //   .catch((err) => console.error(err));
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
