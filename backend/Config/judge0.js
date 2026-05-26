import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const judge0Client = axios.create({
  baseURL: process.env.JUDGE0_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 100000000
});

export default judge0Client;
