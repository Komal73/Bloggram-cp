import React, { useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { TextField, Chip, Button, IconButton } from "@mui/material";
import { apiBlog } from "../../../services/models/BlogModel";
import { toast } from "react-hot-toast";
import { BlogShapes } from "../../common/Shapes";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddBlog = () => {
  const BUTTONLIST = [
    ["undo", "redo"],
    ["font", "fontSize", "formatBlock"],
    ["bold", "underline", "italic", "strike", "subscript", "superscript"],
    ["removeFormat"],
    "/",
    ["fontColor", "hiliteColor"],
    ["outdent", "indent"],
    ["align", "horizontalRule", "list", "table"],
    ["link", "image", "video"],
    ["fullScreen", "showBlocks" /*, 'codeView'*/],
    ["preview", "print"],
    // ["save", "template"],
  ];

  const handleChange = (content) => {
    // console.log(content); //Get Content Inside Editor
    setBlog({ ...blog, content: content });
  };

  const [loading, setLoading] = useState(false);

  const [blog, setBlog] = useState({
    title: "",
    desc: "",
    tags: [],
    content: [],
  });

  const handleInputs = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const createBlog = (type) => {
    if (blog.title === "") {
      toast.error("Fill in the title");
      return;
    }
    if (blog.desc === "") {
      toast.error("Fill in the Description");
      return;
    }
    if (blog.content === "") {
      toast.error("Fill in the Content");
      return;
    }
    if (blog.tags === []) {
      toast.error("Fill in the tags");
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem("BlogGram-UserId");
    const body = {
      userId: userId,
      title: blog.title,
      desc: blog.desc,
      content: blog.content,
      likes: 0,
      comments: [],
      tags: blog.tags,
      type: type,
    };
    // console.log(body);
    apiBlog.post(body).then((res) => {
      if (res.status === "200") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
    navigate("/dashboard/home");
  };

  return (
    <>
      <BlogShapes />
      <section className="p-5">
        <div className="d-flex justify-content-between">
          <div>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon sx={{ fontSize: "0.9rem" }} />
            </IconButton>
            <span className="mb-0" style={{ fontSize: "0.9rem" }}>
              Go Back
            </span>
          </div>
          {!loading ? (
            <div>
              <Button
                onClick={() => createBlog("DRAFT")}
                variant="outlined"
                color="primary"
                size="small"
                className="me-2"
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => createBlog("PUBLISHED")}
                variant="contained"
                color="secondary"
                size="small"
              >
                Publish
              </Button>
            </div>
          ) : (
            <>
              <LoadingButton
                loading
                loadingIndicator="Loading..."
                variant="outlined"
              >
                Loading
              </LoadingButton>
            </>
          )}
        </div>
        <TextField
          name="title"
          value={blog.title}
          onChange={handleInputs}
          label="Title*"
          variant="standard"
          className="w-100"
        />
        <TextField
          name="desc"
          value={blog.desc}
          onChange={handleInputs}
          label="Description*"
          variant="standard"
          className="w-100 my-3"
          multiline
          rows={4}
        />
        {blog.tags?.map((tag, index) => (
          <Chip
            label={tag}
            key={index}
            // onClick={handleClick}
            onDelete={() =>
              setBlog({
                ...blog,
                tags: blog.tags.filter((item) => item !== tag),
              })
            }
          />
        ))}

        <TextField
          name="tags"
          label="Tags*"
          variant="standard"
          className="w-100 my-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setBlog({ ...blog, tags: [...blog.tags, e.target.value] });
            }
          }}
        />
        <SunEditor
          onChange={handleChange}
          setOptions={{
            height: "80vh",
            buttonList: BUTTONLIST,
          }}
        />
      </section>
    </>
  );
};

export default AddBlog;
