import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    updateAccountDetails

} from "../controllers/user.controller.js";
import { 
  getUnverifiedUsers,
  verifyUserAndAssignRole,
  getVerifiedUsers 
}
from '../controllers/admin.controller.js'
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";



const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

// //secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

// routes/admin.routes.js
router.get("/unverified-users", verifyJWT, authorizeRoles("admin"), getUnverifiedUsers);
router.put("/verify-user/:userId", verifyJWT, authorizeRoles("admin"), verifyUserAndAssignRole);
router.get(
  '/verified-users',
  verifyJWT,
  authorizeRoles("admin"), // Only admin can access this
  getVerifiedUsers
);


export default router