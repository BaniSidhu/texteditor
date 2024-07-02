"use client";
import { CldUploadWidget } from "next-cloudinary";
import React from "react";

const page = () => {
  return (
    <CldUploadWidget uploadPreset="dz98pmrj">
      {({ open }) => {
        return (
          <button className="bg-black" onClick={() => open()}>
            Upload an Image
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default page;
