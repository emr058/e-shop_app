import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/categories';

const CategoryService = {
    getAll:() => axios.get(BASE_URL),
    add:(category) => axios.post(BASE_URL, category),
    remove:(id) => axios.delete(`${BASE_URL}/${id}`),
};

export default CategoryService;