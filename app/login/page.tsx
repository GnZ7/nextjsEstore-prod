import React from 'react'
import Container from '../components/Container'
import FormWrap from '../components/FormWrap'
import LoginForm from './LoginForm'
import { getCurrentUser } from '@/actions/getCurrentUser'

const Login = async () => {
  const currentuser = await getCurrentUser()
  return (
    <Container>
      <FormWrap>
        <LoginForm currentUser={currentuser}/>
      </FormWrap>
    </Container>
  )
}

export default Login
