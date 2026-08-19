const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export const sanitizeCloudinaryId = (value) =>
  value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "_");

export async function uploadToCloudinary(file, { folder, publicId } = {}) {
  if (!file) return null;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (folder) formData.append("folder", folder);
  if (publicId) formData.append("public_id", publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
}
