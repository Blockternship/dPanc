import React, { Component } from 'react'
import { Container, Image, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import logo from './logo.png';
// import { observer, inject } from 'mobx-react'


class Nav extends Component {
  render() {
    return (
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header>
            <Image
              size='mini'
              src={logo}
              style={{ marginRight: '1.5em' }}
            />
            dPanc
          </Menu.Item>

          <Menu.Item as={Link}  to="/form" content="Home"/>
          <Menu.Item as={Link} to="/research" content="Research"/>
          <Menu.Item as={Link} to="/contact" content="Contact us"/>
          <Menu.Item as={Link} to="/dashboard" content="Dashboard"/>


        </Container>
      </Menu>
    )
  }
}

export default Nav
