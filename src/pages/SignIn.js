import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import SignInForm from '../components/SignInForm.js'
import {
    Container,
    Button,
    } from 'semantic-ui-react'

export default () => {
    return (
        <div>
          <Container textAlign='center'>
            <div class="sign-in-form">
              <h1>Welcome to TeamPlaygrounds!</h1>
              <p>Sign in or Register to unleash the fun.</p>
              <SignInForm />
            </div>
            <h3>You don't have an account yet?</h3>
            <Button type='submit'>Join Teamplaygrounds!</Button>
          </Container>
        </div>
    );
}
