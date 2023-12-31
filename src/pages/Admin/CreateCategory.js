import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast  from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm';
import { Modal } from 'antd';

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const {data} = await axios.post('https://ecommerce-mern-backend-cv10.onrender.com/api/v1/category/create-category',{
          name,
        });
        if( data?.success){
          toast.success(`${name} is created`);
          getAllCategroy();
        }else{
          toast.error(data.message);
        }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form.")
    }
  }
  // get all category
  const getAllCategroy = async () => {
    try {
      const {data} = await axios.get('https://ecommerce-mern-backend-cv10.onrender.com/api/v1/category/get-category');
      if(data?.success){
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category.")
    }
  }
  useEffect(() => {
    getAllCategroy();
  }, [])

  // update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.put(`https://ecommerce-mern-backend-cv10.onrender.com/api/v1/category/update-category/${selected._id}`,{name:updateName})
      if(data.success){
        toast.success(`${updateName} is updated`);
        selected(null)
        setUpdateName("")
        setVisible(false)
        getAllCategroy()
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  // delete category
  const handleDelete = async (pid) => {
    try {
      const {data} = await axios.delete(`https://ecommerce-mern-backend-cv10.onrender.com/api/v1/category/delete-category/${pid}`);
      if(data.success){
        toast.success(`category is deleted`);
        getAllCategroy()
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }
  return (
    <Layout title={"Dashboard - Create Category"}>
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu/>
            </div>
            <div className="col-md-9">
              <h1>Manage Category</h1>
              <div className="p-3 w-50">
                <CategoryForm
                  hangleSubmit={handleSubmit}
                  value = {name}
                  setValue = {setName}
                />
              </div>
              <div className='w-75'>
                <table className="table">
                  <thead>
                    <th className="col">Name</th>
                    <th className="col">Actions</th>
                  </thead>
                  <tbody>
                   
                      {categories.map((c) => (
                        <>
                        <tr>
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button className='btn btn-primary m-2' onClick={() => {setVisible(true); setUpdateName(c.name); setSelected(c)}}>Edit</button>
                          <button className='btn btn-danger m-2' onClick={() => {handleDelete(c._id)}}>Delete</button>
                        </td>
                        </tr>
                        </>
                        
                      ))}
                    
                  </tbody>
                </table>
              </div>
              <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
                <CategoryForm value={updateName} setValue={setUpdateName} hangleSubmit={handleUpdate}/>
              </Modal>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default CreateCategory
