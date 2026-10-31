import axios from 'axios'
const baseUrl = 'http://localhost:3001/activities'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const updatePatch = (id, newObject) => {
  const request = axios.patch(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const updatePut = (id, newObjectProperty) => {
  const request = axios.put(`${baseUrl}/${id}`, newObjectProperty)
  return request.then(response => response.data)
}

const remove = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getAll, create, updatePatch, updatePut, remove}