"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
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
    imageurl?: string;
  }

  const [hostedUrl, setHostedUrl] = useState([]);
  const [mydetail, setMyDetail] = useState<string>("");
  const [mytitle, setMyTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [details, setDetails] = useState<DetailItem[]>([]);
  const [detailsToBeUpdated, setDetailsToBeUpdated] =
    useState<DetailItem | null>(null);
  const [detailIsUpdated, setDetailIsUpdated] = useState<boolean>(false);

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
          imageUrl: hostedUrl[0],
        });
        if (res.status === 200) {
          setDetails(
            details.map((section) =>
              section.id === detailsToBeUpdated.id
                ? {
                    ...detailsToBeUpdated,
                    title: mytitle,
                    detail: mydetail,
                    imageUrl: hostedUrl[0],
                  }
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
          imageUrl: hostedUrl[0],
        });

        const newDetail: DetailItem = {
          id: response.data.data.id,
          title: mytitle,
          detail: mydetail,
          imageurl: hostedUrl[0],
        };
        setDetails([...details, newDetail]);
      } catch (error: any) {
        console.log("An error occurred:", error.message);
        alert("Failed to add details. Please try again.");
      }
    }
    setMyDetail("");
    setMyTitle("");
    setHostedUrl([]); // Clear hosted URLs after adding details
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
      const res = await axios.patch("/api/update", {
        ...detailsToBeUpdated,
        imageUrl: hostedUrl,
      });
      if (res.status === 200) {
        setDetails(
          details.map((section) =>
            section.id === detailsToBeUpdated.id
              ? { ...detailsToBeUpdated, imageUrl: hostedUrl[0] }
              : section
          )
        );
      }
    } catch (error: any) {
      console.log("error", error.message);
    } finally {
      setLoadingBtn(false);
      setDetailIsUpdated(false);
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

  const sanitizeHtml = (html: any) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <>
      <div className="text-editor-container">
        {detailIsUpdated ? (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-serif pt-4"> Update Text</h1>
            <label htmlFor="title" className="text-xl mt-4">
              Title:
              <input
                id="title"
                value={detailsToBeUpdated?.title}
                onChange={(e: any) =>
                  detailsToBeUpdated != null &&
                  detailsToBeUpdated != undefined &&
                  setDetailsToBeUpdated({
                    ...detailsToBeUpdated,
                    title: e.target.value,
                  })
                }
                className="px-4 py-2 w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                type="text"
              />
            </label>
            <div className="text-editor w-full max-w-2xl mt-4 border-black rounded-md">
              <ReactQuill
                value={detailsToBeUpdated?.detail}
                onChange={(e: any) => {
                  console.log("the e of detail is", e);

                  detailsToBeUpdated != null &&
                    detailsToBeUpdated != undefined &&
                    setDetailsToBeUpdated({
                      ...detailsToBeUpdated,
                      detail: e,
                    });
                }}
                modules={modules}
                theme="snow"
                className="h-80 m-6 rounded-sm text-lg"
              />
            </div>
            <br />

            {!detailIsUpdated && (
              <div className="flex flex-col items-center mt-4">
                {hostedUrl.length === 0 && (
                  <div className="flex flex-col items-center px-4 py-6 bg-gray-200 text-gray-800 rounded-lg shadow-lg tracking-wide uppercase border border-gray-300 cursor-pointer hover:bg-gray-300 hover:text-black">
                    <CldUploadWidget
                      uploadPreset="dz98pmrj"
                      onSuccess={(result: any) => {
                        const url = result?.info?.url;

                        setHostedUrl([url]);
                      }}
                    >
                      {({ open }) => (
                        <button
                          className="flex flex-col items-center"
                          onClick={() => open()}
                        >
                          <FaRegImage className="w-8 h-8" />
                          <span className="mt-2 text-base leading-normal">
                            Upload an Image
                          </span>
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
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
            <div className="text-editor w-full max-w-2xl mt-4 border-black rounded-sm">
              <ReactQuill
                value={mydetail}
                onChange={handleEditorChange}
                modules={modules}
                theme="snow"
                className="h-80 m-6 text-lg"
              />
            </div>
          </div>
        )}
        <br />
        {detailIsUpdated && (
          <div className="flex flex-col items-center">
            <img
              src={detailsToBeUpdated?.imageurl}
              height={200}
              width={200}
              alt="Uploaded"
            />
          </div>
        )}
        <div className="flex flex-col items-center mt-4">
          {hostedUrl.length === 0 && (
            <div className="flex flex-col items-center px-4 py-6 bg-gray-200 text-gray-800 rounded-lg shadow-lg tracking-wide uppercase border border-gray-300 cursor-pointer hover:bg-gray-300 hover:text-black">
              <CldUploadWidget
                uploadPreset="dz98pmrj"
                onSuccess={(result: any) => {
                  const url: any = result?.info?.url;
                  setHostedUrl([url]);
                }}
              >
                {({ open }) => (
                  <button
                    className="flex flex-col items-center"
                    onClick={() => open()}
                  >
                    <FaRegImage className="w-8 h-8" />
                    <span className="mt-2 text-base leading-normal">
                      {detailIsUpdated
                        ? "Update The Image"
                        : "Upload the Image"}
                    </span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          )}

          {hostedUrl.length > 0 && (
            <div className="flex flex-col items-center">
              <img src={hostedUrl[0]} height={200} width={200} alt="Uploaded" />
              <p>{hostedUrl[0]}</p>
            </div>
          )}

          <button
            type="button"
            className="mt-8 text-white mb-3 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
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
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-2xl p-4  mx-auto rounded-lg shadow-xl"
        >
          {details.map((item) => (
            <AccordionItem
              key={item.id}
              value={`item-${item.id}`}
              className="mb-2 bg-white rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between p-4 rounded-t-md  text-black">
                <AccordionTrigger className="font-semibold">
                  {item.title}
                </AccordionTrigger>
                <div className="flex items-center">
                  <IoReorderThreeOutline
                    className="cursor-pointer  mr-2 text-black hover:text-gray-300 transition-colors"
                    onClick={() => {
                      setDetailIsUpdated(true);
                      setDetailsToBeUpdated(item);
                    }}
                  />
                  <IoClose
                    className="cursor-pointer text-red-200 hover:text-red-400 transition-colors"
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </div>
              <AccordionContent className="p-10 bg-white rounded-b-lg">
                <div dangerouslySetInnerHTML={sanitizeHtml(item.detail)} />
                {item.imageurl && (
                  <div className="flex flex-col items-center mt-4">
                    <img
                      src={item.imageurl}
                      alt="Uploaded"
                      className="w-32 h-32 object-cover mb-2 rounded-md border border-gray-300"
                    />
                    <p className="text-sm text-gray-600">{item.imageurl}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <br />
        <br />
        <br />
        <br />
      </div>
    </>
  );
};

export default TextEditor;
