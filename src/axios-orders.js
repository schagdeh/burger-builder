import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://react-my-burger-48c54.firebaseio.com/'
})

export default instance