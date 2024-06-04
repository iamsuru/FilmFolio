import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const LoadingSkeleton = () => {
    return (
        <Stack mt='5' p='5'>
            <Skeleton height="300px" mt='10' pt='5' />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />

        </Stack>
    )
}

export default LoadingSkeleton