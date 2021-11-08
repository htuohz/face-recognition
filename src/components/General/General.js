import React from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar'
import './General.css'

const General = ({response}) => {
    if(!response.outputs){
        return(
            <div></div>
        )
    }
    const { concepts } = response.outputs[0].data
    return (
        <div className='mt2'>
            {/* <img id='inputimage' alt='' src={imageUrl} alt="" width='500px' height='auto' /> */}
            {concepts.map(concept=>(
                <div className="center w-100 pa2">
                    <div className="w-30 tl ttc">{concept.name}</div>
                    <div className="w-30 generalProgress"><ProgressBar now={Math.round(concept.value*100)} label={`${Math.round(concept.value*1000)/10}%`} /></div>

                </div>
            ))}
        </div>
    )
}

export default General