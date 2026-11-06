const NotificationErr = ({ message }) => {
  const inLineStyle = {
      color: "red",
      backgroundColor:"White",
      padding: "10px",
      fontSize: "20px",
      border: "5px solid"
  }
  if(message===null)return null

  return <div style={inLineStyle}>{message}</div>
}
export default NotificationErr