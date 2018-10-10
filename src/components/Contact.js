import React, { Component } from 'react';
import { Card, Container } from 'semantic-ui-react';
import KevImage from './7586429.jpeg';
import AasimImage from './20843493.jpeg';
import JakobImage from './15298645.jpeg';

class Contact extends Component {

render() {
    return (
      <Container style={{ marginTop: '7em' }}>
      <Card.Group>
            <Card
        image={KevImage}
        header='Kevin Lu'
        meta='Full Stack Developer'
        description='Kevin is a full-stack engineer living in the South Bay (Github: KevinLiLu).'
      />
           <Card
        image={AasimImage}
        header='Aasim Sayani'
        meta='Full Stack Developer'
        description='Aasim is a full-stack engineer living in Oakland (Github: aasimsayani).'
      />
           <Card
            image={JakobImage}
            header='Jakob Sandbergr'
            meta='Full Stack Developer'
            description='Jakob is a full-stack engineer living in Berkeley (Github: jakobsandberg).'
          />
          </Card.Group>
      </Container>
   )
  }
}

export default Contact
