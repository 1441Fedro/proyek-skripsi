import MainLayout from '../layouts/MainLayout'
import { useState, useMemo, useEffect } from 'react'
import api from '../api/api'
import { CSVLink } from 'react-csv'
import { useNavigate } from 'react-router-dom'

const UploadPage = () => {
    const [files, setFiles] = useState([])
    const [message, setMessage] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [results, setResults] = useState([])
    // const [uploadedFileNames, setUploadedFileNames] = useState([])
    const [uploadedTextHashes, setUploadedTextHashes] = useState([])
    const [selectedDoc, setSelectedDoc] = useState('')
    const [sortKey, setSortKey] = useState(null)
    const [sortOrder, setSortOrder] = useState(null)
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        setFiles([...files, ...e.target.files])
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setFiles([...files, ...Array.from(e.dataTransfer.files)])
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        setIsUploading(true)
        setMessage('')

        const formData = new FormData()
        files.forEach((file) => {
            formData.append('files', file)
        })
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            // const names = (res.data.extracted || []).map(f => f.filename)
            // setUploadedFileNames(names)
            const hashes = (res.data.extracted || []).map(f => f.text_hash)
            setUploadedTextHashes(hashes)
            // ✅ simpan batch_id dari server
            const batch = res.data.batch_id
            console.log("📦 Batch ID:", batch)
            // opsional: simpan ke localStorage atau state
            localStorage.setItem('lastBatchId', batch)
            setMessage(res.data.message || 'Laporan berhasil diupload!')
        } catch (err) {
            console.error("Upload error:", err)
            setMessage('Upload gagal. Periksa kembali format file.')
        }
        setIsUploading(false)
        setFiles([])
    }
    const handleAnalyze = async () => {
        const batchId = localStorage.getItem('lastBatchId')
        if (!batchId) {
            setMessage("Tidak ada batch yang tersedia untuk dianalisis")
            return
        }
        // if (uploadedTextHashes.length === 0) {
        //     setMessage("Tidak ada dokumen yang diupload.")
        //     return
        // }
        setIsAnalyzing(true)
        setMessage('Analisis sedang diproses...')
        try {
            const res = await api.post('/analisis/run', {
                // TANDA
                // text_hashes: uploadedTextHashes
                batch_id: batchId
            })
            console.log("📬 Response dari analisis:", res.data)  // DEBUG

            if (res.data?.pairs) {
                localStorage.setItem('lastAnalysisResult', JSON.stringify(res.data.pairs))
                setResults(res.data.pairs)
                if (res.data.pairs.length > 0) {
                    setSelectedDoc(res.data.pairs[0].doc1); // Otomatis pilih salah satu dokumen
                }
                setMessage('Analisis selesai! Pilih dokumen untuk melihat hasil.')
                navigate('/result');
            } else {
                setMessage(res.data.message || "Analisis tidak menghasilkan output.")
            }
        } catch (err) {
            console.error('Analysis error:', err)
            setMessage('Gagal melakukan analisis. Coba lagi nanti.')
        }
        setIsAnalyzing(false)
    }

    useEffect(() => {
        const lastResult = localStorage.getItem('lastAnalysisResult');
        if (lastResult) {
            const parsed = JSON.parse(lastResult);
            setResults(parsed);
            if (parsed.length > 0) {
                setSelectedDoc(parsed[0].doc1);
            }
        }
    }, []);

    const filteredResults = useMemo(() => {
        return results.filter(r => r.doc1 === selectedDoc || r.doc2 === selectedDoc)
    }, [results, selectedDoc])

    const sortedResults = useMemo(() => {
        const sorted = [...filteredResults].sort((a, b) => {
            if (sortOrder === 'asc') return a[sortKey] - b[sortKey]
            else return b[sortKey] - a[sortKey]
        })
        return sorted
    }, [filteredResults, sortKey, sortOrder])

    const handleSort = (key) => {
        if (sortKey === key) {
            if (sortOrder === 'asc') setSortOrder('desc')
            else if (sortOrder === 'desc') {
                setSortKey(null)
                setSortOrder(null)
            } else setSortOrder('asc')
        } else {
            setSortKey(key)
            setSortOrder('asc')
        }
    }

    const getArrow = (key) => {
        if (sortKey !== key) return ''
        if (sortOrder === 'asc') return ' ↓'
        if (sortOrder === 'desc') return ' ↑'
        return ''
    }

    return (
        <MainLayout>
            <h2 className="text-2xl font-bold mb-4">Upload Laporan Akhir</h2>
            {message && <p className="mb-4 text-blue-600">{message}</p>}

            {/* Drag and Drop Zone */}
            <div
                className="w-full border-2 border-dashed border-gray-400 rounded p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <p className="text-gray-600">Drag & Drop file ke sini atau klik untuk memilih</p>
                <p className="text-sm text-gray-500 mt-1">Mendukung banyak file (.zip, .rar, .pdf, .docx)</p>
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept=".pdf,.docx,.zip,.rar"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
            {files.map((f, i) => (
                <div
                key={i}
                className="flex items-center space-x-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                <span className="truncate max-w-xs">
                    {f.name} ({(f.size / 1024).toFixed(1)} KB)
                </span>
                <button
                    onClick={() => {
                    const updatedFiles = files.filter((_, idx) => idx !== i)
                    setFiles(updatedFiles)
                    }}
                    className="text-blue-800 hover:text-red-600 font-bold focus:outline-none"
                    title="Hapus file"
                >
                    ×
                </button>
                </div>
            ))}
            </div>

            <form onSubmit={handleUpload} className="mt-4">
                <button
                    type="submit"
                    disabled={isUploading}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    {isUploading ? 'Mengupload...' : 'Upload'}
                </button>
            </form>

            <div className="mt-6">
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || uploadedTextHashes.length === 0}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                    {isAnalyzing ? 'Menganalisis...' : 'Analisis'}
                </button>
            </div>

            {results.length > 0 && (
                <div className="mt-10">
                    <label className="block mb-2 font-semibold">Pilih Dokumen untuk melihat hasil perbandingan:</label>
                    <select
                        value={selectedDoc}
                        onChange={(e) => setSelectedDoc(e.target.value)}
                        className="mb-4 border p-2 rounded w-full"
                    >
                        <option value="">-- Pilih Dokumen --</option>
                        {[...new Set(results.flatMap(r => [r.doc1, r.doc2]))].map((doc, i) => (
                            <option key={i} value={doc}>{doc}</option>
                        ))}
                    </select>

                    {selectedDoc && (
                        <>
                            <div className="mb-4">
                                <CSVLink
                                    data={filteredResults.map((r) => ({
                                        dokumen_1: r.doc1,
                                        dokumen_2: r.doc2,
                                        tfidf: (r.tfidf * 100).toFixed(2) + '%',
                                        bert: (r.bert * 100).toFixed(2) + '%',
                                        ngram: (r.ngram * 100).toFixed(2) + '%',
                                        plagiat: r.plagiat
                                    }))}
                                    filename="hasil_analisis_sebagian.csv"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Export CSV
                                </CSVLink>
                            </div>

                            <div className="overflow-x-auto bg-white shadow rounded">
                                <table className="w-full table-auto border-collapse rounded overflow-hidden shadow-md">
                                    <thead className="bg-black text-white font-bold">
                                        <tr>
                                            <th className="p-3 border-r-2">Dokumen 1</th>
                                            <th className="p-3 border-r-2">Dokumen 2</th>
                                            <th className="p-3 cursor-pointer border-r-2" onClick={() => handleSort('tfidf')}>
                                                TF-IDF{getArrow('tfidf')}
                                            </th>
                                            <th className="p-3 cursor-pointer border-r-2" onClick={() => handleSort('bert')}>
                                                BERT{getArrow('bert')}
                                            </th>
                                            <th className="p-3 cursor-pointer border-r-2" onClick={() => handleSort('ngram')}>
                                                N-Gram{getArrow('ngram')}
                                            </th>
                                            <th className="p-2 border-r-2 bg-red-800 text-white">Plagiat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedResults.map((r, i) => (
                                            <tr 
                                                key={i}
                                                className={`transition-all duration-200 border-b font-normal ${
                                                    r.plagiat === 'Ya' ? 'bg-red-100 hover:bg-red-200 hover:font-semibold' 
                                                    : 'hover:bg-green-100 hover:font-semibold'
                                                }`}
                                            >
                                                <td className="p-2 break-words max-w-xs whitespace-normal">{r.doc1}</td>
                                                <td className="p-2 break-words max-w-xs whitespace-normal">{r.doc2}</td>
                                                <td className="p-2 break-words max-w-xs whitespace-normal">{(r.tfidf * 100).toFixed(2)}%</td>
                                                <td className="p-2 break-words max-w-xs whitespace-normal">{(r.bert * 100).toFixed(2)}%</td>
                                                <td className="p-2 break-words max-w-xs whitespace-normal">{(r.ngram * 100).toFixed(2)}%</td>
                                                <td
                                                    className={`p-3 break-words max-w-xs whitespace-normal font-medium text-center ${
                                                        r.plagiat === 'Ya' ? 'bg-red-200 text-red-800' : 'bg-green-100'
                                                    }`}
                                                >
                                                {r.plagiat}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}
            {results.length === 0 && (
                <p className="text-red-500 mt-6">Belum ada hasil analisis atau dokumen tidak valid.</p>
            )}
        </MainLayout>
    )
}

export default UploadPage