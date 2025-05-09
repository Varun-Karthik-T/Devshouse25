import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://devshouse25.onrender.com/',
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
        console.error('Error fetching prediction:', error);
    }
};

const getAllUserReports = async (userId: string) => {
    try {
        const response = await api.get(`/reports/all/${userId}`);
        console.log(response.data.reports);
        return response.data;
    } catch (error) {
        console.error('Error fetching all user reports:', error);
    }
};

export { getPrediction, getAllUserReports };