import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import apiInstance from '../../utils/axios'
import UserData from '../plugins/UserData'
import Toast from '../../utils/Toast'

const UpdateProduct = () => {
    const userData = UserData();
    const navigate = useNavigate();
    const params = useParams();

    const [product, setProduct] = useState({});
    const [specifications, setSpecifications] = useState([{title: '', content: ''}])
    const [color, setColor] = useState([{
        name: '',
        color_code: ''
    }])
    const [size, setSize] = useState([{
        name: '',
        price: ''
    }])
    const [gallery, setGallery] = useState([{image: ''}]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        apiInstance.get(`category/`).then((res) => {
            setCategory(res.data);
        })
    }, [])

    useEffect(() => {
        const fetchProduct = async () => {
            await apiInstance.get(`vendor/update-product/${userData?.vendor_id}/${params.pid}/`)
            .then((res) => {
                setProduct(res.data);
                setSize(res.data.size)
                setColor(res.data.color);
                setGallery(res.data.gallery);
                setSpecifications(res.data.specification);
            })
            .catch((err) => {
                console.log(err.message);
             })
        }
        fetchProduct();
    }, []);

    const handleAddMore = (setStateFunction) => {
        setStateFunction((prevState) => [...prevState, {}])
    }

    const handleRemove = (index, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState]
            newState.splice(index, 1)
            return newState;
        })
    }

    const handleInputChange = (index, field, value, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState]
            newState[index][field] = value
            return newState
        })
    }

    const handleImageChange = (index, event, setStateFunction) => {
        const file = event.target.files[0];
        if (file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setStateFunction((prevState) => {
                    const newState = [...prevState]
                    newState[index].image = {file, preview: reader.result}
                    return newState
                })
            }
            return reader.readAsDataURL(file)
        }
        else{
            setStateFunction((prevState) => {
                const newState = [...prevState]
                newState[index].image = null
                newState[index].preview = null
                return newState
            })
        }
    }

    const handleProductInputChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
    }

    const handleProductFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setProduct({
                    ...product,
                    image: {
                        file: e.target.files[0],
                        preview: reader.result
                    }
                });
            };

            return reader.readAsDataURL(file);
        }
    }

    const urlToFile = async(url, filename, mimeType) => {
        const response = await fetch(url);
        const data = await response.blob();
        return new File([data], filename, {type: mimeType});
    }

    const handleGallery = async(gallery, formData) => {
        let newGallery = [];
        for (let index = 0; index < gallery.length; index++) {
            const item = gallery[index];
            if (item.image) {
                let newItem = {...item}
                if (typeof item.image === 'string' || item.image instanceof String) {
                    let url = new URL(item.image);
                    let pathname = url.pathname.split('/');
                    let filename = pathname[pathname.length - 1];
                    let file = await urlToFile(item.image, filename, 'image/jpeg');
                    newItem.image = file;
                    formData.append(`gallery[${index}][image]`, file);
                } else {
                    formData.append(`gallery[${index}][image]`, item.image.file);
                }
                newGallery.push(newItem);
            }
        }
        setGallery(newGallery);
    }

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };
    
    const csrftoken = getCookie('csrftoken');
    

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let [key, value] of Object.entries(product)) {
            if (key === 'image') {
                if (value !== undefined && value.file !== undefined) {
                    formData.append(key, value.file);
                } else if (typeof value === 'string' || value instanceof String) {
                    let url = new URL(value);
                    let pathname = url.pathname.split('/');
                    let filename = pathname[pathname.length - 1];
                    let file = await urlToFile(value, filename, 'image/jpeg');
                    formData.append(key, file);
                }
            } else {
                formData.append(key, value);
            }
        }
        specifications.forEach((specification, index) => {
            Object.entries(specification).forEach(([key, value]) => {
                formData.append(`specifications[${index}][${key}]`, value)
            })
        })

        color.forEach((color, index) => {
            Object.entries(color).forEach(([key, value]) => {
                formData.append(`color[${index}][${key}]`, value)
            })
        })

        size.forEach((size, index) => {
            Object.entries(size).forEach(([key, value]) => {
                formData.append(`size[${index}][${key}]`, value)
            })
        })

        await handleGallery(gallery, formData)

        try {
            const response = await apiInstance.patch(`vendor/update-product/${userData?.vendor_id}/${params.pid}/`, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrftoken
                }
            })
            Toast.fire({
                icon: "success",
                title: "Product updated successfully",
            })
            navigate(`/vendor/products`)
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
            <Sidebar />
            <div className="col-md-9 col-lg-10 main mt-4">
            <div className="container">
                <form className="form-group"
                    method='POST'
                    encType="multipart/form-data"
                    onSubmit={handleProductSubmit}
                >
                <div className="tab-content" id="pills-tabContent">
                    <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    >
                    <div className="row gutters-sm shadow p-4 rounded">
                        <h4 className="mb-4">Product Details</h4>
                        <div className="col-md-12">
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="row text-dark">
                                <div className="col-lg-6 mb-2">
                                    <label htmlFor="" className="mb-2">
                                    Product Thumbnail
                                    </label>
                                    <input
                                    type="file"
                                    className="form-control"
                                    name="image"
                                    id=""
                                    onChange={handleProductFileChange}
                                    />
                                </div>
                                <div className="col-lg-6 mb-2 ">
                                    <label htmlFor="" className="mb-2">
                                    Title
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    id=""
                                    value={product?.title || ''}
                                    onChange={handleProductInputChange}
                                    />
                                </div>
                                <div className="col-lg-12 mb-2">
                                    <label htmlFor="" className="mb-2">
                                    Description
                                    </label>
                                    <textarea
                                    name="description"
                                    className="form-control"
                                    id=""
                                    cols={30}
                                    rows={10}
                                    value={product?.description || ''}
                                    onChange={handleProductInputChange}
                                    />
                                </div>
                                <div className="col-lg-12 mb-2">
                                    <label htmlFor="" className="mb-2">
                                    Category
                                    </label>
                                    <select
                                    name="category"
                                    className="select form-control"
                                    id=""
                                    value={product?.category || ''}
                                    onChange={handleProductInputChange}
                                    >
                                    <option value="">-- Select --</option>
                                    {category?.map((c, index) => (
                                        <option value={c.id} key={index}>{c.title}</option>
                                    ))}
                                    </select>
                                </div>
                                <div className="col-lg-6 mb-2 ">
                                    <label htmlFor="" className="mb-2">
                                    Sale Price
                                    </label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    id=""
                                    value={product?.price || ''}
                                    onChange={handleProductInputChange}
                                    />
                                </div>
                                <div className="col-lg-6 mb-2 ">
                                    <label htmlFor="" className="mb-2">
                                    Regular Price
                                    </label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    name="old_price"
                                    id=""
                                    value={product?.old_price || ''}
                                    onChange={handleProductInputChange}
                                    />
                                </div>
                                <div className="col-lg-6 mb-2 ">
                                    <label htmlFor="" className="mb-2">
                                    Shipping Amount
                                    </label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    name="shipping_cost"
                                    id=""
                                    value={product?.shipping_cost}
                                    onChange={handleProductInputChange}
                                    />
                                </div>
                                <div className="col-lg-6 mb-2 ">
                                    <label htmlFor="" className="mb-2">
                                    Stock Qty
                                    </label>
                                    <input
                                    type="number"
                                    className="form-control"
                                    name="stock_qty"
                                    id=""
                                    value={product?.stock_qty || ''}
                                    onChange={handleProductInputChange}
                                    />
                                </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div
                    className="tab-pane fade"
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                    >
                    <div className="row gutters-sm shadow p-4 rounded">
                        <h4 className="mb-4">Product Image</h4>
                        <div className="col-md-12">
                        <div className="card mb-3">
                            <div className="card-body">
                            {gallery?.map((item, index) => (
                            <div className="row text-dark" key={index}>
                                <div className='col-lg-6 mb-2'>
                                {item.image && (item.image.preview ? (
                                    <img src={item.image.preview} alt="image"
                                    style={{width: "100%", height: "200px", objectFit: 'contain', borderRadius: '10px'}}
                                    />
                                ): (
                                    <img src={item.image} alt="image"
                                    style={{width: "100%", height: "200px", objectFit: 'contain', borderRadius: '10px'}}
                                    /> 
                                ))
                                }
                                {!item.image &&
                                <img src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg" alt="image"
                                style={{width: "100%", height: "200px", objectFit: 'contain', borderRadius: '10px'}}
                                />
                                }
                                </div>
                                <div className="col-lg-3 mb-2">
                                <input
                                    type="file"
                                    className="form-control"
                                    name=""
                                    id=""
                                    onChange={(e) => handleImageChange(index, e, setGallery)}
                                />
                                </div>
                                <div className="col-lg-3">
                                <button className='btn btn-danger' 
                                onClick={() => handleRemove(index, setGallery)}
                                >Remove</button>
                                </div>
                            </div>
                            ))}
                            <button type='button' onClick={() => handleAddMore(setGallery)} className="btn btn-primary mt-5">
                                <i className="fas fa-plus" /> Add Image
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div
                    className="tab-pane fade"
                    id="pills-contact"
                    role="tabpanel"
                    aria-labelledby="pills-contact-tab"
                    >
                    <div className="row gutters-sm shadow p-4 rounded">
                        <h4 className="mb-4">Specifications</h4>
                        <div className="col-md-12">
                        <div className="card mb-3">
                            <div className="card-body">
                            {specifications?.map((s, index) => (
                            <div className="row text-dark" key={index}>
                                <div className="col-lg-5 mb-2">
                                <label htmlFor="" className="">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name=""
                                    id=""
                                    value={s.title || ''}
                                    onChange={(e) => handleInputChange(index, 'title', e.target.value, setSpecifications)}
                                />
                                </div>
                                <div className="col-lg-5 mb-2">
                                <label htmlFor="" className="">
                                    Content
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name=""
                                    id=""
                                    value={s.content || ''}
                                    onChange={(e) => handleInputChange(index, 'content', e.target.value, setSpecifications)}
                                />
                                </div>
                                <div className="col-lg-2 mb-2">
                                <button type='button' onClick={() => handleRemove(index, setSpecifications)} className='btn btn-danger mt-4'>Remove</button>
                                </div>
                            </div>
                            ))}
                            <button type='button' onClick={() => handleAddMore(setSpecifications)} className="btn btn-primary mt-5">
                                <i className="fas fa-plus" /> Add Specifications
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div
                    className="tab-pane fade"
                    id="pills-size"
                    role="tabpanel"
                    aria-labelledby="pills-size-tab"
                    >
                    <div className="row gutters-sm shadow p-4 rounded">
                        <h4 className="mb-4">Size</h4>
                        <div className="col-md-12">
                        <div className="card mb-3">
                            <div className="card-body">
                            {size?.map((size, index) => (<div className="row text-dark" key={index}>
                                <div className="col-lg-5 mb-2">
                                <label htmlFor="" className="">
                                    Size
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name=""
                                    id=""
                                    value={size.name || ''}
                                    onChange={(e) => handleInputChange(index, 'name', e.target.value, setSize)}
                                />
                                </div>
                                <div className="col-lg-5 mb-2">
                                <label htmlFor="" className="">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name=""
                                    id=""
                                    value={size.price || ''}
                                    onChange={(e) => handleInputChange(index, 'price', e.target.value, setSize)}
                                />
                                </div>
                                <div className='col-lg-2 mb-2'>
                                    <button type='button' onClick={() => handleRemove(index, setSize)} className='btn btn-danger mt-4'>Remove</button>
                                </div>
                            </div>))}
                            <button type='button' onClick={() => handleAddMore(setSize)} className="btn btn-primary mt-5">
                                <i className="fas fa-plus" /> Add Size
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div
                    className="tab-pane fade"
                    id="pills-color"
                    role="tabpanel"
                    aria-labelledby="pills-color-tab"
                    >
                    <div className="row gutters-sm shadow p-4 rounded">
                        <h4 className="mb-4">Color</h4>
                        <div className="col-md-12">
                        <div className="card mb-3">
                            <div className="card-body">
                            {color?.map((c, index) => (
                            <div className="row text-dark" key={index}>
                                <div className="col-lg-5 mb-2">
                                <label htmlFor="" className="">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name=""
                                    id=""
                                    value={c.name || ''}
                                    onChange={(e) => handleInputChange(index, 'name', e.target.value, setColor)}
                                />
                                </div>
                                <div className="col-lg-5 mb-2">
                                <label htmlFor="" className="">
                                    Code
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name=""
                                    id=""
                                    value={c.color_code || ''}
                                    onChange={(e) => handleInputChange(index, 'color_code', e.target.value, setColor)}
                                />
                                </div>
                                <div className="col-lg-2 mb-2">
                                <button type='button' onClick={() => handleRemove(index, setColor)} className='btn btn-danger mt-4'>Remove</button>
                                </div>
                            </div>
                            ))}
                            <button type='button' onClick={() => handleAddMore(setColor)} className="btn btn-primary mt-5">
                                <i className="fas fa-plus" /> Add Color
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div>
                    <ul
                        className="nav nav-pills mb-3 d-flex justify-content-center mt-5"
                        id="pills-tab"
                        role="tablist"
                    >
                        <li className="nav-item" role="presentation">
                        <button
                            className="nav-link active"
                            id="pills-home-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-home"
                            type="button"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                        >
                            Basic Information
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="pills-profile-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-profile"
                            type="button"
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected="false"
                        >
                            Gallery
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="pills-contact-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-contact"
                            type="button"
                            role="tab"
                            aria-controls="pills-contact"
                            aria-selected="false"
                        >
                            Specifications
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="pills-size-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-size"
                            type="button"
                            role="tab"
                            aria-controls="pills-size"
                            aria-selected="false"
                        >
                            Size
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="pills-color-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-color"
                            type="button"
                            role="tab"
                            aria-controls="pills-color"
                            aria-selected="false"
                        >
                            Color
                        </button>
                        </li>
                    </ul>
                    <div className="d-flex justify-content-center mb-5">
                        <button type='submit' className="btn btn-success w-50">
                        Update Product <i className="fa fa-check-circle" />{" "}
                        </button>
                    </div>
                    </div>
                </div>
                </form>
            </div>
            </div>
        </div>
        </div>
    )
}

export default UpdateProduct