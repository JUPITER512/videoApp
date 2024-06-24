import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'; //filesystem

// use fs unlink to delete a file in specific folder
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET // Click 'View Credentials' below to copy your API secret
});


async function Cloudinary(localFilePath) {
    try {
        if (!localFilePath) {
            return `Please Upload Valid File Path`
        }
        //upload file in cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been successfuly upload
        console.log(response)
        console.log("File upload successfully ", response.url);
        console.log(localFilePath)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}
export default Cloudinary