import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Input } from './ui/input.jsx'; // assume you have input component
import { Button } from './ui/button.jsx';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

import useProductStore from '../just/productStore.js';
import useAuthStore from '../just/authStore.js';

const AddProduct = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  // product fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);

  const fileChangeHandler = async (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const dataUrl = await readFileAsDataURL(selected);
      setImagePreview(dataUrl);
    }
  };

  const createProductHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("stock", stock);
    if (imagePreview) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/v1/post/products/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (res.data.success) {
        setProducts([res.data.product, ...products]);
        toast.success(res.data.message);
        // reset
        setOpen(false);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setStock("");
        setFile("");
        setImagePreview("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">Add New Product</DialogHeader>

        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" />
        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <Input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" type="number" />

        {imagePreview && (
          <div className='w-full h-64 flex items-center justify-center'>
            <img src={imagePreview} alt='preview_img' className='w-full h-full object-cover rounded-md' />
          </div>
        )}

        <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select Product Image
        </Button>

        {imagePreview && (
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please Wait...
            </Button>
          ) : (
            <Button onClick={createProductHandler} type="submit" className="w-full">Add Product</Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
