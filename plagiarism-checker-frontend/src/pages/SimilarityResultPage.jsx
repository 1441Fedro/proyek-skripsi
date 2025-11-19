/** SimilarityResultPage.jsx */
import { useEffect, useState, useMemo } from 'react'
import MainLayout from '../layouts/MainLayout'
import ResultTable from '../components/ResultTable'; 

const SimilarityResultPage = () => {
    const [rawResults, setRawResults] = useState([]) // Data mentah
    const [loading, setLoading] = useState(true)
    
    // ✅ STATE SORTING
    const [sortKey, setSortKey] = useState(null)
    const [sortOrder, setSortOrder] = useState(null) // 'asc', 'desc', atau null

    const fetchResults = () => {
        setLoading(true);
        const lastResult = localStorage.getItem('lastAnalysisResult')
        
        if (!lastResult) {
            setLoading(false);
            setRawResults([]);
            return;
        }

        const pairs = JSON.parse(lastResult)

        const seen = new Set()
        const uniquePairs = []
        pairs.forEach(pair => {
            const key1 = `${pair.doc1}|${pair.doc2}`
            const key2 = `${pair.doc2}|${pair.doc1}`
            if (!seen.has(key1) && !seen.has(key2)) {
                seen.add(key1)
                uniquePairs.push(pair)
            }
        })

        setRawResults(uniquePairs)
        setLoading(false);
    }

    useEffect(() => {
        fetchResults()
    }, [])

    // ✅ FUNGSI PENGURUTAN TRI-STATE
    const handleSort = (key) => {
        if (sortKey !== key) {
            // Kolom baru diklik: Sort 'asc'
            setSortKey(key);
            setSortOrder('asc');
        } else if (sortOrder === 'asc') {
            // Sudah 'asc', klik lagi: Sort 'desc'
            setSortOrder('desc');
        } else if (sortOrder === 'desc') {
            // Sudah 'desc', klik lagi: Kembali ke awal (null)
            setSortKey(null);
            setSortOrder(null);
        } else {
            // Kembali dari null ke 'asc' (jika sudah di-reset)
            setSortKey(key);
            setSortOrder('asc');
        }
    }

    // ✅ LOGIKA SORTING DATA
    const sortedResults = useMemo(() => {
        if (!sortKey || !sortOrder) {
            return rawResults; // Tampilan awal (berdasarkan urutan API/Load)
        }

        const sorted = [...rawResults].sort((a, b) => {
            let aValue, bValue;

            // Handle sorting untuk kolom persentase (diubah ke float) dan 'Plagiat'
            if (['tfidf', 'bert', 'ngram'].includes(sortKey)) {
                aValue = a[sortKey]; // Nilai sudah berupa float dari API
                bValue = b[sortKey];
            } else if (sortKey === 'plagiat') {
                aValue = a.plagiat === 'Ya' ? 1 : a.plagiat === 'Tidak' ? 0 : 2;
                bValue = b.plagiat === 'Ya' ? 1 : b.plagiat === 'Tidak' ? 0 : 2;
            } else {
                // Sorting string untuk doc1/doc2
                aValue = a[sortKey].toLowerCase();
                bValue = b[sortKey].toLowerCase();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [rawResults, sortKey, sortOrder]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-700 to-purple-500 p-8">
            <MainLayout>
                <div className="max-w-7xl mx-auto py-8">
                    <h1 className="text-3xl font-extrabold mb-8 text-white text-center">
                        <span className="bg-white text-transparent bg-clip-text">LAPORAN</span> HASIL ANALISIS
                    </h1>

                    {loading ? (
                        <div className="text-white text-center p-8 bg-slate-900/50 rounded-xl">Memuat hasil analisis...</div>
                    ) : rawResults.length > 0 ? (
                        // ✅ Meneruskan data yang sudah diurutkan dan fungsi sorting
                        <ResultTable 
                            results={sortedResults} 
                            handleSort={handleSort}
                            sortKey={sortKey}
                            sortOrder={sortOrder}
                        />
                    ) : (
                        <div className="text-white text-center p-8 bg-slate-900/50 rounded-xl">
                            Belum ada hasil analisis yang tersimpan. Harap unggah dan jalankan analisis di halaman Upload.
                        </div>
                    )}
                </div>
            </MainLayout>
        </div>
    )
}

export default SimilarityResultPage