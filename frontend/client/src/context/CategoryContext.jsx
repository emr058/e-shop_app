import { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { apiClient } from '../config/api';

const CategoryContext = createContext();

export const useCategory = () => {
    return useContext(CategoryContext);
};

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiClient.get('/categories');
                setCategories(res.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };
        
        fetchCategories();
    }, []);

    const value = {
        categories,
        setCategories
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};