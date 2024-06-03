import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PlayListVideoPreview from '../PlayListVideoPreview';
import { LockIcon } from '@chakra-ui/icons';
import LoadingBar from 'react-top-loading-bar';

const SharedPlaylist = () => {
    const [playlistName, setPlaylistName] = useState('');
    const [ref, setRef] = useState('');
    const [loading, setLoading] = useState(true);
    const [sharedPlaylist, setSharedPlaylist] = useState(null);
    const [visibility, setVisibility] = useState(true);
    const location = useLocation();

    const loadRef = useRef(null)

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setPlaylistName(query.get('name'));
        setRef(query.get('ref'));
    }, [location.search]);

    useEffect(() => {
        const getSharedPlaylist = async () => {
            try {
                const response = await fetch(`https://filmfolio-backend.onrender.com/api/shared/search-playlist?ref=${ref}&name=${playlistName}`);
                const data = await response.json();

                if (response.status === 403) {
                    setVisibility(data.message)
                }
                else if (response.ok) {
                    setSharedPlaylist(data.playlists);
                } else {
                    console.log(data);
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (ref && playlistName && visibility) {
            getSharedPlaylist();
        }
    }, [ref, playlistName, visibility]);

    useEffect(() => {
        if (loading) {
            loadRef.current && loadRef.current.continuousStart();
        } else {
            loadRef.current && loadRef.current.complete();
        }
    }, [loading]);

    return (
        <>
            <LoadingBar color='#3b71ca' ref={loadRef} />

            <div className=' mt-5 p-4'>
                {(visibility && sharedPlaylist) &&
                    <>
                        <span className='h1 d-flex justify-content-center fw-bold'>Playlist&nbsp;:&nbsp;<span className='h1 fw-bolder text-primary'>{playlistName.toUpperCase()}</span></span>
                        {
                            sharedPlaylist && sharedPlaylist[0]?.files.map((item) => (
                                <PlayListVideoPreview key={item.id} item={item} />
                            ))
                        }
                    </>
                }
                {!visibility &&
                    <div style={centered}>
                        <LockIcon boxSize={10} />
                        <h1 className='mt-3'>This playlist is set to private.</h1>
                    </div>
                }
            </div>
        </>
    );
};

const centered = {
    position: 'fixed',
    top: "50%",
    left: "50%",
    transform: 'translate(-50%, -50%)',
    display: 'inline-block',
    textAlign: "center"
}

export default SharedPlaylist;
