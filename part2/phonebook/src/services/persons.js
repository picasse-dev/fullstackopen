import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    name: "non existing contact",
    number: '666',
    id: "666",
  }
  return request.then(response => response.data.concat(nonExisting))
}

// const getAll = () => {
//     const response = axios.get(baseUrl)
//     return response.then(response => response.data)
// }

const create = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const updatePut = (id, updatedObject) => {
    const request = axios.put(`${baseUrl}/${id}`, updatedObject)
    return request.then(response => response.data)
}

const updatePatch = (id, updatedObjectProperty) => {
    const request = axios.patch(`${baseUrl}/${id}`, updatedObjectProperty)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default {
    getAll, 
    create,
    updatePut,
    updatePatch,
    remove
}

// export default {
//     getAll: getAll, 
//     create: create,
//     updatePut: updatePut,
//     updatePatch: updatePatch,
//     remove: remove
// }