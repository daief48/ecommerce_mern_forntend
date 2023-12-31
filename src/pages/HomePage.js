import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Layout from './../components/Layout/Layout';
import { Checkbox, Radio } from "antd";
import { useAuth } from "../context/auth";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // get all category
  const getAllCategroy = async () => {
    try {
      const { data } = await axios.get('https://ecommerce-mern-backend-cv10.onrender.com/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllCategroy();
    getTotal();
  }, [])
  //getall products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://ecommerce-mern-backend-cv10.onrender.com/api/v1/product/product-list/${page}`);
      setLoading(false)
      setProducts(data.products);
    } catch (error) {
      setLoading(false)
      console.log(error);
      toast.error("Someething Went Wrong");
    }
  };
  // getTotal count
  const getTotal = async () => {
    try {
      const { data } = await axios.get('https://ecommerce-mern-backend-cv10.onrender.com/api/v1/product/product-count');
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page])
  //Load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://ecommerce-mern-backend-cv10.onrender.com/api/v1/product/product-list/${page}`);
      setLoading(false)
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false)
      console.log(error);
      toast.error("Someething Went Wrong");
    }
  }
  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter(c => c !== id)
    }
    setChecked(all);
  }
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length])

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio])

  //get filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post('https://ecommerce-mern-backend-cv10.onrender.com/api/v1/product/product-filters', { checked, radio });
      setProducts(data?.products)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Layout title={"All Products - Best offers"}>
      <div className="row">
        <div className="col-md-2">
          <h6 className="text-center">Filter By Category</h6>
          <div className="d-flex flex-column">

            {categories?.map((c) => (
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h6 className="text-center mt-4">Filter By Prices</h6>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map(p => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button className="btn btn-danger" onClick={() => window.location.reload()}>RESET FILTERS</button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Producst</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (

              <div className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`https://ecommerce-mern-backend-cv10.onrender.com/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}</p>
                  <p className="card-text">$ {p.price}</p>
                  <button href="#" className="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>More Detials</button>
                  <button href="#" className="btn btn-secondary ms-1" onClick={() => {
                    setCart([...cart,p]);
                    toast.success("Item Added to cart");
                    localStorage.setItem("cart",JSON.stringify([...cart,p]))
                  }}>ADD TO CART</button>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && (
              <button className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault(); setPage(page + 1);
                }}>
                {loading ? 'Loading...' : 'Loadmore'}
              </button>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
