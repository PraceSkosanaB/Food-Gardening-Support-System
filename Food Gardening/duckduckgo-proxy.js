// DuckDuckGo real-time proxy for chatbot
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3001;

function fetchDuckDuckGo(query, callback) {
	const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
	https.get(apiUrl, (res) => {
		let data = '';
		res.on('data', chunk => data += chunk);
		res.on('end', () => {
			try {
				const json = JSON.parse(data);
				callback(null, json);
			} catch (err) {
				callback(err);
			}
		});
	}).on('error', (err) => callback(err));
}

const server = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url, true);
	if (parsedUrl.pathname === '/duckduckgo' && parsedUrl.query.q) {
		fetchDuckDuckGo(parsedUrl.query.q, (err, answer) => {
			res.setHeader('Content-Type', 'application/json');
			if (err) {
				res.statusCode = 500;
				res.end(JSON.stringify({ error: 'DuckDuckGo API error', details: err.toString() }));
			} else {
				// Return relevant answer fields for chatbot
				res.end(JSON.stringify({
					answer: answer.Answer || answer.AbstractText || '',
					heading: answer.Heading || '',
					related: answer.RelatedTopics || [],
					image: answer.Image || '',
					raw: answer
				}));
			}
		});
	} else {
		res.statusCode = 404;
		res.end(JSON.stringify({ error: 'Invalid endpoint or missing query' }));
	}
});

server.listen(PORT, () => {
	console.log(`DuckDuckGo proxy running on port ${PORT}`);
});
