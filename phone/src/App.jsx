import { useState } from 'react'

const App = () => {
  const [option, setOption] = useState([
    {"Init": 1},
    {"Menu": 0},
    {"Config": 0},
    {"Archives": 0},
    {"Calculator": 0},
    {"Calendar": 0},
    {"Calls": 0},
    {"Camera": 0},
    {"Chess": 0},
    {"Clock": 0},
    {"Contacts": 0},
    {"Compass": 0},
    {"Galery": 0},
    {"Maps": 0},
    {"Messages": 0},
    {"Music": 0},
    {"Navigator": 0},
    {"Notes": 0},
    {"Radio": 0},
    {"Recorder": 0},
    {"Scanner": 0},
    {"Screen recorder": 0},
    {"Search": 0},
    {"Store": 0},
    {"Themes": 0},
    {"Weather": 0},
    {"Whatsapp": 0}
  ])
  return(
    <>
      <button>Menú</button>
    </>
  )
}
export default App