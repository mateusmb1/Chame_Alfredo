import React, { useState } from 'react';

const Mascot: React.FC<{ className?: string }> = ({ className }) => {
    const [sourceIndex, setSourceIndex] = useState(0);
    const sources = [
        '/mascot-minimalist-icon-1764812577837-removebg-preview.png',
        '/alfredo.webp',
        '/alfredo.png'
    ];

    return (
        <img
            src={sources[sourceIndex]}
            alt="Mascote Alfredo"
            className={(className ? className + ' ' : '') + 'object-contain'}
            loading="lazy"
            decoding="async"
            onError={() => {
                if (sourceIndex < sources.length - 1) {
                    setSourceIndex(sourceIndex + 1);
                }
            }}
        />
    );
};

export default Mascot;
