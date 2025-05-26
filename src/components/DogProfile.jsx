import React, { useState, useEffect } from 'react';

export function DogImage() {
  const [imgUrl, setImgUrl] = useState(''); // State för att spara bild-URL

  useEffect(() => {
    async function fetchDogImage() {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();
      setImgUrl(data.message);
    }

    fetchDogImage();
  }, []);

  return (
    <div>
      {imgUrl && <img src={imgUrl} alt="Random dog" />}
    </div>
  );
}

export default DogImage;