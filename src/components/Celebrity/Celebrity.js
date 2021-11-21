import React,{ useState } from 'react'
import CandidateList from '../CandidateList/CandidateList';
import './Celebrity.css'
import { CSSTransition } from 'react-transition-group';

const Celebrity = ({ image,response }) => {
    const [displayingList,setDisplayingList] = useState(-1)
    if(!response.outputs || !image || !response.outputs[0].data.regions){
        return(
            <div></div>
        )
    }
    const width = Number(image.width);
    const height = Number(image.height);
    const handleOnMouseEnter = (index)=>{
        if(displayingList===index){
            setDisplayingList(index)
        }
    }
    return(
        response.outputs[0].data.regions.map((region,index)=>{
            const clarifaiFace  = region.region_info.bounding_box
            const leftCol = clarifaiFace.left_col * width;
            const topRow = clarifaiFace.top_row * height;
            const rightCol = width - (clarifaiFace.right_col*width);
            const bottomRow = height - (clarifaiFace.bottom_row*height);
            if(!region.data.concepts[0]){
                return null
            }
            const { name, value } = region.data.concepts[0];

            return(
                <div>
                    <div key={index} 
                        className='bounding-box' 
                        style={{top:topRow,right:rightCol,left:leftCol,bottom:bottomRow}} 
                        onMouseEnter={()=>setDisplayingList(index)}
                        onMouseLeave={()=>setDisplayingList(-1)}>
                            {/* <div className='bounding-box-concept'>
                                <div className='bouding-box_concept'>
                                    <span className='concept_name'>{name}</span>
                                    <span className='concept_prediction-val'>{value}</span>
                                </div>
                            </div> */}
                    </div>
                    <div key={index} className={'CandidateList'+(displayingList === index?" Show":" Hidden")} onMouseEnter={()=>handleOnMouseEnter(index)} onMouseLeave={()=>setDisplayingList(-1)} >
                        <CandidateList index={index} concepts={region.data.concepts} topRow={topRow} rightCol={clarifaiFace.right_col*width}/>
                    </div>                 
               </div>

            )
            
        })
    )
}

export default Celebrity