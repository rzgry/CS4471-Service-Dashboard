import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Button, Form, Grid, Header, Message, Segment,
} from 'semantic-ui-react';
import { userStore } from '../stores';

@observer
class LoginPage extends Component {
  state = { email: '', password: '' };

  login = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (email === '') {
      this.setState({ error: 'Please enter a email address' });
      return;
    }
    if (password === '') {
      this.setState({ error: 'Please enter a password' });
      return;
    }
    this.setState({ error: '' });
    userStore.login(email, password);
  };

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { error, email, password } = this.state;

    if (userStore.isAuthenticated) return <Redirect to={from} />;

    return (
      <div className="login-form">
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Log in
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Email"
                  value={email}
                  onChange={e => this.setState({ email: e.target.value.trim() })}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => this.setState({ password: e.target.value.trim() })}
                />
                {error && <Message negative>{error}</Message>}
                {userStore.error && <Message negative>{userStore.error}</Message>}
                <Button color="teal" fluid size="large" onClick={this.login}>
                  Log in
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us?
              {' '}
              <Link to="/signup">Sign Up</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default LoginPage;
