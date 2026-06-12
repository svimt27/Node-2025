import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploaadToCloudinary from '../utils/cloudinary.js'
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;
  console.log(userName, email, fullName, password);
  if (
    [fullName, email, userName, password].some((fields) => {
      fields.trim() === "";
    })
  ) {
    throw ApiError(400, "All Fields are required");
  }
  //  Find user in DB
  const exitsUser = User.findOne({
    $or: [{ userName }, { email }],
  });
  if (exitsUser) {
    throw new ApiError(409, "User with email or userName is already exists");
  }
 const avatarLocalPath = req.files?.avatar[0]?.path;
 const coverImageLocalPath = req.files?.coverImage[0]?.path;
 if(!avatarLocalPath){
    throw new ApiError(400,'Avatar is required')
 }

const avatar = await uploaadToCloudinary(avatarLocalPath);
const cover = await uploaadToCloudinary(coverImageLocalPath)
if(!avatar){
   throw new ApiError(400,'Avatar file is required')
}

const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || '',
    email,
    password,
    userName:userName.toLowerCase()
})

const isUser  = User.findById(user._id).select(
    '-password -refeshToken'
)
   if(!isUser){
    throw new ApiError(500,'Error while registering user')
   }

   return res.status(201).json(new ApiResponse(201,'User registered successfully', isUser))
});

export default registerUser;
