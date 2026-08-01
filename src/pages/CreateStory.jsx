import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Image, Send } from "lucide-react";
import API from "../utils/axios";
import toast from "react-hot-toast";

const CreateStory = () => {
  const navigate = useNavigate();
  const [storyImage, setStoryImage] = useState(null);
  const [storyText, setStoryText] = useState("");
  const [storyUploading, setStoryUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setStoryImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setStoryImage(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storyImage && !storyText.trim()) {
      toast.error("Please add an image or caption to your story.");
      return;
    }

    setStoryUploading(true);
    try {
      const formData = new FormData();
      if (storyImage) formData.append("image", storyImage);
      if (storyText.trim()) formData.append("text", storyText);
      await API.post("/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Story posted!");
      navigate("/feed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post story");
    } finally {
      setStoryUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm btn-circle"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-heading">Create Story</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            Share a story with your network
          </p>
        </div>
      </div>

      {/* Story Form Card */}
      <div className="card bg-base-100 border border-base-300/50 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div>
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Story preview"
                  className="w-full max-h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 btn btn-circle btn-xs btn-error"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-base-300 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Image className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-base-content/50">
                  Click to upload an image (max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Caption */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-medium text-sm">
                Caption (optional)
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full text-sm"
              placeholder="Add a caption..."
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              maxLength={200}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/40">
                {storyText.length}/200
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t border-base-200">
            <button
              type="submit"
              className="btn btn-primary flex-1 gap-2"
              disabled={storyUploading}
            >
              {storyUploading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Send className="w-4 h-4" />
              )}
              Post Story
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStory;
