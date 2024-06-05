import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'
import VideoPreview from './VideoPreview';
import LoadingBar from 'react-top-loading-bar'
import LoadingSkeleton from './LoadingSkeleton';
import imgSrc from '../image/notfoundimage.jpg'

const SearchResult = () => {
    const ref = useRef(null)

    const { homePageLoading, resultSet } = useUser()

    useEffect(() => {
        if (homePageLoading) {
            ref.current && ref.current.continuousStart();
        } else {
            ref.current && ref.current.complete();
        }
    }, [homePageLoading]);

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

