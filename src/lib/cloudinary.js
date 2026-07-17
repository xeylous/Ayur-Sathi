import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Reusable helper — upload a Buffer to Cloudinary and return { publicId, url }.
 * @param {Buffer}  fileBuffer  The file content as a Node Buffer.
 * @param {string}  folder      Cloudinary folder (default: "cropImages").
 * @returns {Promise<{publicId: string, url: string}>}
 */
export const uploadImageToCloudinary = (fileBuffer, folder = "cropImages") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
          });
      }
    ).end(fileBuffer);
  });
};

export default cloudinary;
