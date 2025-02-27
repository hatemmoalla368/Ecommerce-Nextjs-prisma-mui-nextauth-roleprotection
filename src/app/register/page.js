'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Card } from 'react-bootstrap';

export default function Register() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    adresse: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      router.push('/login');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="firstname">
            <Form.Label>First Name</Form.Label>
            <Form.Control 
              type="text" 
              name="firstname" 
              placeholder="Enter your first name" 
              value={form.firstname} 
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group controlId="lastname" className="mt-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control 
              type="text" 
              name="lastname" 
              placeholder="Enter your last name" 
              value={form.lastname} 
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group controlId="email" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              value={form.email} 
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group controlId="text" className="mt-3">
            <Form.Label>Adresse</Form.Label>
            <Form.Control 
              type="text" 
              name="adresse" 
              placeholder="Enter your adresse" 
              value={form.adresse} 
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              name="password" 
              placeholder="Enter a strong password" 
              value={form.password} 
              onChange={handleChange}
              required 
            />
          </Form.Group>
          <Button className="w-100 mt-4" type="submit" variant="success">
            Register
          </Button>
        </Form>
        <div className="text-center mt-3">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </Card>
    </Container>
  );
}
