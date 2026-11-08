import { useState } from 'react'
import axios from 'axios'

let a = 0
const App = () => {
  (console.log('render: ',a), a++)
  const [data, setData] = useState([])
  const [value, setValue] = useState('')
  //https://studies.cs.helsinki.fi/restcountries/api/name/finland
  const handleChange = (event) => setValue(event.target.value)
  
  return(
    <>
      <label htmlFor="input_1">find countries</label>
      <input 
        type="text" 
        id="input_1"
        value={value}
        onChange={handleChange}
      />
      
    </>
  )
}
export default App