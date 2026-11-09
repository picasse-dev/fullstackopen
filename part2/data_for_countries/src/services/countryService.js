// ==========================================
// 1. AXIOS SERVICE
// ==========================================

import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = async (signal) => {
  const response = await axios.get(`${baseUrl}/all`, { signal })
  return response.data
}
export default {getAll}