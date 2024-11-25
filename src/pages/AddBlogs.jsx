import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "../app/globals.css";
import MyEditorComponent from "@/Component/custom-editor";
import Sidebar from "@/Component/Sidebar";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTags, setMetaTags] = useState("");
  const [pageH1, setPageH1] = useState("");
  const [about1, setAbout1] = useState("");
  const [about2, setAbout2] = useState("");
  const [content, setContent] = useState("");
  const [pageH2, setPageH2] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect the form data
    const formData = {
      title,
      slug,
      metaTags,
      pageH1,
      about1,
      pageH2,
      about2,
      content,
    };

    try {
      const response = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedBlog = await response.json();
        console.log("Blog saved successfully:", savedBlog);
        router.push(`/blogs/${savedBlog.slug}`);
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* sidebar  */}
      <Sidebar/>
    <div className="container mx-auto p-6 max-w-4xl ">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Create New Post
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
      >
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-lg font-semibold text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div className="mb-4">
          <label
            htmlFor="slug"
            className="block text-lg font-semibold text-gray-700"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter post slug"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Meta Tags */}
        <div className="mb-4">
          <label
            htmlFor="metaTags"
            className="block text-lg font-semibold text-gray-700"
          >
            Meta Tags
          </label>
          <textarea
            id="metaTags"
            value={metaTags}
            onChange={(e) => setMetaTags(e.target.value)}
            placeholder="Enter meta tags (comma separated)"
            className="w-full h-40 px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Page H1 */}
        <div className="mb-4">
          <label
            htmlFor="pageH1"
            className="block text-lg font-semibold text-gray-700"
          >
            Page H1
          </label>
          <input
            type="text"
            id="pageH1"
            value={pageH1}
            onChange={(e) => setPageH1(e.target.value)}
            placeholder="Enter page H1"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* About Sections */}
        <div className="mb-4">
          <label
            htmlFor="about1"
            className="block text-lg font-semibold text-gray-700"
          >
            About 1
          </label>
          <textarea
            id="about1"
            value={about1}
            onChange={(e) => setAbout1(e.target.value)}
            placeholder="Enter first about section"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="pageH2"
            className="block text-lg font-semibold text-gray-700"
          >
            Page H2
          </label>
          <input
            type="text"
            id="pageH2"
            value={pageH2}
            onChange={(e) => setPageH2(e.target.value)}
            placeholder="Enter page H2"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="about2"
            className="block text-lg font-semibold text-gray-700"
          >
            About 2
          </label>
          <textarea
            id="about2"
            value={about2}
            onChange={(e) => setAbout2(e.target.value)}
            placeholder="Enter second about section"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* CKEditor Content */}
        <MyEditorComponent onChange={(data) => setContent(data)} />

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    </div>  
    );
};

export default CreatePost;
