import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { toast } from 'react-toastify'

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
            localStorage.setItem('token', res.data.access_token)

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
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded shadow-md w-96 space-y-4"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login
