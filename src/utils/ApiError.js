// ApiError class ko Error class se extend kiya gaya hai
// iska matlab hai yeh ek custom error class ban rahi hai
class ApiError extends Error {

    // constructor ke through custom properties pass ki ja rahi hain
    constructor(
        statusCode,                // HTTP status code (e.g., 404, 500)
        message = "Something went wrong",  // default error message
        errors = [],               // optional array of detailed errors
        stack = ""                 // optional stack trace
    ) {
        super(message)             // parent class Error ka constructor call karna zaroori hai

        this.statusCode = statusCode   // HTTP response code
        this.data = null               // default: no data on error
        this.message = message         // error message
        this.success = false           // success false kyunki yeh error hai
        this.errors = errors           // detailed errors (e.g., validation errors)

        // agar custom stack trace diya gaya ho to use set karo
        if (stack) {
            this.stack = stack
        } else {
            // warna current stack trace capture karo for debugging
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

// export kar rahe hain taaki doosre modules me import karke use kiya ja sake
export { ApiError }


// Stack trace ek debugging tool hota hai jo batata hai ki error kis file me, kis line number pe, aur kis function call ke sequence me aayi hai.