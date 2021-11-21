import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import { Component } from 'react';
import Clarifai from 'clarifai'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import General from './components/General/General';
import Celebrity from './components/Celebrity/Celebrity';
import { ClarifaiModels } from './ClarifaiModels';

const particleOptions = {
  particles: {
    number:{
      value:100,
      density:{
        enable:true,
        value_are:800
      }
    }
  }
}



const initialState = {
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn:false,
  path:'GENERAL_MODEL',
  response:{},
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined:''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user:{
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined:data.joined
    }})
}

  calculateFaceLocation = (data) => {
    const clarifaiFace  = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box:box})
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value})
  }

  onRouteChange = (route) => {
    if(route==='signout'){
      this.setState(initialState)
    }else if (route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl:this.state.input})
    console.log('click')
    fetch('https://arcane-inlet-73155.herokuapp.com/imageurl',{
      method:'post',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        input:this.state.input,
        path:this.state.path
      })
    })
    .then(response=>response.json())
    .then(response =>{
      if(response){
        this.setState({response})
        fetch('https://arcane-inlet-73155.herokuapp.com/image',{
          method:'put',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            id:this.state.user.id
          })
        })
        .then(response=>response.json())
        .then(count=>{
          this.setState({user:{
            ...this.state.user,
            entries:count
          }})
        })
        .catch(console.log)
      }
    })
    .catch(err=>console.log(err))
    console.log(this.state.response)
  }

  onPathChange = (event) =>{
    this.setState({path:event.target.value,response:{}})
  }

  render(){
    const { isSignedIn, imageUrl, route, box, path, response} = this.state
    const image = document.getElementById('inputimage');
    return ( 
      <div className="App">
        <Particles params={particleOptions} className='particles'/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {/* {route==='home'
        ? */}
        <div> <Logo />
        {/* <Rank name={this.state.user.name} entries={this.state.user.entries}/> */}
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} onPathChange={this.onPathChange} />
        <div className='center'>
          <div className='absolute mt2'>
            <img id='inputimage' alt='' src={imageUrl} alt="" width='auto' height='500px' />
            {path === ClarifaiModels.FACE_DETECT_MODEL && <FaceRecognition image={image} response={response} />}
            {path === ClarifaiModels.GENERAL_MODEL && <General response={response}/>}
            {path === ClarifaiModels.CELEBRITY_MODEL && <Celebrity response={response} image={image}/>}
          </div>
        </div>
        </div>        
        {/* :(
        route==='signin'
        ?<Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        :<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>)
    } */}
      </div>
    );
  }

}

export default App;
