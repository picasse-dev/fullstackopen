import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const response = axios.get(baseUrl)
    return response.then(response => response.data)
}

const create = (newObject) => {
    const response = axios.post(baseUrl, newObject)
    return response.then(response => response.data)
}

const updatePut = (id, updatedObject) => {
    const response = axios.put(`${baseUrl}/${id}`, updatedObject)
    return response.then(response => response.data)
}

const updatePatch = (id, updatedObjectProperty) => {
    const response = axios.patch(`${baseUrl}/${id}`, updatedObjectProperty)
    return response.then(response => response.data)
}

const remove = (id) => {
    const response = axios.delete(`${baseUrl}/${id}`)
    return response.then(response => response.data)
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