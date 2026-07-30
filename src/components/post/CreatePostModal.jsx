import { useState } from "react";
import {
  X,
  Image,
  Send,
  Sparkles,
  Megaphone,
  Award,
  Briefcase,
  FileText,
} from "lucide-react";
import API from "../../utils/axios";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

const postTypes = [
  {
    value: "general",
    label: "General",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    value: "job",
    label: "Job",
    icon: Briefcase,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    value: "announcement",
    label: "Announcement",
    icon: Megaphone,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    value: "achievement",
    label: "Achievement",
    icon: Award,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    value: "noticeboard",
    label: "Notice",
    icon: Sparkles,
    color: "text-rose-500",
    bg: "bg-rose-50",
    roles: ["teacher", "professor", "hod", "principal"],
  },
];

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

  const { user } = useAuthStore();
  const canPostNotice = ["teacher", "professor", "hod", "principal"].includes(
    user?.role
  );

  const availableTypes = postTypes.filter((t) => !t.roles || canPostNotice);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <h2 className="text-lg font-bold font-heading">Create Post</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Text Area */}
          <div className="form-control">
            <textarea
              className="textarea textarea-bordered w-full min-h-[140px] text-base placeholder:text-base-content/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={2000}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/40">
                {text.length}/2000
              </span>
            </label>
          </div>

          {/* Post Type Selector */}
          <div>
            <label className="text-xs font-medium text-base-content/50 mb-2 block">
              Post Type
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTypes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      type === t.value
                        ? `border-primary bg-primary/10 text-primary shadow-sm`
                        : "border-base-300 bg-base-100 text-base-content/60 hover:border-base-400 hover:bg-base-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="form-control">
            <input
              type="text"
              className="input input-bordered w-full text-sm focus:outline-none focus:border-primary/50"
              placeholder="Tags (comma separated, e.g. React, Node.js)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="btn btn-outline btn-sm gap-2 font-normal">
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
              <span className="text-xs text-base-content/50 ml-2">
                {images.length} image{images.length > 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from(images).map((img, i) => (
                <div key={i} className="relative aspect-square group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt=""
                    className="w-full h-full object-cover rounded-xl ring-1 ring-base-300"
                  />
                  <button
                    type="button"
                    className="absolute top-1.5 right-1.5 btn btn-circle btn-xs bg-black/50 border-none hover:bg-error text-white opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="btn btn-primary flex-1 gap-2 shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
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
