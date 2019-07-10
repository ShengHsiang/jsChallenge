import React, { useState, useEffect } from 'react';

export default function Greeting() {
  const width = useWindowWidth()
  return (
    <div>
      {width}
    </div>
  )
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
  return width
}

