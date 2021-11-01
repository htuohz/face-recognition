import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import { Component } from 'react';
import Clarifai from 'clarifai'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

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

const app = new Clarifai.App({
  apiKey:'0caefdb50fbd4d62b06a846854cce842'
})

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:''
    }
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value})
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl:this.state.input})
    console.log('click')
    app.models.predict(Clarifai.FACE_DETECT_MODEL, 
    this.state.input)
    .then(
      function(res) {
        console.log(res)
      },
      function(err) {
        console.log(err);
      })
  }

  render(){
    return ( 
      <div className="App">
        <Particles params={particleOptions} className='particles'/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }

}

export default App;
