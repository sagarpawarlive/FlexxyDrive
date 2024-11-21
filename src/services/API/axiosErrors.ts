const ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE"	// Invalid or unsupported value provided in axios configuration.
const ERR_BAD_OPTION = "ERR_BAD_OPTION"	// Invalid option provided in axios configuration.
const ECONNABORTED = "ECONNABORTED"	// Request timed out due to exceeding timeout specified in axios configuration.
const ETIMEDOUT = "ETIMEDOUT" // Request timed out due to exceeding default axios timelimit.
const ERR_NETWORK = "ERR_NETWORK" // Network-related issue.
const ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS" // Request is redirected too many times; exceeds max redirects specified in axios configuration.
const ERR_DEPRECATED = "ERR_DEPRECATED"	// Deprecated feature or method used in axios.
const ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE"	// Response cannot be parsed properly or is in an unexpected format.
const ERR_BAD_REQUEST = "ERR_BAD_REQUEST" // Requested has unexpected format or missing required parameters.
const ERR_CANCELED = "ERR_CANCELED" // Feature or method is canceled explicitly by the user.
const ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT"	// Feature or method not supported in the current axios environment.
const ERR_INVALID_URL = "ERR_INVALID_URL" // Invalid URL provided for axios request.

const AxiosError = {
    ERR_BAD_OPTION_VALUE,
    ERR_BAD_OPTION,
    ECONNABORTED,
    ETIMEDOUT,
    ERR_NETWORK,
    ERR_FR_TOO_MANY_REDIRECTS,
    ERR_DEPRECATED,
    ERR_BAD_RESPONSE,
    ERR_BAD_REQUEST,
    ERR_CANCELED,
    ERR_NOT_SUPPORT,
    ERR_INVALID_URL
};

export default AxiosError;