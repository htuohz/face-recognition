import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import './CandidateList.css'
import { ThemeProvider } from 'styled-components';
import NoSsr from '@mui/material/NoSsr';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { ProgressBar } from 'react-bootstrap';


const CandidateList = ({ concepts,topRow,rightCol,index }) => {
    return(
            <Box className='candidateList' sx={{ bgcolor: 'background.paper',top:topRow,left:rightCol-10,zIndex:index+1 }}>
            <List component="nav" aria-label="main mailbox folders">
                {concepts.map((concept,index)=>{
                    const { name, value } = concept;
                    return(
                        <ListItemButton key={index}
                        >
                        {/* <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon> */}
                        <ListItemText sx={{ width: '60%', maxWidth: 200}} primary={name} />
                        <span>
                          <ProgressBar now={Math.round(concept.value*100)} label={`${Math.round(concept.value*1000)/10}%`} />
                        </span>
                        </ListItemButton>
                    )
                })}

            </List>
        </Box>
    )
}

export default CandidateList