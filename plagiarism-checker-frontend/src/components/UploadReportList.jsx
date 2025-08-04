import { useEffect, useState } from "react"
import axios from "axios"

const UploadedReportList = () => {
    const [reports, setReports] = useState([])

    useEffect(() => {
        axios.get("/reports")
        .then((res) => setReports(res.data))
        .catch((err) => console.error(err))
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Daftar Laporan yang Sudah Diupload</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm">
                    <th className="px-4 py-2">Nama File</th>
                    <th className="px-4 py-2">Uploader</th>
                    <th className="px-4 py-2">Tanggal Upload</th>
                    <th className="px-4 py-2">Jumlah File</th>
                    <th className="px-4 py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((r, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 text-sm">
                        <td className="px-4 py-2">{r.filename}</td>
                        <td className="px-4 py-2">{r.uploaded_by}</td>
                        <td className="px-4 py-2">{new Date(r.uploaded_at).toLocaleString()}</td>
                        <td className="px-4 py-2">{r.total_files}</td>
                        <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-white text-xs ${r.status === 'done' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                            {r.status === 'done' ? 'Selesai' : 'Sedang Diproses'}
                        </span>
                        </td>
                    </tr>
                    ))}
                    {reports.length === 0 && (
                    <tr>
                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500">Belum ada laporan yang diupload.</td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
    )
}

export default UploadedReportList
