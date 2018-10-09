import React, { Component } from 'react';
import './App.css';
import FormsPage from './Form';
import { Container, Message } from 'semantic-ui-react';
import {
  Route,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Research from './Research';
import Contact from './Contact';
import Nav from './Nav';

class App extends Component {
  state = {
    error: '',
  };

  componentDidMount() {
    this.setState({
      error: '',
    });
  }

  render() {
    return (
      <Container>
        <Router>
            <div>
              <Nav />
              <Switch>
                <Route path='/form' render={(props) => <FormsPage {...props} isAuthed={true} disabled={!!this.state.error}/>}/>
                <Route path="/dashboard" render={(props) => <Dashboard {...props} isAuthed={true}/>}/>
                <Route exactly component={Research} path="/research" />
                <Route exactly component={Contact} path="/contact" />
              </Switch>
            </div>
        </Router>

        <Container text style={{ marginTop: '7em' }}>
          <Message negative visible={!!this.state.error} hidden={!this.state.error}>
            <Message.Header>{this.state.error}</Message.Header>
          </Message>
        </Container>
      </Container>
    );
  }
}

export default App;
