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

const Signup = () => {
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [profilePicture, setProfilePicture] = useState(null); // Add state for profile picture

    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const createUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('firstname', firstname);
            formData.append('lastname', lastname);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('file', profilePicture);

            const response = await fetch("https://filmfolio.onrender.com/api/user/register", {
                method: "POST",
                body: formData
            });


            const data = await response.json();

            if (response.status === 201) {
                toast({
                    description: data.message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
                setTimeout(() => {
                    navigate('/app');
                }, 2000);
                return
            } else if (response.status === 500) {
                toast({
                    title: data.errorCode,
                    description: data.errorMessage,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
                return
            } else if (response.status === 403) {
                toast({
                    description: data.error,
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
                return
            } else if (response.status === 400) {
                toast({
                    title: data.errorCode,
                    description: data.errorMessage,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
                return
            } else {
                toast({
                    title: data.errorCode || data.message,
                    description: data.errorMessage,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
                return
            }
        } catch (error) {
            toast({
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
                <form className="custom-box-shadow p-4 m-4" onSubmit={createUser}>
                    <div className="mb-5">
                        <h2 className="text-center fw-bold">REGISTRATION</h2>
                    </div>

                    <div className="row mb-4">
                        <div className="col">
                            <FormControl variant="floating" isRequired>
                                <Input
                                    placeholder=" "
                                    type='text'
                                    value={firstname}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <FormLabel style={{ fontWeight: "400" }} className='text-primary'>First Name</FormLabel>
                            </FormControl>
                        </div>
                        <div className="col">
                            <FormControl variant="floating" isRequired>
                                <Input
                                    placeholder=" "
                                    type='text'
                                    value={lastname}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <FormLabel style={{ fontWeight: "400" }} className='text-primary'>Last Name</FormLabel>
                            </FormControl>
                        </div>
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

                    <div className="row mb-4" style={{ marginLeft: "1px" }}>
                        <label htmlFor="profilePicture" className="col-auto col-form-label">Profile Picture</label>
                        <div className="col">
                            <input
                                type="file"
                                className="form-control text-primary"
                                id="profilePicture"
                                name="profilePicture"
                                accept="image/*"
                                onChange={(e) => setProfilePicture(e.target.files[0])} // Update profile picture state
                            />
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
                        SIGN UP
                    </Button>
                </form>
            </div>
        </main>
    )
}

export default Signup;