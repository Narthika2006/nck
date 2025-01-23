import React, { useRef } from 'react'

function Start({setusername}){
    const inputref = useRef();
    const handleClick = () => {
        inputref.current.value && setusername(inputref.current.value);
    }
  return(
    <div>
      <input className='startInput' placeholder='Enter Your Name...' ref={inputref}></input>
      <button onClick={handleClick}>Start Game</button>
    </div>
  )
}

export default Start