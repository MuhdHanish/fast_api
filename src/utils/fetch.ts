export const fetchCountries = async (query: string, setError: (error: string) => void) => {
    try {
        const response = await fetch(`/api/search?q=${query}`);
        if (response.ok) {
            return await response.json();
        } else {
            if (response.status >= 500) {
                throw new Error(`Oops! Something went wrong. Please try again later.`);
            } else if(response.status === 404) {
                throw new Error(`Oops! Requested Recourse Not Found, Please report this issue.`);
            } else {
                const data = await response.json();
                if (data && data.message) {
                    throw new Error(data.message);
                } else {
                    throw new Error(`Oops! Something went wrong. Please try again later.`);
                }
            }
        }
    } catch (error) {
        setError(error instanceof Error ? error.message : `The server may be experiencing issues. Please try again later.`);
    }
};