"use client";
import { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("ml_default", "your_cloudinary_upload_preset");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.dflucwqzr}/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("File uploaded:", response.data);
        // Handle success, e.g., show uploaded image or save public_id
      } catch (error) {
        console.error("Upload failed:", error);
        // Handle error
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadImage;
