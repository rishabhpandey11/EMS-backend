// asyncHandler ek wrapper function hai jo async route handlers ko handle karta hai
const asyncHandler = (requestHandler) => {

    // Yeh ek naya middleware function return karta hai
    return (req, res, next) => {

        // requestHandler ek async function ho sakta hai jisme error aane par app crash ho sakti hai
        // isliye usse Promise.resolve se wrap kiya gaya hai

        // agar koi error aati hai to .catch() us error ko Express ke next() function ko de deta hai
        // jisse Express ka global error handler use handle kar sake
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    }
}

export { asyncHandler }
// ye wrapper function h 
// async handler is highr order function jo function ko variable or normal data jais treat karta h  ko accept karte h 

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }