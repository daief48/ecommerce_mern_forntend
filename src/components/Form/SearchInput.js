import React from 'react'
import { useSearch } from '../../context/search'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.get(`https://ecommerce-mern-backend-cv10.onrender.com/api/v1/product/search/${values.keyword}`);
            setValues({...values, results: data});
            navigate('/search');
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
      <form action="" className='d-flex' role='search' onSubmit={handleSubmit}>
        <input type="search"
        className='form-control me-2' placeholder='Search' aria-label='Search' value={values.keyword} onChange={(e) => setValues({...values, keyword: e.target.value})}
        />
        <button className="btn btn-outline-success">Search</button>
      </form>
    </div>
  )
}

export default SearchInput
