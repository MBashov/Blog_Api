//* Custom modules
import { rateLimit } from 'express-rate-limit'

//* Configure rate limiting middleware to prevent abuse 

const limiter = rateLimit({
    windowMs: 60000, // 1-minute time for request limiting
    limit: 60, // Allow a maximum of 60 request per minute per IP
    standardHeaders: 'draft-8', // Use the latest standard rate-limit headers
    legacyHeaders: false, // Disable deprecated X-Ratelimit headers
    message: {
        error: 'You have sent too many requests in a given amount of time. Please try again later.'
    }
})

export default limiter;