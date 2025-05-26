import { useState } from 'react';
import { useRef } from 'react';
import { Welcome } from './components/Welcome';
import { ProfilePic } from './components/ProfilePic';
import { Likes } from './components/Likes';
import { UserStatus } from './components/UserStatus';
import _ from "lodash";
import { DogImage } from './components/DogProfile';

function App() {
  return (
    <div>
      <h1>Profilsida</h1>

      <ProfileCard 
        name="Aquaman"
        imageUrl="https://cdn.britannica.com/90/199490-050-DA632B69/promotional-art-Jason-Momoa-Justic-League-2017.jpg"
        likes={42}
      />

      <ProfileCard 
        name="Wonder Woman"
        imageUrl="https://people.com/thmb/O4au7o8qtmbV9qC2SMQfPm7rg6k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(675x379:677x381)/gal-gadot-2000-f893bc7afe9b44be91663eb17cc17750.jpg"
        likes={99}
      />

      <Form />

      <Container />

      <LoginButton />
      <LoginState />
      <ShuffleNumbers />

      <Counter />

      <DogImage />
    </div>
  );
}

function LoginState(){
    return <UserStatus status={true} name="Manne" />;
}

function ProfileCard({name, imageUrl, likes}){
  return(
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', borderRadius: '10px' }}>
      <Welcome name={name} />
      <ProfilePic imageUrl={imageUrl} />
      <Likes count={likes} />
      <HoverButton /> {/* Den "gamla" Button som ändrar text på hover */}
    </div>
  );
}

function HoverButton() {
  const [text, setText] = useState('håll över mig');

  function handleEnter() {
    setText('enter');
  }
  function handleLeave(){
    setText('leave');
  }

  return <button onMouseEnter={handleEnter} onMouseLeave={handleLeave}>{text}</button>;
}

function Form(){
  const [text, setText] = useState('');
  let tempText = '';

  function handleInputChange(event){
    tempText = event.target.value;
  }

  function handleSubmit(event){
    event.preventDefault();
    event.target.reset();
    setText(tempText);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' onChange={handleInputChange} />
      </form>
      <h1>{text}</h1>
    </div>
  );
}

function Container() {
  const [cssClass, setCssClass] = useState('skyblue');

  return (
    <div className={cssClass}>
      <ColorButton changeParentClass={setCssClass} colorScheme="light" />
      <ColorButton changeParentClass={setCssClass} colorScheme="dark" />
    </div>
  );
}

function ColorButton({ changeParentClass, colorScheme }) {
  function handleClick() {
    changeParentClass(colorScheme);
  }

  return <button onClick={handleClick}>{colorScheme}</button>;
}

function LoginButton(){
    const loggedIn = true;

    if(loggedIn){
        return <button>Logga ut</button>
    }
    else{
        return <button>Logga in</button>
    }
}

function Number({text}){
    return(
        <i>{text + ' '}</i>
    )
}

function ShuffleNumbers(){
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])


    function handleClick(){
//Här används underscore för att blanda arrayen
        setNumbers( _.shuffle(numbers) ); 
    }

    return(<>
            <div>
                {numbers.map(n => <Number key={n} text={n} />)}
            </div>
            <button onClick={handleClick}>Shuffle</button>
        </>)
}

function Counter(){
    const count = useRef(0);

    function handleclick(){
        count.current++;
        alert(count.current);
    }

    return <button onClick={handleclick}>Räkna: {count.current}</button>
}


export default App;