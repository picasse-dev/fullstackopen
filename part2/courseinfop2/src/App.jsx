/*
2.4: Course information step 9
Let's extend our application to allow for an arbitrary number of courses:

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      // ...
    </div>
  )
}copy
The application can, for example, look like this:
*/
/** */
const Title = ({ title }) => <h1>{title}</h1>
const Header = ({ title }) => <h3>{title}</h3>
const Part = ({ part }) => <p>{part.name} {part.exercises}</p>
const Content = ({ course }) => course.parts.map((el) => <Part part={el} key={el.id} />)
const Total = ({ total }) => <p><strong>Number of exercises {total}</strong></p>

const Courses = ({ courses }) => courses.map((course) => (
  <div key={course.id}>
    <Header title={course.name} />
    <Content course={course} />
    <Total total={course.parts.reduce((sum, prt) => sum + prt.exercises, 0)} />
  </div>
))

const App = () => {
  (console.clear(), console.log("app working"))
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return(
    <>
      <Title title={"Web development curriculum"}></Title>
      <Courses courses={courses} />
    </>
  ) 
}
export default App
/**/

//Curses in compact style, implicit return wtf with the (), still working
/*
const Courses = ({ courses }) => courses.map((course) => (
  <div key={course.id}>
    <Header title={course.name} />
    <Content course={course} />
    <Total total={course.parts.reduce((sum, prt) => sum + prt.exercises, 0)} />
  </div>
))
*/

//Curses in NO compact style
/*
const Courses = ({ courses }) => {
  return(
    courses.map((course)=>{
      return(
        <div key={course.id}>
          <Header title={course.name} />
          <Content course={course} />
          <Total total={course.parts.reduce((sum, prt) => sum + prt.exercises, 0)} />
        </div>
      )
    })
  )
}
*/




































/*
2.3*: Course information step 8
If you haven't done so already, calculate the sum of exercises with the array method reduce.

Pro tip: when your code looks as follows:

const total = 
  parts.reduce((s, p) => someMagicHere)copy
and does not work, it's worth it to use console.log, which requires the arrow function to be written in its longer form:

const total = parts.reduce((s, p) => {
  console.log('what is happening', s, p)
  return someMagicHere 
})copy
Not working? : Use your search engine to look up how reduce is used in an Object Array.
*/
/*
const Header = ({ title }) => <h1>{title}</h1>
const Part = ({ part }) => <p>{part.name} {part.exercises}</p>
const Content = ({ course }) => 
  course.parts.map((el) => <Part part={el} key={el.id} />)
const Total = ({ total }) => <p>Number of exercises {total}</p>
const Course = ({ course }) => {
  return(
    <>
      <Header title={course.name} />
      <Content course={course} />
      <Total total={course.parts.reduce((sum, prt) => sum + prt.exercises, 0)} />
    </>
  )
}

const App = () => {
  (console.clear(), console.log("app working"))
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}
export default App
/**/
































/*
2.2: Course information step 7
Show also the sum of the exercises of the course.

sum of exercises added feature
*/
/*

const Header = ({title}) => <h1>{title}</h1>
const Part = ({part}) => <p>{part.name} {part.exercises}</p>
const Content = ({course}) => course.parts.map( (el)=><Part part={el} key={el.id}></Part> )
const Total = ({total}) => <p>Number of exercises {total}</p>
const Course = ({course}) => {
  let sum = 0
  const calcSum = course.parts.map( el => sum+=el.exercises )

  return(
    <>
      <Header title={course.name}></Header>
      <Content course={course}></Content>
      <Total total={sum}></Total>
    </>
  )
}

const App = () => {
  (console.clear(), console.log("app working"))
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}
export default App
/**/






































/*
Exercises 2.1.-2.5.
The exercises are submitted via GitHub, and by marking the exercises as done in the submission system.

You can submit all of the exercises into the same repository, or use multiple different repositories. If you submit exercises from different parts into the same repository, name your directories well.

The exercises are submitted One part at a time. When you have submitted the exercises for a part, you can no longer submit any missed exercises for that part.

Note that this part has more exercises than the ones before, so do not submit until you have done all the exercises from this part you want to submit.

2.1: Course information step 6
Let's finish the code for rendering course contents from exercises 1.1 - 1.5. You can start with the code from the model answers. The model answers for part 1 can be found by going to the submission system, clicking on my submissions at the top, and in the row corresponding to part 1 under the solutions column clicking on show. To see the solution to the course info exercise, click on App.jsx under courseinfo.

Note that if you copy a project from one place to another, you might have to delete the node_modules directory and install the dependencies again with the command npm install before you can start the application.

Generally, it's not recommended that you copy a project's whole contents and/or add the node_modules directory to the version control system.

Let's change the App component like so:

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default Appcopy
Define a component responsible for formatting a single course called Course.

The component structure of the application can be, for example, the following:

App
  Course
    Header
    Content
      Part
      Part
      ...copy
Hence, the Course component contains the components defined in the previous part, which are responsible for rendering the course name and its parts.

The rendered page can, for example, look as follows:

half stack application screenshot
You don't need the sum of the exercises yet.

The application must work regardless of the number of parts a course has, so make sure the application works if you add or remove parts of a course.

Ensure that the console shows no errors!
*/
/*
const Header = ({tittle}) => <h1>{tittle}</h1>
const Part = ({part}) => <p>{part.name} {part.exercises}</p>
const Content = ({course}) => course.parts.map( (el)=><Part part={el} key={el.id}></Part> )
const Course = ({course}) => {
  return(
    <>
      <Header tittle={course.name}></Header>
      <Content course={course}></Content>
    </>
  )
}

const App = () => {
  (console.clear(), console.log("app working"))
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}
export default App
/**/












































































//Original solution courseinfo P1 (GOOD)
/*
const Header = (props) => <h1>{props.course}</h1>
const Part = (props) => <p>{props.part.name} {props.part.exercises}</p>
const Total = (props) => <p>Number of exercises {props.total}</p>

const Content = (props) => (
  <div>
    <Part part={props.parts[0]} />
    <Part part={props.parts[1]} />
    <Part part={props.parts[2]} />
  </div>
)



const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      },
    ],
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total={
          course.parts[0].exercises +
          course.parts[1].exercises +
          course.parts[2].exercises
        }
      />
    </div>
  )
}

export default App
/**/
































/*
Exercises 2.1.-2.5. (PART1)
The exercises are submitted via GitHub, and by marking the exercises as done in the submission system.

You can submit all of the exercises into the same repository, or use multiple different repositories. If you submit exercises from different parts into the same repository, name your directories well.

The exercises are submitted One part at a time. When you have submitted the exercises for a part, you can no longer submit any missed exercises for that part.

Note that this part has more exercises than the ones before, so do not submit until you have done all the exercises from this part you want to submit.

2.1: Course information step 6
Let's finish the code for rendering course contents from exercises 1.1 - 1.5. You can start with the code from the model answers. The model answers for part 1 can be found by going to the submission system, clicking on my submissions at the top, and in the row corresponding to part 1 under the solutions column clicking on show. To see the solution to the course info exercise, click on App.jsx under courseinfo.

Note that if you copy a project from one place to another, you might have to delete the node_modules directory and install the dependencies again with the command npm install before you can start the application.

Generally, it's not recommended that you copy a project's whole contents and/or add the node_modules directory to the version control system.

Let's change the App component like so:

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default Appcopy
Define a component responsible for formatting a single course called Course.

The component structure of the application can be, for example, the following:

App
  Course
    Header
    Content
      Part
      Part
      ...copy
Hence, the Course component contains the components defined in the previous part, which are responsible for rendering the course name and its parts.

The rendered page can, for example, look as follows:

half stack application screenshot
You don't need the sum of the exercises yet.

The application must work regardless of the number of parts a course has, so make sure the application works if you add or remove parts of a course.

Ensure that the console shows no errors!
*/
/*
const Header = (props) => <h1>{props.course.name}</h1>
const Part = (props) => <p>{props.p} {props.e}</p>
const Content = (props) => {
  return(
    <>
      <Part p={props.course.parts[0].name} e={props.course.parts[0].exercises}></Part>
      <Part p={props.course.parts[1].name} e={props.course.parts[1].exercises}></Part>
      <Part p={props.course.parts[2].name} e={props.course.parts[2].exercises}></Part>
    </>
  )
}
const Total = (props) => {
  return(
    <>
      <p>Number of exercises {
        props.course.parts[0].exercises+
        props.course.parts[1].exercises+
        props.course.parts[2].exercises }</p>
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
      <Content course={course}></Content>
      <Total course={course}> </Total>
    </div>
  )
}
export default App
/**/





























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
/*
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