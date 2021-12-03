import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import { Component } from 'react';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import General from './components/General/General';
import Celebrity from './components/Celebrity/Celebrity';
import { ClarifaiModels } from './ClarifaiModels';
import { Modal, Spinner } from 'react-bootstrap';

const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_are: 800,
      },
    },
  },
};

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  path: 'GENERAL_MODEL',
  response: {},
  isLoading: false,
  isSubmitted: false,
  showModal: false,
  previousPath: '',
  previousUrl: '',
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  setSubmitted = (status) => {
    this.setState({
      isSubmitted: status,
    });
  };

  setShowModal = (status) => {
    this.setState({
      showModal: status,
    });
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  onButtonSubmit = () => {
    if (!this.state.input) {
      return;
    }
    if (this.state.path === ClarifaiModels.GENERAL_MODEL) {
      this.setState({
        showModal: true,
      });
    }
    if (
      this.state.path === this.state.previousPath &&
      this.state.input === this.state.previousUrl &&
      Object.keys(this.state.response)
    ) {
      return;
    }
    this.setState({
      imageUrl: this.state.input,
      isLoading: true,
      isSubmitted: true,
      response: {},
    });

    fetch('https://arcane-inlet-73155.herokuapp.com/imageurl', {
      // fetch('http://127.0.0.1:3000/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input,
        path: this.state.path,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          this.setState({ response, isLoading: false });
          fetch('https://arcane-inlet-73155.herokuapp.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState({
                user: {
                  ...this.state.user,
                  entries: count,
                },
              });
            })
            .catch(console.log);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
    this.setState({
      previousPath: this.state.path,
      previousUrl: this.state.input,
    });
  };

  onPathChange = (event) => {
    this.setState({ path: event.target.value });
  };

  render() {
    const {
      isSignedIn,
      imageUrl,
      route,
      box,
      path,
      response,
      isLoading,
      showModal,
    } = this.state;
    const image = document.getElementById('inputimage');
    return (
      <div className="App">
        <Particles params={particleOptions} className="particles" />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {/* {route==='home'
        ? */}
        <div>
          {' '}
          <Logo />
          {/* <Rank name={this.state.user.name} entries={this.state.user.entries}/> */}
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
            onPathChange={this.onPathChange}
          />
          <div className="center">
            <div className="absolute mt2">
              <img
                id="inputimage"
                alt=""
                src={imageUrl}
                alt=""
                width="auto"
                height="500px"
              />
              {path === ClarifaiModels.FACE_DETECT_MODEL && (
                <FaceRecognition
                  image={image}
                  response={response}
                  isLoading={isLoading}
                />
              )}
              {path === ClarifaiModels.GENERAL_MODEL && showModal && (
                <General
                  response={response}
                  isLoading={isLoading}
                  showModal={showModal}
                  setShowModal={this.setShowModal}
                />
              )}
              {path === ClarifaiModels.CELEBRITY_MODEL && (
                <Celebrity
                  response={response}
                  image={image}
                  isLoading={isLoading}
                />
              )}
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
