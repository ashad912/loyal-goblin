import React from 'react'

export default function Loading() {

    const [fullHeightCorrection, setFullHeightCorrection] = React.useState(0)

    React.useEffect(() => {
        const navbar = document.getElementById("navbar").offsetHeight;
        const footer = document.getElementById("footer").offsetHeight;
        setFullHeightCorrection(navbar+footer)
    }, [])

    return (
        <div style={{width: '100vw', height: `calc(100vh - ${fullHeightCorrection}px)`}}></div>       
    )
}
