import { useState } from "react";
import { X, Image, Send } from "lucide-react";
import API from "../../utils/axios";
import toast from "react-hot-toast";

const CreatePostModal = ({ onClose }) => {
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [type, setType] = useState("general");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && images.length === 0) {
      toast.error("Please add text or images to your post.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("type", type);
      formData.append("tags", tags);
      images.forEach((img) => formData.append("images", img));

      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post created successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-heading">Create Post</h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="textarea textarea-bordered w-full min-h-[120px]"
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
          />

          <div className="flex gap-3">
            <select
              className="select select-bordered flex-1"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="general">General</option>
              <option value="job">Job Post</option>
              <option value="announcement">Announcement</option>
              <option value="achievement">Achievement</option>
            </select>

            <input
              type="text"
              className="input input-bordered flex-1"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="btn btn-outline btn-sm gap-2">
              <Image className="w-4 h-4" />
              Add Images
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => setImages([...e.target.files])}
              />
            </label>
            {images.length > 0 && (
              <p className="text-xs text-base-content/60 mt-1">
                {images.length} image(s) selected
              </p>
            )}
          </div>

          {/* Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from(images).map((img, i) => (
                <div key={i} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(img)}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 btn btn-circle btn-xs btn-error"
                    onClick={() => {
                      const newImages = [...images];
                      newImages.splice(i, 1);
                      setImages(newImages);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="btn btn-primary flex-1 gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Send className="w-4 h-4" />
              )}
              Post
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
