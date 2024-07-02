"use client";
import axios from "axios";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { FaRegImage } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoReorderThreeOutline, IoClose } from "react-icons/io5";
import { CldUploadWidget } from "next-cloudinary";

const TextEditor: React.FC = () => {
  interface DetailItem {
    id: number;
    title: string;
    detail: string;
  }
  const [hostedUrl, setHostedUrl] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mydetail, setMyDetail] = useState<string>("");
  const [mytitle, setMyTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [details, setDetails] = useState<DetailItem[]>([]);
  const [detailsToBeUpdated, setDetailsToBeUpdated] =
    useState<DetailItem | null>(null);
  const [detailIsUpdated, setDetailIsUpdated] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setImage(file);
  };

  const handleEditorChange = (content: string) => {
    setMyDetail(content);
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (mydetail.length === 0 || mytitle.length === 0) {
      alert("Alert! Empty form can't be submitted");
      return;
    }

    setLoading(true);
    if (detailIsUpdated && detailsToBeUpdated) {
      // Update existing detail
      try {
        const res = await axios.patch(`/api/update/${detailsToBeUpdated.id}`, {
          title: mytitle,
          detail: mydetail,
        });
        if (res.status === 200) {
          setDetails(
            details.map((section) =>
              section.id === detailsToBeUpdated.id
                ? { ...detailsToBeUpdated, title: mytitle, detail: mydetail }
                : section
            )
          );
          setDetailIsUpdated(false);
          setDetailsToBeUpdated(null);
        }
      } catch (error: any) {
        console.log("An error occurred:", error.message);
        alert("Failed to update detail. Please try again.");
      }
    } else {
      // Add new detail
      try {
        const response = await axios.post("/api/create", {
          title: mytitle,
          detail: mydetail,
        });

        const newDetail: DetailItem = {
          id: response.data.data.id,
          title: mytitle,
          detail: mydetail,
        };
        setDetails([...details, newDetail]);
      } catch (error: any) {
        console.log("An error occurred:", error.message);
        alert("Failed to add details. Please try again.");
      }
    }
    setMyDetail("");
    setMyTitle("");
    setLoading(false);
  };

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

  // const handleEdit = (item: DetailItem) => {
  //   setMyTitle(item.title);
  //   setMyDetail(item.detail);
  //   setDetailIsUpdated(true);
  //   setDetailsToBeUpdated(item);
  // };

  const onUpdateHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoadingBtn(true);

    if (!detailsToBeUpdated) {
      console.error("detailsToBeUpdated is undefined");
      setLoadingBtn(false);
      return;
    }
    try {
      const res = await axios.patch("/api/update", { ...detailsToBeUpdated });

      if (res.status === 200) {
        setDetailIsUpdated(false);
        setDetails(
          details.map((section) =>
            section.id === detailsToBeUpdated.id ? detailsToBeUpdated : section
          )
        );
      }
    } catch (error: any) {
      console.log("error", error.message);
    } finally {
      setLoadingBtn(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const sanitizeHtml = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-serif pt-4">Text Editor</h1>
        <label htmlFor="title" className="text-xl mt-4">
          Title:
          <input
            id="title"
            value={mytitle}
            onChange={(e) => setMyTitle(e.target.value)}
            className="px-4 py-2 w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            type="text"
          />
        </label>
        <div className="text-editor w-full max-w-2xl mt-4">
          <ReactQuill
            value={mydetail}
            onChange={handleEditorChange}
            modules={modules}
            theme="snow"
            className="h-80 m-6 text-lg"
          />
        </div>
      </div>
      <br />
      <div className="flex flex-col items-center mt-4">
        <div className="flex flex-col items-center px-4 py-6 bg-gray-200 text-gray-800 rounded-lg shadow-lg tracking-wide uppercase border border-gray-300 cursor-pointer hover:bg-gray-300 hover:text-black">
          <p>Hosted Urls:</p>
          {/* {
  hostedUrl?.map((url: any, idx: any) => {
    return (
      <div key={idx}>
        <img src={url} height={200} width={200} alt="" />
        <p>{url}</p>
      </div>
    );
  })
} */}

          <CldUploadWidget
            uploadPreset="dz98pmrj"
            // onSuccess={(prevHostedUrl) => setHostedUrl(....prevHostedUrl?.info?.url)}
          >
            {({ open }) => {
              return (
                <button
                  className="flex flex-col items-center"
                  onClick={() => open()}
                >
                  <FaRegImage className="w-8 h-8" />
                  <span className="mt-2 text-base leading-normal">
                    Upload an Image
                  </span>
                </button>
              );
            }}
          </CldUploadWidget>
        </div>

        <button
          type="button"
          className="mt-8 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          onClick={detailIsUpdated ? onUpdateHandler : handleClick}
          disabled={loading || loadingBtn}
        >
          {loading || loadingBtn
            ? detailIsUpdated
              ? "Updating..."
              : "Adding..."
            : detailIsUpdated
            ? "Update"
            : "Add Details"}
        </button>
      </div>
      <Accordion type="single" collapsible className="w-70 h-24 ml-10 pl-8">
        {details.map((item) => (
          <AccordionItem key={item.id} value={`item-${item.id}`}>
            <div className="flex items-center justify-between">
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <div className="flex items-center">
                <IoReorderThreeOutline
                  className="cursor-pointer mr-2 text-gray-600"
                  onClick={() => {
                    setDetailIsUpdated(true);
                    setDetailsToBeUpdated(item);
                  }}
                />
                <IoClose
                  className="cursor-pointer text-red-500"
                  onClick={() => handleDelete(item.id)}
                />
              </div>
            </div>
            <AccordionContent>
              <div dangerouslySetInnerHTML={sanitizeHtml(item.detail)} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default TextEditor;
