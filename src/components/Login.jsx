import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

const sifreDogrulama = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const emailDogrulama = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setError] = useState({
    email: false,
    password: false,
    terms: false,
  })
  const [isValid, setIsValid] = useState(false)

  const history = useHistory();

  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    value = type == 'checkbox' ? checked : value;
    setForm({ ...form, [name]: value });

    if(type == "password"){
      if(!sifreDogrulama.test(value)){
        setError({...errors, password:true})
      }else{
        setError({...errors, password:false})
      }
      console.log("here")
    }

    if(type == "email"){
      if(!emailDogrulama.test(value)){
        setError({...errors, email:true})
      }else{
        setError({...errors, email:false})
      }
      console.log("here")
    }
    if(type == "checkbox"){
      const çek = form.terms
      console.log("here: ",çek)
    }
    setIsValid((errors.email && errors.password && errors.terms))

    console.log(errors.email )
    console.log( errors.password)
    console.log( errors.terms)
    console.log(errors.email && errors.password && errors.terms)
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.password == form.password && item.email == form.email
        );
        if (user) {
          setForm(initialForm);
          history.push('/main');
        } else {
          history.push('/error');
        }
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          value={form.email}
        />
      </FormGroup>
      {errors.email && <p>Lütfen geçerli bir email adresi giriniz</p>}
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password "
          type="password"
          onChange={handleChange}
          value={form.password}
        />
      </FormGroup>
      {errors.password && (
        <ul>
          <li>Has minimum 8 characters in length.</li>
          <li>At least one uppercase English letter.</li>
          <li>At least one lowercase English letter.</li>
          <li>At least one digit.</li>
          <li>At least one special character</li>
        </ul>)}
      <FormGroup check>
        <Input
          type="checkbox"
          name="terms"
          id="terms"
          checked={form.terms}
          onChange={handleChange}
        />{' '}
        <Label htmlFor="terms" check>
          I agree to terms of service and privacy policy{' '}
        </Label>
      </FormGroup>
      <FormGroup className="text-center p-4">
        <Button color="primary" disabled={!isValid}>
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
