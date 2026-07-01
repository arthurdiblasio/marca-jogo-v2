import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

export function uploadImageToCloudinary(file: File, folder: string): Promise<CloudinaryUploadResult> {
  return file.arrayBuffer().then(
    (buffer) =>
      new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "image" },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Falha no upload para o Cloudinary"));
              return;
            }
            resolve({ url: result.secure_url, publicId: result.public_id });
          }
        );
        stream.end(Buffer.from(buffer));
      })
  );
}
