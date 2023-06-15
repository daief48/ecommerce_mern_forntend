import axios from 'axios';
import React, { useEffect, useState } from 'react'

const useCategory = () => {
    const [categories, setCategories] = useState([]);

    //get cat
    const getCategories = async () => {
        try {
            const {data} = await axios.get('https://ecommerce-mern-backend-cv10.onrender.com/api/v1/category/get-category');
            setCategories(data?.category);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getCategories();
    },[])
  return categories;
}

export default useCategory
