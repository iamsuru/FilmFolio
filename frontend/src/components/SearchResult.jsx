import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'
import VideoPreview from './VideoPreview';
import LoadingBar from 'react-top-loading-bar'

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
            <Box px='5' py='1' style={{ marginTop: "60px" }}>
                <LoadingBar color='#3b71ca' ref={ref} />
                {resultSet && resultSet.length > 0 && (
                    <Box className="search-results">
                        {resultSet.map((item, index) => (
                            <VideoPreview key={index} item={item} />
                        ))}
                    </Box>
                )}
            </Box>
        </>
    )
}

export default SearchResult

