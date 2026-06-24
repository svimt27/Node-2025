import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploaadToCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while genrating access and refresh token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;
  if (
    [fullName, email, userName, password].some((fields) => {
      fields.trim() === "";
    })
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  //  Find user in DB
  const exitsUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (exitsUser) {
    throw new ApiError(409, "User with email or userName is already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (req.files && req.files.coverImage[0] && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploaadToCloudinary(avatarLocalPath);
  const cover = await uploaadToCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required ");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: cover.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const isUser = await User.findById(user._id).select("-password -refeshToken");
  if (!isUser) {
    throw new ApiError(500, "Error while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", isUser));
});

const loginUser = asyncHandler(async (req, res) => {
  // user name or email and password
  // if user is  first time then ask otp e
  // generate access token or refresh token
  const { email, userName, password } = req.body;
  if (!(email || userName)) {
    throw new ApiError(400, "userName and  password is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (!user) {
    throw new ApiError(400, "user not register");
  }

  const isPasswordVaild = await user.isPasswordCorrect(password);
  
  if (!isPasswordVaild) {
    throw new ApiError(401, "Invaild  credential");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
  console.log(accessToken + '"*******refreshToken **********"' + refreshToken);
  console.log("**************************")
  console.log(User.findById(user._id));
  
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
 await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
  .status(200)
  .clearCookie('accessToken',options)
  .clearCookie('refreshToken',options)
  .json(new ApiResponse(200,{},'User '))
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
  console.log('**********************************',req);
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(401,'Unauthorized')
  }
 try {
  const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
 const user  = await User.findById(decodedToken?._id);
 if(!user){
   throw new ApiError(401,'Invaild refresh token');
 }
 console.log(incomingRefreshToken + "********" + user,decodedToken);
 
 if(incomingRefreshToken !== user?.refreshToken){
   throw new ApiError (401,'Refresh token is expired or used');
 }
 const options={
   httpOnly:true,
   secure:true
 }
 const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
 return res
 .status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(
   new ApiResponse(
     200,{accessToken,refreshToken},
     "Access token refreshed"
   )
 )
 } catch (error) {
  throw new ApiError(401 , error?.message || '')
 }
})
export { registerUser, loginUser, logoutUser,refreshAccessToken };
