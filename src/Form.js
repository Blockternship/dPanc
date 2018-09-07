import React from 'react';
import { Container, Row, Col, Input, Button, Fa, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

class FormsPage extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return(
      <Container>
        <Row>
          <Col md="6">
            <Button color="info" onClick={this.toggle}>Launch dPanc's Smart Contract</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className="cascading-modal">
              <div className="modal-header primary-color white-text">
                <h4 className="title">
                  <Fa className="fa fa-pencil" /> Contact form</h4>
                <button type="button" className="close" onClick={this.toggle}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <ModalBody className="grey-text">
                <Input size="sm" label="Your Ethereum Address" icon="user" group type="text" validate error="wrong" success="right"/>
                <Input size="sm" label="Device" icon="envelope" group type="email" validate error="wrong" success="right"/>
                <Input size="sm" label="Upload Your CSV" icon="upload" group type="file" validate error="wrong" success="right"/>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggle}>Close</Button>{' '}
                <Button color="primary">Save changes</Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default FormsPage;
