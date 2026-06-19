import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
   cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret:  process.env.CLOUDINARY_API_SECRET,
    });

const uploaadToCloudinary = async (localPathUrl)=>{
  try {
  if(!localPathUrl) return null;
  const response = await cloudinary.uploader.upload(localPathUrl,{
    resource_type:"auto",
  })
  console.log("Cloudinary upload response:", response.url);
     fs.unlinkSync(localPathUrl)

  return response;
  } catch (error) {
    // remove the locally saved temporar file as the upload operation got failed
    console.error("Error uploading to Cloudinary:", error);
     fs.unlinkSync(localPathUrl)
     return null;
  }
}

export default uploaadToCloudinary;