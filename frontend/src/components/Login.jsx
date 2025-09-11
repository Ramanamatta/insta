import React, { useEffect } from "react";
import { useState } from "react";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";


import useAuthStore from "../just/authStore.js";


const Login = () => {

    const setAuthUser = useAuthStore((state) => state.setAuthUser);

    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    };

    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
    const user=useAuthStore(store=>store.user);
    const API_URL = import.meta.env.VITE_API_URL;

    const signUpHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post(
                `${API_URL}/api/v1/user/login`,
                input,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                setAuthUser(res.data.user);
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: "",
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        if(user){
            navigate('/');
        }
    })
    return (
        <div className="flex items-center w-screen h-screen justify-center">
            <form
                onSubmit={signUpHandler}
                className="shadow-lg flex flex-col gap-5 p-8"
            >
                <div className="my-4">
                    <h1 className="text-center font-bold text-xl">LOGO</h1>
                    <p className="text-sm text-center">
                        Login to see photos and videos from your friends
                    </p>
                </div>
                <div>
                    <span className="font-medium">Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className="font-medium">Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>

                    ):(
                        <Button type="submit">Login</Button>
                    )
                }
                
                 <span className="text-center">Doesn't have an account?<Link to="/signup" className="text-blue-600">Signup</Link></span>

            </form>
        </div>
    );
};
export default Login;
