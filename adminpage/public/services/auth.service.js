import axios from './axiosApi';
import {API} from '../constants';

export const getItems = async () => {
    let result = await axios.get(API.getItems)
    return result;
}