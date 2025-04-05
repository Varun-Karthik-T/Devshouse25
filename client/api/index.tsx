import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.51.65:8000/', // Added 'http://' to the baseURL
    headers: {
        'Content-Type': 'application/json',
    },
});

const getPrediction = async () => {
    try {
        const response = await api.get('/predict')
        console.log(response.data.predictions)
        return response.data;
        
    } catch (error) {
        console.error('Error fetching prediction:', error); // Added error handling
    }
};

export { getPrediction };