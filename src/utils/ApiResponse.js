// ApiResponse ek custom class hai jo API ka successful response structure define karti hai
class ApiResponse {

    // constructor 3 parameters leta hai: statusCode, data aur optional message
    constructor(statusCode, data, message = "Success") {

        this.statusCode = statusCode   // HTTP response code jaise 200, 201, etc.
        this.data = data               // actual data jo frontend/user ko bhejna hai
        this.message = message         // success message (default "Success")

        // success true ya false hoga statusCode ke basis par
        // agar statusCode 400 se kam hai to true, warna false
        this.success = statusCode < 400
    }
}

// is class ko dusre modules me use karne ke liye export kar rahe hain
export { ApiResponse }
