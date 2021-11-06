import React from 'react'
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange,onButtonSubmit,onPathChange}) => {
    return (
        <div>
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures. Git it a try'}
            </p>
            <div className='form dt center pa2'>
                <input className='f4 pa2 dt-row  w-80 center' onChange={onInputChange} type="text" />                
            <div className='dt-row center br w-60'>
                    <select name="" id="" className='select pa2 w-30 mt3 mr4 fa4' onChange={onPathChange}>
                        <option value="GENERAL_MODEL">General</option>
                        <option value="FACE_DETECT_MODEL">Face detect</option>
                    </select>
                    <button className='w-20 grow mt3 f4 link ph3 pv2 dib br2 white bg-light-purple pointer' onClick={onButtonSubmit}>Submit</button>
            </div>
            </div>

        </div>
    )
}

export default ImageLinkForm