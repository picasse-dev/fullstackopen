/*
1.11*: unicafe step 6
Display the statistics in an HTML table, so that your application looks roughly like this:

screenshot of statistics table
Remember to keep your console open at all times. If you see this warning in your console:

console warning
Then perform the necessary actions to make the warning disappear. Try pasting the error message into a search engine if you get stuck.

Typical source of an error Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist. is from a Chrome extension. Try going to chrome://extensions/ and try disabling them one by one and refreshing React app page; the error should eventually disappear.

Make sure that from now on you don't see any warnings in your console!
*/
/**/
import {useState} from 'react'


const Tittle = ({tittle}) => <h1>{tittle}</h1>
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>
const StatisticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>
  

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(prev=> prev +1)
  const handleNeutral = () => setNeutral(prev=> prev +1)
  const handleBad = () => setBad(prev=> prev +1)

  const all = () => good +neutral +bad
  const avg = () => all()===0 ? 0 : (good -bad)/all()
  const positive = () => all()===0 ? 0 : (good*100)/all()

//Simplified buttonHandlers -> before { ()=>handleGood() }
  return(
    <>
      <Tittle tittle={"Give feedback"}></Tittle>

      <Button onClick={handleGood} text={"Good"}></Button>
      <Button onClick={handleNeutral} text={"Neutral"}></Button>
      <Button onClick={handleBad} text={"Bad"}></Button>

      <Tittle tittle={"Statistics"}></Tittle>

      {(good +neutral +bad)===0 ? 
        <p>No feedback given</p>:
        <>
          <table>
            <thead>
              <tr>
                <th>Feedback</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              <StatisticLine text={"Good:"} value={good}></StatisticLine>
              <StatisticLine text={"Neutral: "} value={neutral}></StatisticLine>
              <StatisticLine text={"Bad: "} value={bad}></StatisticLine>
              <StatisticLine text={"all: "} value={all()}></StatisticLine>
              <StatisticLine text={"avg: "} value={avg()}></StatisticLine>
              <StatisticLine text={"positive: "} value={positive()}></StatisticLine>
            </tbody>
          </table>
        </>
      }
    </>
  )
}
export default App
/**/
//ChatGPT feedback: Puso mas bonita la tabla, uso variables en vez de funciones para all,avg & positive y cambia el estado directamente en el boton sin crear una variable para una funcion y mejoro el renderizado condicional con la variable all, o en ingles:                                                                 **ChatGPT feedback:** Improved the table's structure and accessibility by using semantic HTML. Replaced the `all`, `avg`, and `positive` functions with calculated variables, since their values can be derived directly from the component's state. Simplified the button handlers by updating the state directly in the `onClick` callbacks, without creating separate handler functions. Also improved conditional rendering by using the `all` variable to determine whether to display the statistics or the "No feedback given" message.
/*
import { useState } from 'react'


const Title = ({ text }) => <h1>{text}</h1>
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const StatisticLine = ({ text, value }) => <tr><th scope="row">{text}</th><td>{value}</td></tr>


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : (good / all) * 100

  return (
    <>
      <Title text="Give feedback" />

      <Button onClick={() => setGood(prev => prev + 1)} text="Good"/>
      <Button onClick={() => setNeutral(prev => prev + 1)} text="Neutral"/>
      <Button onClick={() => setBad(prev => prev + 1)} text="Bad"/>

      <Title text="Statistics" />

      {all === 0 ? (
        <p>No feedback given</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Statistic</th>
              <th scope="col">Value</th>
            </tr>
          </thead>

          <tbody>
            <StatisticLine text="Good" value={good} />
            <StatisticLine text="Neutral" value={neutral} />
            <StatisticLine text="Bad" value={bad} />
            <StatisticLine text="All" value={all} />
            <StatisticLine text="Average" value={average} />
            <StatisticLine text="Positive" value={`${positive}%`} />
          </tbody>
        </table>
      )}
    </>
  )
}
export default App
/**/





























/*
1.10: unicafe step 5
Let's continue refactoring the application. Extract the following two components:

Button handles the functionality of each feedback submission button.
StatisticLine for displaying a single statistic, e.g. the average score.
To be clear: the StatisticLine component always displays a single statistic, meaning that the application uses multiple components for rendering all of the statistics:

const Statistics = (props) => {
  /// ...
  return(
    <div>
      <StatisticLine text="good" value={...} />
      <StatisticLine text="neutral" value={...} />
      <StatisticLine text="bad" value={...} />
      // ...
    </div>
  )
}copy
The application's state should still be kept in the root App component.
*/
/*
import {useState} from 'react'


const Tittle = ({tittle}) => <h1>{tittle}</h1>
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>
const StatisticLine = ({text, value}) => <p>{text}{value}</p>
  

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(prev=> prev +1)
  const handleNeutral = () => setNeutral(prev=> prev +1)
  const handleBad = () => setBad(prev=> prev +1)

  const all = () => good +neutral +bad
  const avg = () => all()===0 ? 0 : (good -bad)/all()
  const positive = () => all()===0 ? 0 : (good*100)/all()


  return(
    <>
      <Tittle tittle={"Give feedback"}></Tittle>

      <Button onClick={()=>handleGood()} text={"Good"}></Button>
      <Button onClick={()=>handleNeutral()} text={"Neutral"}></Button>
      <Button onClick={()=>handleBad()} text={"Bad"}></Button>

      <Tittle tittle={"Statistics"}></Tittle>

      {(good +neutral +bad)===0 ? 
        <p>No feedback given</p>:
        <>
          <StatisticLine text={"Good: "} value={good}></StatisticLine>
          <StatisticLine text={"Neutral: "} value={neutral}></StatisticLine>
          <StatisticLine text={"Bad: "} value={bad}></StatisticLine>
          <StatisticLine text={"all: "} value={all()}></StatisticLine>
          <StatisticLine text={"avg: "} value={avg()}></StatisticLine>
          <StatisticLine text={"positive: "} value={positive()}></StatisticLine>
        </>
      }
    </>
  )
}
export default App
/**/
//ChatGPT feedback: Chat gpt extracted from app to Statistics component, the calculus of all(),avg() & positive(), also passed the sets by arrowfunciotns to the Button component, wasnt the goal of the exersice because of isnt separating the StatisticsLine component but apported another point of view or semi-valid solution...                                                                      it aslo corriged my redaction: **ChatGPT feedback:** ChatGPT moved the calculations for `all()`, `avg()`, and `positive()` from the `App` component to the `Statistics` component. It also passed the state update functions to the `Button` component using arrow functions. This wasn't the main goal of the exercise, which was to extract the `Button` and `StatisticLine` components, but it offered another perspective and a partially valid alternative solution.
/*
import { useState } from 'react'

const Title = ({ text }) => <h1>{text}</h1>
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const StatisticLine = ({ text, value }) => <p>{text}: {value}</p>

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad

  if (all === 0) {
    return <p>No feedback given</p>
  }

  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="All" value={all} />
      <StatisticLine text="Average" value={average} />
      <StatisticLine text="Positive" value={`${positive}%`} />
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Title text="Give feedback" />

      <Button onClick={() => setGood(good + 1)} text="Good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button onClick={() => setBad(bad + 1)} text="Bad" />

      <Title text="Statistics" />

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}
export default App
/**/


























/*
Ctrl + k + c -> Comment selected code
Ctrl + k + u -> unComment selected code
1.9: unicafe step 4
Change your application to display statistics only once feedback has been gathered.
*/
/*
import {useState} from 'react'


const Tittle = ({tittle}) => <h1>{tittle}</h1>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

// const Statistics = ({good, neutral, bad, all, avg, positive}) => {
//   return(
//     <>
//       {(good +neutral +bad)===0 ? 
//         <p>No feedback given</p> :
//         <p>
//           Good: {good}       <br></br>
//           Neutral: {neutral} <br></br>
//           Bad: {bad}         <br></br>
//           all: {all()}       <br></br>
//           avg: {avg()}       <br></br>
//           positive: {positive()} %
//         </p>
//       }
//     </>
//   )
// }

const Statistics = ({good, neutral, bad, all, avg, positive}) =>
  (good +neutral +bad)===0 ? 
  <p>No feedback given</p> :
  <p>
    Good: {good}       <br></br>
    Neutral: {neutral} <br></br>
    Bad: {bad}         <br></br>
    all: {all()}       <br></br>
    avg: {avg()}       <br></br>
    positive: {positive()} %
  </p>
  

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(prev=> prev +1)
  const handleNeutral = () => setNeutral(prev=> prev +1)
  const handleBad = () => setBad(prev=> prev +1)

  const all = () => good +neutral +bad
  const avg = () => (good +neutral +bad)===0 ? 0 : (good +neutral*0 -bad)/(good +neutral +bad)
  const positive = () => (good +neutral +bad)===0 ? 0 : (good*100)/(good+neutral+bad)


  return(
    <>
      <Tittle tittle={"Give feedback"}></Tittle>

      <Button onClick={()=>handleGood()} text={"Good"}></Button>
      <Button onClick={()=>handleNeutral()} text={"Neutral"}></Button>
      <Button onClick={()=>handleBad()} text={"Bad"}></Button>
      
      <Tittle tittle={"Statistics"}></Tittle>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        avg={avg}
        positive={positive}
      ></Statistics>
    </>
  )
}
export default App
/**/





























/*
1.8: unicafe step 3
Refactor your application so that displaying the statistics is extracted into its own Statistics component. The state of the application should remain in the App root component.

Remember that components should not be defined inside other components:

// a proper place to define a component
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // do not define a component within another component
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
*/
/*
import {useState} from 'react'


const Tittle = ({tittle}) => <h1>{tittle}</h1>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Statistics = ({tittle, good, neutral, bad, all, avg, positive}) => {
  return(
    <>
      <Tittle tittle={tittle}></Tittle>
      <p>
        Good: {good}       <br></br>
        Neutral: {neutral} <br></br>
        Bad: {bad}         <br></br>
        all: {all()}       <br></br>
        avg: {avg()}       <br></br>
        positive: {positive()} %
      </p>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(prev=> prev +1)
  const handleNeutral = () => setNeutral(prev=> prev +1)
  const handleBad = () => setBad(prev=> prev +1)

  const all = () => good +neutral +bad
  const avg = () => (good +neutral +bad)===0 ? 0 : (good +neutral*0 -bad)/(good +neutral +bad)
  const positive = () => (good +neutral +bad)===0 ? 0 : (good*100)/(good+neutral+bad)


  return(
    <>
      <Tittle tittle={"Give feedback"}></Tittle>

      <Button onClick={()=>handleGood()} text={"Good"}></Button>
      <Button onClick={()=>handleNeutral()} text={"Neutral"}></Button>
      <Button onClick={()=>handleBad()} text={"Bad"}></Button>
      
      <Statistics
        tittle={"Statistics"}
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        avg={avg}
        positive={positive}
      ></Statistics>
    </>
  )
}
export default App
/**/


























/*
1.7: unicafe step 2
Expand your application so that it shows more statistics about the gathered feedback: the total number of collected feedback, the average score (the feedback values are: good 1, neutral 0, bad -1) and the percentage of positive feedback.

average and percentage positive screenshot feedback
*/
/*
import {useState} from 'react'


const Button = ({onClick,text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(prev=> prev+1)
  const handleNeutral = () => setNeutral(prev=> prev+1)
  
  const handleBad = () => setBad(prev=> prev+1)
  const all = () => good +neutral +bad
  const avg = () => (good +neutral +bad)===0 ? 0 : (good +neutral*0 -bad)/(good +neutral +bad)
  const positive = () => (good +neutral +bad)===0 ? 0 : (good*100)/(good+neutral+bad)


  return(
    <>
      <h1>Give feedback</h1>

      <Button onClick={()=>handleGood()} text={"Good"}></Button>
      <Button onClick={()=>handleNeutral()} text={"Neutral"}></Button>
      <Button onClick={()=>handleBad()} text={"Bad"}></Button>

      <h1>Statistics</h1>
      
      <p>
        Good: {good} <br></br>
        Neutral: {neutral} <br></br>
        Bad: {bad} <br></br>
        all: {all()} <br></br>
        avg: {avg()} <br></br>
        positive: {positive()} %
      </p>
    </>
  )
}
export default App
/**/




























/*
1.6: unicafe step 1
Like most companies, the student restaurant of the University of Helsinki Unicafe collects feedback from its customers. Your task is to implement a web application for collecting customer feedback. There are only three options for feedback: good, neutral, and bad.

The application must display the total number of collected feedback for each category. Your final application could look like this:

screenshot of feedback options
Note that your application needs to work only during a single browser session. Once you refresh the page, the collected feedback is allowed to disappear.

It is advisable to use the same structure that is used in the material and previous exercise. File main.jsx is as follows:

import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)copy
You can use the code below as a starting point for the App.jsx file:

import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      code here
    </div>
  )
}

export default App
*/
/*
import {useState} from 'react'


const Button = ({onClick,text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(prev=> prev+1)
  const handleNeutral = () => setNeutral(prev=> prev+1)
  const handleBad = () => setBad(prev=> prev+1)
  

  return(
    <>
      <h1>Give feedback</h1>
      <Button onClick={()=>handleGood()} text={"Good"}></Button>
      <Button onClick={()=>handleNeutral()} text={"Neutral"}></Button>
      <Button onClick={()=>handleBad()} text={"Bad"}></Button>
      <h1>Statistics</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
    </>
  )
}
export default App
/**/