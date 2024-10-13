import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './DocumentSearch.css';  // Import the CSS file

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DocumentSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [similarities, setSimilarities] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
            setSimilarities(data.map(item => item.similarity));
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again.');
        }
    };

    const data = {
        labels: results.map((_, index) => `Document ${index + 1}`),
        datasets: [
            {
                label: 'Cosine Similarity',
                data: similarities,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <>
        <h1>Latent Semantic Analysis (LSA) Search Engine</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your query..."
            />
            <button onClick={handleSearch}>Search</button>
            <h2>Results</h2>
            {results.map((result, index) => (
                <li key={index}>
                    <h3>{`Document ${result.document_number}`}</h3> {/* Display actual document number */}
                    <p>{result.content}</p> {/* Document content */}
                    <p className="similarity">{`Similarity: ${result.similarity.toFixed(4)}`}</p>
                </li>
            ))}
            {/* Conditionally render the graph */}
            {query && results.length > 0 && (
                <div className="bar-chart">
                    <Bar data={data} />
                </div>
            )}
        </>
            

    );
};

export default DocumentSearch;
