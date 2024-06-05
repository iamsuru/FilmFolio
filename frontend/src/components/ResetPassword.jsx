import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast
} from '@chakra-ui/react';
import { BeatLoader } from 'react-spinners';

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();


    const resetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("http://filmpholio.netlify.app/api/user/reset-password", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim().toLowerCase() })
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
                setTimeout(() => {
                    navigate('/');
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
                    description: data.message,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
            } else if (response.status === 500) {
                toast({
                    description: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
            } else {
                toast({
                    description: data.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
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
                <form className="custom-box-shadow p-4 m-4" style={{ width: "350px" }} onSubmit={resetPassword}>
                    <div className="mb-4">
                        <h3 className="text-center fw-bold">RESET PASSWORD</h3>
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

                    <Button
                        isLoading={loading}
                        spinner={<BeatLoader size={8} color='white' />}
                        className='bg-primary mb-4'
                        width='100%'
                        type='submit'
                        color='white'
                    >
                        Send  Password Reset Link
                    </Button>
                </form>
            </div>
        </main>
    );
};

export default ResetPassword;