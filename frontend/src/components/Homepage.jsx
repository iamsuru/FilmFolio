import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Text, useToast } from '@chakra-ui/react';
import LoadingBar from 'react-top-loading-bar'
import PlayListModal from './PlayListModal';
import { AddIcon } from '@chakra-ui/icons'

const HomePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    const [screenResult, setScreenResult] = useState()

    const toast = useToast()
    const ref = useRef(null)

    useEffect(() => {
        if (loading) {
            ref.current && ref.current.continuousStart();
        } else {
            ref.current && ref.current.complete();
        }
    }, [loading]);

    useEffect(() => {
        const isTokenExpired = async (token) => {
            try {
                const response = await fetch('https://filmfolio-backend.onrender.com/api/user/isTokenExpired', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (response.status === 410) {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('currentUserToken');
                    navigate('/');
                } else if (response.status === 500) {
                    console.log('Internal server error');
                }
            } catch (error) {
                console.log(error);
            }
        };

        const token = JSON.parse(localStorage.getItem('currentUserToken'));
        if (token) {
            isTokenExpired(token);
        } else {
            navigate('/');
        }
    }, [navigate]);


    useEffect(() => {
        const discoverMovie = async () => {
            setLoading(true)
            try {
                const response = await fetch('https://filmfolio-backend.onrender.com/api/movie/discover')

                const data = await response.json()

                if (response.ok) {
                    setScreenResult(data.result)
                } else {
                    if (data.error === "fetch faild") {
                        discoverMovie()
                    }
                }
            } catch (error) {
                toast({
                    title: error.message,
                    status: "error",
                    duration: 3000,
                    isCloseable: true,
                    position: 'top-right'
                });
            }
            finally {
                setLoading(false)
            }
        }
        discoverMovie()
    }, [navigate])

    return (
        <>
            <div className='mt-5 p-4'>
                <LoadingBar color='#3b71ca' ref={ref} />
                <div className='row'>
                    {screenResult && screenResult.length > 1 && (
                        screenResult.map((item, index) => (
                            <HomePageContent key={index} item={item} />
                        ))
                    )}
                </div>
            </div>
        </>

    );
};


const HomePageContent = ({ item }) => {
    return (
        <div className='col-sm-3 mb-5'>
            <div className="card" style={{ width: "100%" }}>
                <img className="card-img-top" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt="Poster" />
                <div className="card-body">
                    <Text fontSize='lg' fontWeight='bold'>{item.title}</Text>
                    <Text fontSize='md'><strong>Release Date:</strong> {item.release_date}</Text>
                    <Text fontSize='sm'><strong>Rating:</strong> {item.vote_average}</Text>
                    <Text fontSize='sm'><strong>Language:</strong> {item.original_language}</Text>
                    <PlayListModal item={item}>
                        <Button size={{ base: "xs", md: "sm" }} leftIcon={<AddIcon />} className='bg-primary' color='white'>Add to Playlist</Button>
                    </PlayListModal>
                </div>
            </div>
        </div>
    )
}

export default HomePage;
