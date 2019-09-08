import React from 'react'

const Admin = () => {
    const handleClick = async () => {
        try{
            const res = await fetch('/users/me')
            console.log(res.json())
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div onClick={handleClick}>Click to check server (no 404 or 500 error means connection - output in console)</div>
    )
}

export default Admin