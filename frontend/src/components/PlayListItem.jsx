import React from 'react';
import { NewsHeaderCard } from 'react-ui-cards';

const PlayListItem = ({ playlist, handleFunction }) => {
    const posterPath = playlist.files.files[0].poster_path;
    return (
        <>
            <div style={{ cursor: "pointer" }} onClick={handleFunction}>
                <NewsHeaderCard
                    thumbnail={posterPath ? `https://image.tmdb.org/t/p/w200${posterPath}` : ''}
                    author={`Playlist - ${playlist.name}`}
                    className='ms-auto mt-0 mb-3'
                    date={`Size - ${playlist.files.files.length}`}
                />
            </div>
            <hr />
        </>
    );
};

export default PlayListItem;
