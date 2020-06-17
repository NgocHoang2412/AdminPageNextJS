import axios from 'axios';
import {API} from '../constants';

export const  instance = axios.create({
    baseURL: API.apiURL,
    timeout: API.requestTimeout,
    headers: {'content-type' : 'application/json'},
  })


export default instance;