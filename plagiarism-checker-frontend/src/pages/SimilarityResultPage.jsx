/** SimilarityResultPage.jsx */
import { useEffect, useState, useMemo } from 'react'
import MainLayout from '../layouts/MainLayout'
import { CSVLink } from 'react-csv'

const SimilarityResultPage = () => {
    const [results, setResults] = useState([])
    const [sortKey, setSortKey] = useState(null)
    const [sortOrder, setSortOrder] = useState(null)

    const fetchResults = async () => {
        const lastResult = localStorage.getItem('lastAnalysisResult')
        if (!lastResult) return
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

        setResults(uniquePairs)
    }

    useEffect(() => {
        fetchResults()
    }, [])

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

    const sortedResults = useMemo(() => {
        if (!sortKey || !sortOrder) return results
        return [...results].sort((a, b) => {
            return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
        })
    }, [results, sortKey, sortOrder])

    const getArrow = (key) => {
        if (sortKey !== key) return ''
        if (sortOrder === 'asc') return ' ↓'
        if (sortOrder === 'desc') return ' ↑'
        return ''
    }

    return (
        <MainLayout>
            <h1 className="text-2xl font-bold mb-4">Hasil Analisis Kesamaan Dokumen</h1>

            <div className="mb-4">
                <CSVLink
                    data={results.map(r => ({
                        dokumen_1: r.doc1,
                        dokumen_2: r.doc2,
                        tfidf: (r.tfidf * 100).toFixed(2) + '%',
                        bert: (r.bert * 100).toFixed(2) + '%',
                        ngram: (r.ngram * 100).toFixed(2) + '%',
                        plagiat: r.plagiat
                    }))}
                    filename="hasil_analisis_keseluruhan.csv"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Export CSV
                </CSVLink>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded">
                <table className="w-full table-auto border-collapse rounded overflow-hidden shadow-md">
                    <thead>
                        <tr className="bg-black text-white font-bold">
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
                            <th className="p-3 bg-red-800 text-white">Plagiat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedResults.map((r, i) => (
                            <tr
                                key={i}
                                className={`transition duration-200 border-b font-normal ${
                                    r.plagiat === 'Ya' ? 'bg-red-100 hover:bg-red-200 hover:font-semibold' 
                                    : 'hover:bg-green-100 hover:font-semibold'
                                }`}
                            >
                                <td className="p-3 break-words max-w-xs whitespace-normal">{r.doc1}</td>
                                <td className="p-3 break-words max-w-xs whitespace-normal">{r.doc2}</td>
                                <td className="p-3 break-words max-w-xs whitespace-normal">{(r.tfidf * 100).toFixed(2)}%</td>
                                <td className="p-3 break-words max-w-xs whitespace-normal">{(r.bert * 100).toFixed(2)}%</td>
                                <td className="p-3 break-words max-w-xs whitespace-normal">{(r.ngram * 100).toFixed(2)}%</td>
                                <td
                                    className={`p-3 break-words max-w-xs whitespace-normal font-semibold text-center ${
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
        </MainLayout>
    )
}

export default SimilarityResultPage
