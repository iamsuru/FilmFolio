import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const LoadingSkeleton = () => {
    return (
        <Stack mt='5' p='5'>
            <Skeleton height="500px" mt='10' pt='5' />
            <Skeleton height="500px" />
            <Skeleton height="500px" />
            <Skeleton height="500px" />
            <Skeleton height="500px" />
            <Skeleton height="500px" />
            <Skeleton height="500px" />
            <Skeleton height="500px" />
            <Skeleton height="500px" />
            <Skeleton height="500px" />
            <Skeleton height="500px" />

        </Stack>
    )
}

export default LoadingSkeleton