import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const LoadingSkeleton = () => {
    return (
        <Stack mt='5' p='5'>
            <Skeleton height="400px" mt='10' pt='5' />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />

        </Stack>
    )
}

export default LoadingSkeleton