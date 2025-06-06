import { useState, useEffect } from "react";
import axios from 'axios'

export default function useCategory(){
    const [categories, setCategories] = useState([])

    // get categories 
    const getCategories = async () => {
        try {
            const {data} = await axios.get('/api/v1/category/get-category');
        console.log(data);   
            setCategories(data?.categories)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getCategories()
    }, [])
    return categories;
}