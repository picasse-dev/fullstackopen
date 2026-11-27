const NotificationAddUpdt = ({ message }) => {
    const inLineStyle = {
        color: "green",
        backgroundColor:"White",
        padding: "10px",
        fontSize: "20px",
        border: "5px solid"
  }
    if(message===null)return
    return <div style={inLineStyle}>{message}</div>
}
export default NotificationAddUpdt