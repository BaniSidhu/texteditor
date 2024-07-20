"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoReorderThreeOutline, IoClose } from "react-icons/io5";
import parse from "html-react-parser";

interface DetailItem {
  id: number;
  title: string;
  detail: string;
  imageUrl?: string;
}

const Page: React.FC = () => {
  const [details, setDetails] = useState<DetailItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getDetails");
        console.log(res);
        setDetails(res.data.data.rows);
      } catch (error: any) {
        console.log("Failed to fetch tasks", error.message);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`/api/del/${id}`);
      if (res.status === 200) {
        setDetails(details.filter((detail) => detail.id !== id));
      }
    } catch (error: any) {
      console.log("An error occurred:", error.message);
      alert("Failed to delete detail. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 rounded-lg bg-white shadow-lg">
      {details.map((item) => (
        <div key={item.id} className="border-b last:border-none py-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">{item.title}</h2>
            <div className="flex items-center">
              <IoReorderThreeOutline className="cursor-pointer mr-2 text-gray-600 hover:text-gray-800 transition-colors" />
              <IoClose
                className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                onClick={() => handleDelete(item.id)}
              />
            </div>
          </div>
          <div className="py-2">{parse(item.detail)}</div>
          {item.imageUrl && (
            <div className="flex flex-col items-center mt-4">
              <img
                src={item.imageUrl}
                alt="Uploaded"
                className="w-32 h-32 object-cover mb-2 rounded-md border"
              />
              <p className="text-sm text-gray-600">{item.imageUrl}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Page;
