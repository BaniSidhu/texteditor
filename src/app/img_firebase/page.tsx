// "use client";
// import axios from "axios";
// import React, { useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import DOMPurify from "dompurify";
// import { FaRegImage } from "react-icons/fa";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { IoReorderThreeOutline, IoClose } from "react-icons/io5";
// import { CldUploadWidget } from "next-cloudinary";

// const TextEditor: React.FC = () => {
//   interface DetailItem {
//     id: number;
//     title: string;
//     detail: string;
//     imageUrl?: string;
//     newImg?: File;
//   }

//   const [hostedUrl, setHostedUrl] = useState<string[]>([]);
//   const [mydetail, setMyDetail] = useState<string>("");
//   const [mytitle, setMyTitle] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
//   const [details, setDetails] = useState<DetailItem[]>([]);
//   const [detailsToBeUpdated, setDetailsToBeUpdated] =
//     useState<DetailItem | null>(null);
//   const [detailIsUpdated, setDetailIsUpdated] = useState<boolean>(false);

//   const handleEditorChange = (content: string) => {
//     setMyDetail(content);
//   };

//   const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     if (mydetail.length === 0 || mytitle.length === 0) {
//       alert("Alert! Empty form can't be submitted");
//       return;
//     }

//     setLoading(true);

//     if (detailIsUpdated && detailsToBeUpdated) {
//       // Update existing detail
//       try {
//         const res = await axios.patch(`/api/update/${detailsToBeUpdated.id}`, {
//           title: mytitle,
//           detail: mydetail,
//           imageUrl: hostedUrl[0], // Ensure you update imageUrl with the latest hostedUrl
//         });
//         if (res.status === 200) {
//           setDetails(
//             details.map((section) =>
//               section.id === detailsToBeUpdated.id
//                 ? {
//                     ...detailsToBeUpdated,
//                     title: mytitle,
//                     detail: mydetail,
//                     imageUrl: hostedUrl[0],
//                   }
//                 : section
//             )
//           );
//           setDetailIsUpdated(false);
//           setDetailsToBeUpdated(null);
//         }
//       } catch (error: any) {
//         console.log("An error occurred:", error.message);
//         alert("Failed to update detail. Please try again.");
//       }
//     } else {
//       // Add new detail
//       try {
//         const response = await axios.post("/api/create", {
//           title: mytitle,
//           detail: mydetail,
//           imageUrl: hostedUrl[0],
//         });

//         const newDetail: DetailItem = {
//           id: response.data.data.id,
//           title: mytitle,
//           detail: mydetail,
//           imageUrl: hostedUrl[0],
//         };
//         setDetails([...details, newDetail]);
//       } catch (error: any) {
//         console.log("An error occurred:", error.message);
//         alert("Failed to add details. Please try again.");
//       }
//     }
//     setMyDetail("");
//     setMyTitle("");
//     setHostedUrl([]); // Clear hosted URLs after adding details
//     setLoading(false);
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       const res = await axios.delete(`/api/del/${id}`);
//       if (res.status === 200) {
//         setDetails(details.filter((detail) => detail.id !== id));
//       }
//     } catch (error: any) {
//       console.log("An error occurred:", error.message);
//       alert("Failed to delete detail. Please try again.");
//     }
//   };

//   const onUpdateHandler = async (
//     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ) => {
//     e.preventDefault();

//     setLoadingBtn(true);

//     if (!detailsToBeUpdated) {
//       console.error("detailsToBeUpdated is undefined");
//       setLoadingBtn(false);
//       return;
//     }

//     try {
//       const res = await axios.patch(`/api/update/${detailsToBeUpdated.id}`, {
//         ...detailsToBeUpdated,
//         imageUrl: hostedUrl[0], // Ensure you update imageUrl with the latest hostedUrl
//       });

//       if (res.status === 200) {
//         setDetails(
//           details.map((section) =>
//             section.id === detailsToBeUpdated.id ? detailsToBeUpdated : section
//           )
//         );
//       }
//     } catch (error: any) {
//       console.log("error", error.message);
//       alert("Failed to update detail. Please try again.");
//     } finally {
//       setLoadingBtn(false);
//       setDetailIsUpdated(false);
//       setDetailsToBeUpdated(null);
//     }
//   };

//   const modules = {
//     toolbar: [
//       [{ header: "1" }, { header: "2" }, { font: [] }],
//       [{ size: [] }],
//       ["bold", "italic", "underline", "strike", "blockquote"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link"],
//       ["clean"],
//     ],
//   };

//   const sanitizeHtml = (html: string) => {
//     return { __html: DOMPurify.sanitize(html) };
//   };

//   return (
//     <div className="text-editor-container">
//       {detailIsUpdated ? (
//         <div className="flex flex-col items-center">
//           <h1 className="text-4xl font-serif pt-4"> Update Text</h1>
//           <label htmlFor="title" className="text-xl mt-4">
//             Title:
//             <input
//               id="title"
//               value={detailsToBeUpdated?.title}
//               onChange={(e: any) =>
//                 setDetailsToBeUpdated({
//                   ...detailsToBeUpdated,
//                   title: e.target.value,
//                 })
//               }
//               className="px-4 py-2 w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
//               type="text"
//             />
//           </label>
//           <div className="text-editor w-full max-w-2xl mt-4 border-black rounded-sm">
//             <ReactQuill
//               value={detailsToBeUpdated?.detail}
//               onChange={(e: any) =>
//                 setDetailsToBeUpdated({
//                   ...detailsToBeUpdated,
//                   detail: e,
//                 })
//               }
//               modules={modules}
//               theme="snow"
//               className="h-80 m-6 text-lg"
//             />
//           </div>
//           <div className="flex flex-col items-center mt-4">
//             {hostedUrl.length === 0 && (
//               <div className="flex flex-col items-center px-4 py-6 bg-gray-200 text-gray-800 rounded-lg shadow-lg tracking-wide uppercase border border-gray-300 cursor-pointer hover:bg-gray-300 hover:text-black">
//                 <CldUploadWidget
//                   uploadPreset="dz98pmrj"
//                   onSuccess={(result) => {
//                     const url = result?.info?.url;
//                     setHostedUrl([url]);
//                   }}
//                 >
//                   {({ open }) => (
//                     <button
//                       className="flex flex-col items-center"
//                       onClick={() => open()}
//                     >
//                       <FaRegImage className="w-8 h-8" />
//                       <span className="mt-2 text-base leading-normal">
//                         Upload an Image
//                       </span>
//                     </button>
//                   )}
//                 </CldUploadWidget>
//               </div>
//             )}

//             {hostedUrl.length > 0 && (
//               <div className="flex flex-col items-center">
//                 <img
//                   src={hostedUrl[0]}
//                   height={200}
//                   width={200}
//                   alt="Uploaded"
//                 />
//                 <p>{hostedUrl[0]}</p>
//               </div>
//             )}

//             <button
//               type="button"
//               className="mt-8 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
//               onClick={onUpdateHandler}
//               disabled={loadingBtn}
//             >
//               {loadingBtn ? "Updating..." : "Update"}
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center">
//           <h1 className="text-4xl font-serif pt-4">Text Editor</h1>
//           <label htmlFor="title" className="text-xl mt-4">
//             Title:
//             <input
//               id="title"
//               value={mytitle}
//               onChange={(e) => setMyTitle(e.target.value)}
//               className="px-4 py-2 w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
//               type="text"
//             />
//           </label>
//           <div className="text-editor w-full max-w-2xl mt-4 border-black rounded-sm">
//             <ReactQuill
//               value={mydetail}
//               onChange={handleEditorChange}
//               modules={modules}
//               theme="snow"
//               className="h-80 m-6 text-lg"
//             />
//           </div>
//           <div className="flex flex-col items-center mt-4">
//             {hostedUrl.length === 0 && (
//               <div className="flex flex-col items-center px-4 py-6 bg-gray-200 text-gray-800 rounded-lg shadow-lg tracking-wide uppercase border border-gray-300 cursor-pointer hover:bg-gray-300 hover:text-black">
//                 <CldUploadWidget
//                   uploadPreset="dz98pmrj"
//                   onSuccess={(result) => {
//                     const url = result?.info?.url;
//                     setHostedUrl([url]);
//                   }}
//                 >
//                   {({ open }) => (
//                     <button
//                       className="flex flex-col items-center"
//                       onClick={() => open()}
//                     >
//                       <FaRegImage className="w-8 h-8" />
//                       <span className="mt-2 text-base leading-normal">
//                         Upload an Image
//                       </span>
//                     </button>
//                   )}
//                 </CldUploadWidget>
//               </div>
//             )}

//             {hostedUrl.length > 0 && (
//               <div className="flex flex-col items-center">
//                 <img
//                   src={hostedUrl[0]}
//                   height={200}
//                   width={200}
//                   alt="Uploaded"
//                 />
//                 <p>{hostedUrl[0]}</p>
//               </div>
//             )}

//             <button
//               type="button"
//               className="mt-8 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
//               onClick={handleClick}
//               disabled={loading}
//             >
//               {loading ? "Adding..." : "Add Details"}
//             </button>
//           </div>
//         </div>
//       )}

//       <Accordion
//         type="single"
//         collapsible
//         className="w-70 h-auto ml-10 pl-8 rounded-lg overflow-y-auto"
//       >
//         {details.map((item) => (
//           <AccordionItem key={item.id} value={`item-${item.id}`}>
//             <div className="flex items-center justify-between">
//               <AccordionTrigger>{item.title}</AccordionTrigger>
//               <div className="flex items-center">
//                 <IoReorderThreeOutline
//                   className="cursor-pointer mr-2 text-gray-600"
//                   onClick={() => {
//                     setDetailIsUpdated(true);
//                     setDetailsToBeUpdated(item);
//                     setHostedUrl([item.imageUrl || ""]); // Set hostedUrl with current imageUrl when editing
//                   }}
//                 />
//                 <IoClose
//                   className="cursor-pointer text-red-500"
//                   onClick={() => handleDelete(item.id)}
//                 />
//               </div>
//             </div>
//             <AccordionContent>
//               <div dangerouslySetInnerHTML={sanitizeHtml(item.detail)} />
//               {item.imageUrl && (
//                 <div className="flex flex-col items-center mt-4">
//                   <img
//                     src={item.imageUrl}
//                     alt="Uploaded"
//                     className="w-64 h-64 object-cover mb-2"
//                   />
//                   <p>{item.imageUrl}</p>
//                 </div>
//               )}
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//     </div>
//   );
// };

// export default TextEditor;
