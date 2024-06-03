import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import PlayListVideoPreview from './PlayListVideoPreview';
import { Button, Tooltip, useBreakpointValue, useToast } from '@chakra-ui/react';
import { LinkIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const PlaylistShower = () => {
    const { user } = useUser();

    const [privacy, setPrivacy] = useState(false)
    //true means private false means public

    const [playlistName, setPlaylistName] = useState('');
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    const ref = useRef(null)
    const toast = useToast();
    const location = useLocation()
    const showText = useBreakpointValue({ base: false, md: true });

    useEffect(() => {
        if (loading) {
            ref.current && ref.current.continuousStart();
        } else {
            ref.current && ref.current.complete();
        }
    }, [loading]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setPlaylistName(query.get('playlist-name'));
    }, [location.search]);


    useEffect(() => {
        const getPrivacy = async () => {
            try {
                const response = await fetch(`https://filmfolio-backend.onrender.com/api/playlist/privacy?ref=${user.uid}&name=${playlistName}`)
                const data = await response.json();
                if (response.ok) {
                    setPrivacy(data.privacy)
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }

        const getPlaylist = async () => {
            try {
                const response = await fetch(`https://filmfolio-backend.onrender.com/api/shared/my-playlist?ref=${user.uid}&name=${playlistName}`);
                const data = await response.json();
                if (response.ok) {
                    setPlaylist(data.playlists);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (playlistName) {
            getPrivacy()
            getPlaylist();
        }
    }, [playlistName]);


    const createShareLink = () => {
        let url = `${window.location.origin}/shared-playlist?ref=${user.uid}&name=${playlistName}`

        navigator.clipboard.writeText(url)
            .then(() => {
                toast({
                    description: 'URL copied to clipboard!',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                })
            })
            .catch(err => {
                toast({
                    title: 'Failed to copy. Try Again!',
                    description: err,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                })
            });
    }


    const setPrivacyHandler = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://filmfolio-backend.onrender.com/api/playlist/privacy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: user.uid, playlistName, privacy: !privacy })
            })

            const data = await response.json();
            if (response.ok) {
                toast({
                    title: data.message,
                    description: data.desc,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                })
                setPrivacy(!privacy)
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <LoadingBar color='#3b71ca' ref={ref} />
            <div className='d-flex justify-content-between p-5 mt-5'>
                <span className='text-center text-primary h1 fw-bolder'>
                    <i className="fa-solid fa-list-check"></i>
                    &nbsp;{playlistName.toUpperCase()}
                </span>
                <div className='d-flex'>

                    <Tooltip label='Click to share' placement='bottom'>
                        {/* <Spinner size='sm' thickness='4px' speed='0.3s' className='text-primary' /> */}

                        <Button _hover={{ backgroundColor: "#3b71ca", color: "white" }} size={{ base: "md", md: 'sm' }} rightIcon={<LinkIcon />} m={1} onClick={createShareLink}>{showText && 'Share'}</Button>

                    </Tooltip>

                    {privacy ? (
                        <Tooltip label='Change to visible public' placement='bottom'>
                            <Button
                                _hover={{ backgroundColor: "#3b71ca", color: "white" }}
                                size={{ base: "md", md: 'sm' }}
                                rightIcon={<ViewOffIcon />}
                                m={1}
                                onClick={setPrivacyHandler}
                            >
                                {showText && 'Private'}
                            </Button>
                        </Tooltip>
                    ) : (
                        <Tooltip label='Change to visible private' placement='bottom'>
                            <Button
                                _hover={{ backgroundColor: "#3b71ca", color: "white" }}
                                size={{ base: "md", md: 'sm' }}
                                rightIcon={<ViewIcon />}
                                m={1} onClick={setPrivacyHandler}>
                                {showText && 'Public'}
                            </Button>
                        </Tooltip>
                    )}
                </div>
            </div >
            <div className='ps-5 pe-5'>
                {
                    playlist && playlist[0]?.files.map((item) => (
                        <PlayListVideoPreview key={item.id} item={item} />
                    ))
                }
            </div>
        </>
    );
};

export default PlaylistShower;