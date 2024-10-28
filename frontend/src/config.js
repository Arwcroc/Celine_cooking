export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ? 
	process.env.REACT_APP_BACKEND_URL : 
	process.env.NODE_ENV === 'development' ? 
		"http://localhost:5001" : 
		""