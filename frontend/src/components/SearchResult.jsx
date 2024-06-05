import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'
import VideoPreview from './VideoPreview';
import LoadingBar from 'react-top-loading-bar'
import LoadingSkeleton from './LoadingSkeleton';
import imgSrc from '../image/notfoundimage.jpg'
import { useNavigate } from 'react-router-dom';

const SearchResult = () => {
    const ref = useRef(null)

    const { homePageLoading, resultSet } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (homePageLoading) {
            ref.current && ref.current.continuousStart();
        } else {
            ref.current && ref.current.complete();
        }
    }, [homePageLoading]);

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

    return (
        <>
            <LoadingBar color='#3b71ca' ref={ref} />
            {homePageLoading && <LoadingSkeleton />}
            {!homePageLoading &&
                <Box px='5' py='1' style={{ marginTop: "60px" }}>
                    {resultSet && resultSet.length > 0 && (
                        <Box className="search-results">
                            {resultSet.map((item, index) => (
                                <VideoPreview key={index} item={item} />
                            ))}
                        </Box>
                    )}
                    {
                        (resultSet && resultSet.length === 0) &&
                        <Box display='flex' justifyContent='center' alignItems='center' height='80vh'>
                            <div className='d-flex justify-content-center flex-column align-items-center' >
                                <img src={imgSrc} alt='Not_found_mage' />
                                <Text className='mt-3'>This page isn't available. Sorry about that</Text>
                                <Text>Try searching for something else.</Text>
                            </div>
                        </Box>
                    }
                    {
                        (!homePageLoading && !resultSet) &&
                        <Box display='flex' justifyContent='center' alignItems='center' height='80vh'>
                            <div className='d-flex justify-content-center flex-column align-items-center' >
                                <img src={imgSrc} alt='Not_found_mage' />
                                <Text className='mt-3'>This page isn't available. Sorry about that</Text>
                                <Text>Try searching for something else.</Text>
                            </div>
                        </Box>
                    }
                </Box>
            }
        </>
    )
}

export default SearchResult

