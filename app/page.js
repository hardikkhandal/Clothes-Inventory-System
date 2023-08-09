"use client"
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const [productForm, setproductForm] = useState({})
  const [products, setproducts] = useState([])
  const [alert, setalert] = useState("")
  const [query, setquery] = useState()
  const [loading, setloading] = useState(false)
  const [loadingaction, setloadingaction] = useState(false)
  const [dropdown, setdropdown] = useState([])
  const [popup, setpopup] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product');
      let rjson = await response.json();
      setproducts(rjson.products);
    }
    fetchProducts()

  }, [])

  const deletebuttononpopbox =async (slug) => {
    let deleteindex = products.findIndex((item) => item.slug == slug)
    let zerproduct = JSON.parse(JSON.stringify(products));
    zerproduct[deleteindex].quantity = parseInt(0);
    setproducts(zerproduct)

    //delete the quanrtity in dropdown
    let indexdropdelete = dropdown.findIndex((item) => item.slug == slug)
    let zerodropdown = JSON.parse(JSON.stringify(dropdown));
    zerodropdown[indexdropdelete].quantity = parseInt(0);
    setdropdown(zerodropdown)

    setloadingaction(true);
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug })
    });
    console.log(response.json());
    setloadingaction(false)
  };


  const buttonAction = async (action, slug, initialQuanitity) => {
    //change the quantity in products
    let index = products.findIndex((item) => item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products));


    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuanitity) + 1
    } else {
      newProducts[index].quantity = parseInt(initialQuanitity) - 1
    }
    setproducts(newProducts)

    //change the quantity in dropdown
    let indexdrop = dropdown.findIndex((item) => item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuanitity) + 1
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuanitity) - 1
    }
    setdropdown(newDropdown)

    setloadingaction(true);
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, slug, initialQuanitity })
    });
    console.log(response.json());
    setloadingaction(false)
  }



  const addProduct = async (e) => {

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm)
      });

      if (response.ok) {
        console.log('Product added successfully');
        setalert("Your product has been added");
        setproductForm({});
      } else {
        console.log('Failed to add product');
      }
    } catch (error) {
      console.log('Error adding product:', error);
    }
    const response = await fetch('/api/product');
    let rjson = await response.json();
    setproducts(rjson.products);
    e.preventDefault();
  };


  const handleChange = (e) => {
    setproductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const dropdownEdit = async (e) => {
    let value = e.target.value
    setquery(value)
    if (value.length > 3) {
      setloading(true)
      setdropdown([])
      const response = await fetch('/api/search?query=' + query);
      let rjson = await response.json();
      setdropdown(rjson.products);
      setloading(false);
    } else {
      setdropdown([])
    }
  }


  return (
    <>
      <Header />
      
      <div className="container bg-gray-200 mx-auto w-full px-4 py-4 rounded-lg">
        <div className="text-green-800 text-center ">{alert}</div>
        <h1 className="text-2xl font-semibold mb-2">Search a product</h1>
        <div className="flex items-center mb-2 w-full">
          <input onChange={dropdownEdit} type="text" placeholder="Search" className="border rounded-l p-2 w-full" />
          <select className="border rounded-r px-2 py-1">
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="outofstock">Out of Stock</option>
          </select>
        </div>
        {loading && <div className="flex justify-center items-center"><svg viewBox="0 0 100 100" width="50" height="50">
          <circle fill="none" stroke="black" stroke-width="5" stroke-dasharray="10 10" cx="50" cy="50" r="40">
            <animateTransform attributeName="transform" type="rotate" dur="2s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
          </circle>
        </svg></div>
        }
        <div>
          <div className="dropdowncontainer w-5/6 absolute border-1 bg-purple-100 rounded-md" >
            {dropdown.map(item => {
              return (
                <>
                <div key={item.slug} className="container flex justify-between my-3 px-3 py-3 border-b-2">
                  <span className="slug">{item.slug} (Available {item.quantity} at ₹{item.price} )</span>
                  <div className="mx-5 flex justify-content items-center">
                    <button onClick={() => { buttonAction("minus", item.slug, item.quantity) }} disabled={loadingaction} className="subtract cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"> - </button>
                    <span className="quantity inline-block w-3 mx-3">{item.quantity}</span>
                    <button onClick={() => { buttonAction("plus", item.slug, item.quantity) }} disabled={loadingaction} className="subtract cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"> + </button>
                    <button onClick={() => { deletebuttononpopbox(item.slug) }} disabled={loadingaction} className="delete cursor-pointer inline-block px-3 py-1 mx-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"> Delete All</button>
                  </div>
                </div>
                
          </>
                )
            }
            )
            }
          </div>
        </div>


        {/* Display Current Stock */}
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold mb-4">Add a product</h1>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">Product Slug</label>
              <input value={productForm?.slug || ""} name="slug" onChange={handleChange} type="text" id="name" className="w-full border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label htmlFor="quantity" className="block mb-2">Quantity:</label>
              <input value={productForm?.quantity || ""} name="quantity" onChange={handleChange} type="number" id="quantity" className="w-full border border-gray-300 px-4 py-2 mb-2" />
            </div>
            <div>
              <label htmlFor="price" className="block mb-2">Price</label>
              <input value={productForm?.price || ""} name="price" onChange={handleChange} type="number" id="price" className="w-full border border-gray-300 px-4 py-2 mb-2" />
            </div>
            <button onClick={addProduct} type="submit" className="bg-blue-500 text-white px-4 py-2">Add Product</button>
          </form>
        </div>

        <div className="container my-8 mx-auto">
          <h1 className="text-3xl font-semibold mb-2">Display the Product</h1>
          <table className="table-auto w-full border-black border-2 border-black">
            <thead>
              <tr>
                <th className="px-4 py-2 border border border-gray bg-black text-white">Product Name</th>
                <th className="px-4 py-2 border border border-gray bg-black text-white">Quantity</th>
                <th className="px-4 py-2 border border border-gray bg-black text-white">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className="my-3 mx-3" key={product.slug}>
                  <td className="px-4 py-4 border border-l-3 border-black">{product.slug}</td>
                  <td className=" px-4 py-2 border border-l-3 border-black">{product.quantity}</td>
                  <td className=" px-4 py-2 border border-l-3 border-black">₹{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      );

}