const Header = ({ title }) => 
    <h3>{title}</h3>


const Part = ({ part }) => 
    <p>{part.name} {part.exercises}</p>


const Content = ({ course }) => 
    course.parts.map((el) => 
    <Part part={el} key={el.id} />)


const Total = ({ course }) => 
<p>
    <strong>Number of exercises {
        course.parts.reduce((sum, prt) => 
            sum + prt.exercises, 0)}
    </strong>
</p>

const Courses = ({ courses }) => courses.map((course) => (
  <div key={course.id}>
    <Header title={course.name} />
    <Content course={course} />
    <Total course={course} />
  </div>
))

export default Courses