/*
1.5: Course Information step 5
Let's take the changes one step further. Change the course and its parts into a single JavaScript object. Fix everything that breaks.

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      ...
    </div>
  )
}
*/
/**/
const Header = (props) => {
  return(
    <>
      <h1>{props.course.name}</h1>
    </>
  )
}
const Part = (props) => {
  return(
    <>
      <p>{props.p} {props.e}</p>
    </>
  )
}
const Content = (props) => {
  return(
    <>
      <Part p={props.crs.parts[0].name} e={props.crs.parts[0].exercises}></Part>
      <Part p={props.crs.parts[1].name} e={props.crs.parts[1].exercises}></Part>
      <Part p={props.crs.parts[2].name} e={props.crs.parts[2].exercises}></Part>
    </>
  )
}
const Total = (props) => {
  return(
    <>
      <p>Number of exercises {
        props.crs.parts[0].exercises+
        props.crs.parts[1].exercises+
        props.crs.parts[2].exercises }</p>
    </>
  )
}
const App = () => {
  console.clear()
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course}></Header>
      <Content crs={course}></Content>
      <Total crs={course}> </Total>
    </div>
  )
}
export default App
/**/

























/*
1.4: Course Information step 4
Place the objects into an array. Modify the variable definitions of App into the following form and modify the other parts of the application accordingly:
const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      ...
    </div>
  )
}copy
NB at this point you can assume that there are always three items, so there is no need to go through the arrays using loops. We will come back to the topic of rendering components based on items in arrays with a more thorough exploration in the next part of the course.

However, do not pass different objects as separate props from the App component to the components Content and Total. Instead, pass them directly as an array:

const App = () => {
  // const definitions

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
*/
/*
const Header = (props) => {
  return(
    <>
      <h1>{props.course}</h1>
    </>
  )
}
const Part = (props) => {
  return(
    <>
      <p>{props.p} {props.e}</p>
    </>
  )
}
const Content = (props) => {
  return(
    <>
      <Part p={props.prt[0].name} e={props.prt[0].exercises}></Part>
      <Part p={props.prt[1].name} e={props.prt[1].exercises}></Part>
      <Part p={props.prt[2].name} e={props.prt[2].exercises}></Part>
    </>
  )
}
const Total = (props) => {
  return(
    <>
      <p>Number of exercises {
        props.prt[0].exercises+
        props.prt[1].exercises+
        props.prt[2].exercises }</p>
    </>
  )
}
const App = () => {
  console.clear()
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]
  return (
    <div>
      <Header course={course}></Header>
      <Content prt={parts}></Content>
      <Total prt={parts}> </Total>
    </div>
  )
}
export default App
/**/






















/*
Exercises 1.3.-1.5.
1.3: Course Information step 3
Let's move forward to using objects in our application. Modify the variable definitions of the App component as follows and also refactor the application so that it still works:

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
*/
/*
const Header = (props) => {
  return(
    <>
      <h1>{props.course}</h1>
    </>
  )
}
const Part = (props) => {
  return(
    <>
      <p>{props.p} {props.e}</p>
    </>
  )
}
const Content = (props) => {
  return(
    <>
      <Part p={props.p1.name} e={props.p1.exercises}></Part>
      <Part p={props.p2.name} e={props.p2.exercises}></Part>
      <Part p={props.p3.name} e={props.p3.exercises}></Part>
    </>
  )
}
const Total = (props) => {
  return(
    <>
      <p>Number of exercises {props.e1+props.e2+props.e3}</p>
    </>
  )
}
const App = () => {
  console.clear()
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course}></Header>
      <Content p1={part1} p2={part2} p3={part3}></Content>
      <Total 
        e1={part1.exercises} 
        e2={part2.exercises} 
        e3={part3.exercises}>  
      </Total>
    </div>
  )
}

export default App
/**/
























/*
1.2: Course Information, step 2
Refactor the Content component so that it does not render any names of parts or their number of exercises by itself. Instead, it only renders three Part components of which each renders the name and number of exercises of one part.

const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}copy
Our application passes on information in quite a primitive way at the moment, since it is based on individual variables. We shall fix that in part 2, but before that, let's go to part1b to learn about JavaScript.
*/
/*
const Header = (props) => {
  return(
    <>
      <h1>{props.course}</h1>
    </>
  )
}
const Part = (props) => {
  return(
    <>
      <p>{props.p} {props.e}</p>
    </>
  )
}
const Content = (props) => {
  return(
    <>
      <Part p={props.p1} e={props.e1}></Part>
      <Part p={props.p2} e={props.e2}></Part>
      <Part p={props.p3} e={props.e3}></Part>
    </>
  )
}
const Total = (props) => {
  return(
    <>
      <p>Number of exercises {props.e1+props.e2+props.e3}</p>
    </>
  )
}
const App = () => {
  console.clear()
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}></Header>
      <Content 
        p1={part1} e1={exercises1}
        p2={part2} e2={exercises2}
        p3={part3} e3={exercises3}>
      </Content>
      <Total e1={exercises1} e2={exercises2} e3={exercises3}></Total>
    </div>
  )
}

export default App
/**/























/*
1.1: Course Information, step 1
Unfortunately, the entire application is in the same component. Refactor the code so that it consists of three new components: Header, Content, and Total. All data still resides in the App component, which passes the necessary data to each component using props. Header takes care of rendering the name of the course, Content renders the parts and their number of exercises and Total renders the total number of exercises. 
The App component's body will approximately be as follows:

const App = () => {
  // const-definitions

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}copy
WARNING Don't try to program all the components concurrently, because that will almost certainly break down the whole app. Proceed in small steps, first make e.g. the component Header and only when it works for sure, you could proceed to the next component.

Careful, small-step progress may seem slow, but it is actually by far the fastest way to progress. Famous software developer Robert "Uncle Bob" Martin has stated

"The only way to go fast, is to go well"

that is, according to Martin, careful progress with small steps is even the only way to be fast.
*/
/*
const Header = (props) => {
  return(
    <>
      <h1>{props.course}</h1>
    </>
  )
}
const Content = (props) => {
  return(
    <>
      <p>{props.p1} {props.e1}</p>
      <p>{props.p2} {props.e2}</p>
      <p>{props.p3} {props.e3}</p>
    </>
  )
}
const Total = (props) => {
  return(
    <>
      <p>Number of exercises {props.e1+props.e2+props.e3}</p>
    </>
  )
}
const App = () => {
  console.clear()
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}></Header>
      <Content 
        p1={part1} e1={exercises1}
        p2={part2} e2={exercises2}
        p3={part3} e3={exercises3}>
      </Content>
      <Total e1={exercises1} e2={exercises2} e3={exercises3}></Total>
    </div>
  )
}

export default App
/**/





















//Original Exercises 1.1.-1.2.
/*
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App
/**/

//alt + z = El código se ajuste al ancho de la pantalla en VS Code