'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { FaGoogle, FaGithub } from 'react-icons/fa'; // Import icons

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', { 
      email, 
      password, 
      redirect: false 
    });

    if (!result.error) {
      router.push('https://ecommerce-nextjs-prisma-mui-nextauth.onrender.com/'); // Redirect to home or any page after credentials login
    } else {
      alert('Login failed. Check your credentials.');
    }
  };

  const handleSocialLogin = (provider) => {
    signIn(provider, { redirect: true, callbackUrl: '/' }); // Replace '/dashboard' with your desired route
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </Form.Group>
          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </Form.Group>
          <Button className="w-100 mt-4" type="submit" variant="primary">
            Login
          </Button>
        </Form>
        
        <div className="text-center mt-3">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <Button 
            className="w-48" 
            variant="danger" 
            onClick={() => handleSocialLogin('google')}
          >
            <FaGoogle className="mr-2" /> Login with Google
          </Button>
          <Button 
            className="w-48" 
            variant="dark" 
            onClick={() => handleSocialLogin('github')}
          >
            <FaGithub className="mr-2" /> Login with GitHub
          </Button>
        </div>
      </Card>
    </Container>
  );
}
