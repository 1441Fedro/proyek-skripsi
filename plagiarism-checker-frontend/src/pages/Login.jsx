import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { toast } from 'react-toastify'
import labKomputer from '../assets/lab-komputer.jpg'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/auth/login', { username, password })

            // Simpan token
            localStorage.setItem('access_token', res.data.access_token)

            // Simpan user (gabungkan info yang dibutuhkan)
            const user = {
                username: res.data.username,
                role: res.data.role
            }
            localStorage.setItem('user', JSON.stringify(user))

            toast.success("Login Berhasil.")
            navigate('/dashboard')
            console.log("Login response:", res.data);

        } catch (err) {
            console.error("Login error:", err)
            setError('Login gagal, periksa kembali username dan password')
            toast.error("Login gagal, periksa kembali username dan password")
        }
    }

    return (
        <div className="flex h-screen w-full">
            {/* Sisi Kiri: Gambar Lab Komputer */}
            <div className="hidden lg:block lg:w-1/2">
                <img
                    src={labKomputer}
                    alt="Lab Komputer"
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Sisi Kanan: Form Login dengan Gradien Ungu ke Biru */}
            <div className="w-full lg:w-1/2 flex items-center justify-center 
                        bg-gradient-to-br from-purple-700 to-blue-500">
                <div className="p-8 w-full max-w-md">
                    
                    {/* Card Form Login Putih dengan Sudut Membulat */}
                    <form
                        onSubmit={handleLogin}
                        className="bg-white p-10 rounded-3xl shadow-2xl space-y-6"
                    >
                        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                            Welcome Back! 👋
                        </h1>
                        <p className="text-center text-gray-600 mb-6">
                            Sign in to your account
                        </p>

                        {error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        
                        {/* Input Username */}
                        <div className="space-y-1">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                required
                            />
                        </div>

                        {/* Input Password */}
                        <div className="space-y-1">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                required
                            />
                        </div>

                        {/* Opsi Ingat Saya & Lupa Password */}
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="h-4 w-4 text-blue-600 rounded" />
                                <label htmlFor="remember" className="ml-2 text-gray-600">Remember me</label>
                            </div>
                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Forgot password?</a>
                        </div>


                        {/* Tombol Login (Gradien) */}
                        <button
                            type="submit"
                            className="w-full p-3 text-white rounded-xl font-semibold 
                                       bg-gradient-to-r from-blue-600 to-purple-600 
                                       hover:from-blue-700 hover:to-purple-700 transition duration-200 shadow-lg"
                        >
                            LOG IN
                        </button>
                    </form>

                    {/* Registrasi */}
                    <p className="mt-6 text-center text-sm text-white">
                        Don't have an account? 
                        <a href="/register" className="font-bold ml-1 hover:text-blue-200">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
