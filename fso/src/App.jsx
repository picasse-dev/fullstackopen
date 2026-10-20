/*
Stateful component
All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.

Next, let's add state to our application's App component with the help of React's state hook.

We will change the application as follows. main.jsx goes back to:

import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
and App.jsx changes to the following:

import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}

export default App
In the first row, the file imports the useState function:

import { useState } from 'react'
The function body that defines the component begins with the function call:

const [ counter, setCounter ] = useState(0)
The function call adds state to the component and renders it initialized with the value zero. The function returns an array that contains two items. We assign the items to the variables counter and setCounter by using the destructuring assignment syntax shown earlier.

The counter variable is assigned the initial value of state, which is zero. The variable setCounter is assigned a function that will be used to modify the state.

The application calls the setTimeout function and passes it two parameters: a function to increment the counter state and a timeout of one second:

setTimeout(
  () => setCounter(counter + 1),
  1000
)
The function passed as the first parameter to the setTimeout function is invoked one second after calling the setTimeout function

() => setCounter(counter + 1)
When the state modifying function setCounter is called, React re-renders the component which means that the function body of the component function gets re-executed:

() => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  return (
    <div>{counter}</div>
  )
}
The second time the component function is executed it calls the useState function and returns the new value of the state: 1. Executing the function body again also makes a new function call to setTimeout, which executes the one-second timeout and increments the counter state again. Because the value of the counter variable is 1, incrementing the value by 1 is essentially the same as an expression setting the value of counter to 2.

() => setCounter(2)
Meanwhile, the old value of counter - "1" - is rendered to the screen.

Every time the setCounter modifies the state it causes the component to re-render. The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running.

If the component doesn't render when you think it should, or if it renders at the "wrong time", you can debug the application by logging the values of the component's variables to the console. If we make the following additions to our code:

const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter)

  return (
    <div>{counter}</div>
  )
}
It's easy to follow and track the calls made to the App component's render function:

screenshot of rendering log on dev tools
Was your browser console open? If it wasn't, then promise that this was the last time you need to be reminded about it.
*/
/**/
import { useState } from 'react'

const App = () => {

  const [counter, setCounter] = useState(0)


  setTimeout(
    () => {
      console.log("SetCounter")
      setCounter(counter + 1)
    },
    1000
  )

  console.log('rendering...', counter)

  return(
    <><p>{counter}</p></>
  )
}

export default App
/**/

























/*
Page re-rendering
Up to this point, our applications have been static — their appearance remains unchanged after the initial rendering. But what if we wanted to create a counter that increases in value, either over time or when a button is clicked?

Let's start with the following. File App.jsx becomes:

const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App
And file main.jsx becomes:

import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

ReactDOM.createRoot(document.getElementById('root')).render(
  <App counter={counter} />
)
The App component is given the value of the counter via the counter prop. This component renders the value to the screen. What happens when the value of counter changes? Even if we were to add the following

counter += 1
the component won't re-render. We can get the component to re-render by calling the render method a second time, e.g. in the following way:

let counter = 1

const root = ReactDOM.createRoot(document.getElementById('root'))

const refresh = () => {
  root.render(
    <App counter={counter} />
  )
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
The re-rendering command has been wrapped inside of the refresh function to cut down on the amount of copy-pasted code.

Now the component renders three times, first with the value 1, then 2, and finally 3. However, values 1 and 2 are displayed on the screen for such a short amount of time that they can't be noticed.

We can implement slightly more interesting functionality by re-rendering and incrementing the counter every second by using setInterval:

setInterval(() => {
  refresh()
  counter += 1
}, 1000)
Making repeated calls to the render method is not the recommended way to re-render components. Next, we'll introduce a better way of accomplishing this effect.
*/
/**/

/**/

























/*
Destructuring
Before we move forward, we will take a look at a small but useful feature of the JavaScript language that was added in the ES6 specification, that allows us to destructure values from objects and arrays upon assignment.

In our previous code, we had to reference the data passed to our component as props.name and props.age. Of these two expressions, we had to repeat props.age twice in our code.

Since props is an object

props = {
  name: 'Arto Hellas',
  age: 35,
}
we can streamline our component by assigning the values of the properties directly into two variables name and age which we can then use in our code:

const Hello = (props) => {
  const name = props.name
  const age = props.age

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
Note that we've also utilized the more compact syntax for arrow functions when defining the bornYear function. As mentioned earlier, if an arrow function consists of a single expression, then the function body does not need to be written inside of curly braces. In this more compact form, the function simply returns the result of the single expression.

To recap, the two function definitions shown below are equivalent:

const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
Destructuring makes the assignment of variables even easier since we can use it to extract and gather the values of an object's properties into separate variables:

const Hello = (props) => {
  const { name, age } = props
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
When the object that we are destructuring has the values

props = {
  name: 'Arto Hellas',
  age: 35,
}
the expression const { name, age } = props assigns the values 'Arto Hellas' to name and 35 to age.

We can take destructuring a step further:

const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
The props that are passed to the component are now directly destructured into the variables, name and age.

This means that instead of assigning the entire props object into a variable called props and then assigning its properties to the variables name and age

const Hello = (props) => {
  const { name, age } = props
we assign the values of the properties directly to variables by destructuring the props object that is passed to the component function as a parameter:

const Hello = ({ name, age }) => {
*/
/*
const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 277

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
export default App
/**/
























/*
Compent helper  functions

Let's expand our Hello component so that it guesses the year of birth of the person being greeted:

const Hello = (props) => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
The logic for guessing the year of birth is encapsulated within a function of its own, which is invoked when the component is rendered.

The person's age does not need to be explicitly passed as a parameter to this function because the function can directly access all the props provided to the component.

If we examine the current code, we notice that the helper function is defined within another function that determines the component's behavior. In Java programming, defining a function within another function can be complex and is uncommon. However, in JavaScript, defining functions within functions is a common and efficient practice.
*/
/*
const Hello = (props) => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 27

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
export default App
/**/


























/*
c Component state, event handlers
Let's go back to working with React.

We start with a new example:
*/
/*
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
export default App
/**/























/*
object methods and "this" only is javascript no react component
*/
/*
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  doAddition: function(a, b) {
    console.log(a + b)
  },
}

arto.greet()  // "hello, my name is Arto Hellas" gets printed

arto.growOlder = function() {
  this.age += 1
}

console.log(arto.age)   // 35 is printed
arto.growOlder()
console.log(arto.age)   // 36 is printed

arto.doAddition(1, 4)        // 5 is printed

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // 25 is printed

//Now the object has the method doAddition which calculates the sum of numbers given to it as parameters. The method is called in the usual way, using the object arto.doAddition(1, 4) or by storing a method reference in a variable and calling the method through the variable: referenceToAddition(10, 15).
//If we try to do the same with the method greet we run into an issue:


arto.greet()// "hello, my name is Arto Hellas" gets printed

console.log(" referenceTogreet= arto.greet F*CKKK")
const referenceToGreet = arto.greet
referenceToGreet() // prints "hello, my name is undefined"


//When calling the method through a reference, the method loses knowledge of what the original this was. Contrary to other languages, in JavaScript the value of this is defined based on how the method is called. When calling the method through a reference, the value of this becomes the so-called global object and the end result is often not what the software developer had originally intended.
//Losing track of this when writing JavaScript code brings forth a few potential issues. Situations often arise where React or Node (or more specifically the JavaScript engine of the web browser) needs to call some method in an object that the developer has defined. However, in this course, we avoid these issues by using "this-less" JavaScript.
//One situation leading to the "disappearance" of this arises when we set a timeout to call the greet function on the arto object, using the setTimeout function.

console.log(" Using set timeout arto.greet F*CKKK")
setTimeout(arto.greet, 1000)

//As mentioned, the value of this in JavaScript is defined based on how the method is being called. When setTimeout is calling the method, it is the JavaScript engine that actually calls the method and, at that point, this refers to the global object.
//There are several mechanisms by which the original this can be preserved. One of these is using a method called bind:

console.log(" Fix Using arto.greet.bind(arto) and setTimeout")
setTimeout(arto.greet.bind(arto), 1000)

//Calling arto.greet.bind(arto) creates a new function where this is bound to point to Arto, independent of where and how the method is being called.
//Using arrow functions it is possible to solve some of the problems related to this. They should not, however, be used as methods for objects because then this does not work at all. We will come back later to the behavior of this in relation to arrow functions.

/**/



















/*
P0
a general info
b fundamental of web apps
The 1st rule of web development: Always keep the Developer Console open on your web browser. F12.
Make sure that the Network tab is open, and check the Disable cache option.

HTTP GET:
The browser requested the address https://studies.cs.helsinki.fi/exampleapp, using the GET method, and that the request was successful, because the server response had the Status code 200.

Because of the img tag, the browser does a second HTTP request to fetch the image kuva.png from the server.

Traditional web applications:
In traditional web applications, the browser is "dumb". It only fetches HTML data from the server, and all application logic is on the server. A server can be created using Java Spring , Python Flask or Ruby on Rails to name just a few examples.

Running application logic in the browser:


...
...
..
.

P1
a introduction to react
...
..
.

b JavaScript
variables
arrays
objects
functions
Exercises 1.3-1.5
Object methods and "this"
classes
JavaScript materials



*/