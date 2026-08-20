import React from 'react'

export default function Artwork({ artwork }) {
    return (
        <div>
            <img src={artwork} style={{ height: 250 }} alt="~playlist art~" />
        </div>
    )
}
