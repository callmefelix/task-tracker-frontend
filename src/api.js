// src/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

let authToken = null; // This will store the JWT

export const setAuthToken = (token) => {
    authToken = token;
    if (token) {
        localStorage.setItem('jwt_token', token);
        console.log("setAuthToken: Token saved to localStorage.");
    } else {
        localStorage.removeItem('jwt_token');
        console.log("setAuthToken: Token removed from localStorage.");
    }
};

export const getAuthToken = () => {
    if (!authToken) {
        authToken = localStorage.getItem('jwt_token');
        console.log("getAuthToken: Retrieving token from localStorage. Found:", !!authToken);
    }
    return authToken;
};

async function apiCall(endpoint, method = 'GET', data = null, requiresAuth = true) {
    console.log(`apiCall: Initiating ${method} to ${API_BASE_URL}${endpoint}`);

    const headers = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        const token = getAuthToken();
        console.log(`apiCall for ${endpoint}: requiresAuth=${requiresAuth}, token present=${!!token}`);
        if (!token) {
            console.error(`apiCall for ${endpoint}: No authentication token found. Cannot make authenticated request.`);
            setAuthToken(null); // Clear possibly stale token
            throw new Error("Unauthorized: No token available.");
        }
        headers['Authorization'] = `Bearer ${token}`;
        console.log(`apiCall for ${endpoint}: Authorization header set.`);
    } else {
        console.log(`apiCall for ${endpoint}: requiresAuth=false. No Authorization header needed.`);
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
        console.log(`apiCall for ${endpoint}: Request body set.`, config.body);
    }

    try {
        console.log(`apiCall for ${endpoint}: Fetching with config:`, config);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        console.log(`apiCall for ${endpoint}: Received response. Status: ${response.status}`);

        if (response.status === 401 || response.status === 403) {
            console.error(`apiCall for ${endpoint}: Authentication failed or token expired. Status: ${response.status}`);

            // Only redirect to login if this is an authenticated request (not login/register)
            // This prevents redirect during login failure which would cause error message to disappear
            if (requiresAuth && !endpoint.includes('/auth/token') && !endpoint.includes('/auth/register')) {
                setAuthToken(null);
                window.location.href = '/login'; // Redirect for expired tokens during normal API usage
            }

            // Get error message from response
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.error || errorData.message || "Authentication failed");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            console.error(`apiCall for ${endpoint}: HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            console.log(`apiCall for ${endpoint}: Received 204 No Content.`);
            return null;
        }

        const jsonResponse = await response.json();
        console.log(`apiCall for ${endpoint}: Successfully parsed JSON response.`, jsonResponse);
        return jsonResponse;

    } catch (error) {
        console.error(`apiCall for ${endpoint}: An error occurred during fetch.`, error);
        throw error;
    }
}

// Export specific API functions for tasks and auth
export const authService = {
    register: async (username, password) => {
        const response = await apiCall(
            '/auth/register',
            'POST',
            { username, password },
            false
        );
        return response;
    },
    login: async (username, password) => {
        const response = await apiCall(
            '/auth/token',
            'POST',
            { username, password },
            false
        );
        // --- CHANGE THIS LINE ---
        // Instead of response.token, use response.access_token
        if (response && response.access_token) {
            setAuthToken(response.access_token);
        }
        return response;
    },
    logout: () => {
        setAuthToken(null);
        // Optionally, clear other user data or redirect
    },
    isAuthenticated: () => !!getAuthToken(),
};

export const taskService = {
    getTasks: async (status = null, search = null) => {
        let endpoint = '/tasks';
        const params = new URLSearchParams();
        if (status && status !== 'ALL') params.append('status', status);
        if (search) params.append('search', search);
        if (params.toString()) endpoint += `?${params.toString()}`;
        return apiCall(endpoint);
    },
    createTask: async (task) => {
        return apiCall('/tasks', 'POST', task);
    },
    updateTask: async (id, patch) => {
        return apiCall(`/tasks/${id}`, 'PUT', patch);
    },
    deleteTask: async (id) => {
        return apiCall(`/tasks/${id}`, 'DELETE');
    },
};
