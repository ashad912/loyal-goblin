import React from 'react'

export default function Loading() {

    const [fullHeightCorrection, setFullHeightCorrection] = React.useState(0)

    React.useEffect(() => {
        const navbar = document.getElementById("navbar") ? (document.getElementById("navbar").offsetHeight) : 0;
        const footer = document.getElementById("footer") ? (document.getElementById("footer").offsetHeight) : 0;
        setFullHeightCorrection(navbar+footer)
    }, [])

    return (
        <div style={{width: '100vw', height: `calc(100vh - ${fullHeightCorrection}px)`}}></div>       
    )
}
