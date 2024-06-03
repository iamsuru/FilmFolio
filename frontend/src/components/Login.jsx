import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast
} from '@chakra-ui/react';
import { BeatLoader } from 'react-spinners';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const isTokenExpired = async (token) => {
            try {
                const response = await fetch('https://filmfolio.onrender.com/api/user/isTokenExpired', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (response.status === 200) {
                    navigate('/homepage')
                }
                else if (response.status === 410) {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('currentUserToken');
                    navigate('/');
                } else if (response.status === 500) {
                    console.log('Internal server error');
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        const token = JSON.parse(localStorage.getItem('currentUserToken'));
        if (token) {
            isTokenExpired(token);
        } else {
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const authenticate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("https://filmfolio.onrender.com/api/user/auth", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim().toLowerCase(), password })
            });


            const data = await response.json();

            if (response.status === 200) {
                toast({
                    description: data.message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });

                localStorage.setItem('currentUser', JSON.stringify(data.user));
                localStorage.setItem('currentUserToken', JSON.stringify(data.token))
                setTimeout(() => {
                    navigate('/homepage');
                }, 2000);
            } else if (response.status === 404) {
                toast({
                    description: data.message,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
            } else if (response.status === 401) {
                toast({
                    description: data.error,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
            } else if (response.status === 500) {
                toast({
                    description: data.error,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
            } else {

            }
        } catch (error) {
            toast({
                title: error,
                description: error.message || 'An unexpected error occurred',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: "top"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <form className="custom-box-shadow p-4 m-4" style={{ width: "350px" }} onSubmit={authenticate}>
                    <div className="mb-5">
                        <h2 className="text-center fw-bold">LOGIN</h2>
                    </div>

                    <div className='mb-4'>
                        <FormControl variant="floating" isRequired>
                            <Input
                                placeholder=" "
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FormLabel style={{ fontWeight: "400" }} className='text-primary'>Email Address</FormLabel>
                        </FormControl>
                    </div>

                    <div className='mb-4'>
                        <FormControl variant="floating" isRequired>
                            <Input
                                placeholder=" "
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FormLabel style={{ fontWeight: "400" }} className='text-primary'>Password</FormLabel>
                        </FormControl>
                    </div>

                    <div className="mb-4">
                        <div className="text-end">
                            {/* <Link className='text-primary' style={{ whiteSpace: "nowrap", fontWeight: "600" }} to='#'>Forgot password?</Link> */}
                        </div>
                    </div>

                    <Button
                        isLoading={loading}
                        spinner={<BeatLoader size={8} color='white' />}
                        className='bg-primary mb-4'
                        width='100%'
                        type='submit'
                        color='white'
                    >
                        Sign in
                    </Button>

                    <div className="text-center">
                        <p>Not a member? <Link className='text-primary' style={{ fontWeight: "600" }} to="/signup">Register</Link></p>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;