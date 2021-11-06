import React from 'react'

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
            {concepts.map(concept=>(<div>{concept.name+concept.value}</div>))}
        </div>
    )
}

export default General