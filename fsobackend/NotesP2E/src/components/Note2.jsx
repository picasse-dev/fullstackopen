const Note2 = ({note, fun}) => {
  const label = note.important ? 'make not important' : 'make important'
  return(
    <>
      <li className='note'>{note.content}
        <button onClick = {fun}>{label}</button>
      </li>
      
    </>
  )
}
export default Note2