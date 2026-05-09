import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useCreatePost } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ImagePlus, Loader2, Send, Tag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Fashion",
  "Tech",
  "Food",
  "Art",
  "Home",
  "Sports",
  "Beauty",
  "Other",
];

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function UploadPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const createPost = useCreatePost();

  const [preview, setPreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProduct, setIsProduct] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Other");
  const [errors, setErrors] = useState<{ image?: string; caption?: string }>(
    {},
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/auth/login" });
  }, [isAuthenticated, navigate]);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    try {
      const base64 = await readFileAsBase64(file);
      setImageBase64(base64);
      setPreview(base64);
      setErrors((prev) => ({ ...prev, image: undefined }));
    } catch {
      toast.error("Could not read image file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const resetForm = () => {
    setPreview(null);
    setImageBase64(null);
    setCaption("");
    setIsProduct(false);
    setProductTitle("");
    setPrice("");
    setCategory("Other");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const newErrors: { image?: string; caption?: string } = {};
    if (!imageBase64) newErrors.image = "Please select an image.";
    if (!caption.trim()) newErrors.caption = "Caption is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !imageBase64) return;
    try {
      await createPost.mutateAsync({
        imageUrl: imageBase64,
        caption: caption.trim(),
      });
      toast.success("Post shared! 🚀");
      resetForm();
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to share post. Try again.");
    }
  };

  const canShare = !!imageBase64 && caption.trim().length > 0;

  return (
    <Layout>
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-display font-bold text-foreground">
          New Post
        </h1>
        <button
          type="submit"
          form="upload-form"
          data-ocid="upload.share_button"
          disabled={!canShare || createPost.isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 transition-smooth hover:opacity-90 active:scale-95"
        >
          {createPost.isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Send size={15} />
          )}
          {createPost.isPending ? "Sharing…" : "Share"}
        </button>
      </header>

      <form
        id="upload-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-0 divide-y divide-border pb-24"
      >
        {/* Image picker / preview */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <img
                  src={preview}
                  alt="Selected preview"
                  className="w-full aspect-square object-cover"
                />
                <button
                  type="button"
                  data-ocid="upload.remove_image_button"
                  onClick={() => {
                    setPreview(null);
                    setImageBase64(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-foreground/60 text-background transition-smooth hover:bg-foreground/80 active:scale-95"
                  aria-label="Remove image"
                >
                  <X size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                data-ocid="upload.dropzone"
                className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-smooth ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/60 bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                >
                  <ImagePlus
                    size={32}
                    className={isDragging ? "text-primary" : "text-primary/70"}
                  />
                </motion.div>
                <div className="text-center px-4">
                  <p className="font-display font-semibold text-foreground text-sm">
                    {isDragging ? "Drop it here!" : "Add a photo"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tap or drag &amp; drop
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  data-ocid="upload.file_input"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processFile(file);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {errors.image && (
            <p
              data-ocid="upload.image_error"
              className="mt-2 text-xs text-destructive font-medium"
            >
              {errors.image}
            </p>
          )}
        </div>

        {/* Caption */}
        <div className="px-4 py-3">
          <textarea
            placeholder="Write a caption…"
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
              if (e.target.value.trim())
                setErrors((prev) => ({ ...prev, caption: undefined }));
            }}
            onBlur={() => {
              if (!caption.trim())
                setErrors((prev) => ({
                  ...prev,
                  caption: "Caption is required.",
                }));
            }}
            data-ocid="upload.caption_textarea"
            rows={4}
            className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none leading-relaxed"
          />
          {errors.caption && (
            <p
              data-ocid="upload.caption_error"
              className="mt-1 text-xs text-destructive font-medium"
            >
              {errors.caption}
            </p>
          )}
        </div>

        {/* Mark as product toggle */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Tag size={18} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">
              Mark as product
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isProduct}
            data-ocid="upload.product_toggle"
            onClick={() => setIsProduct((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-smooth ${
              isProduct ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-primary-foreground shadow-sm transition-smooth ${
                isProduct ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Product fields */}
        <AnimatePresence>
          {isProduct && (
            <motion.div
              key="product-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                <input
                  type="text"
                  placeholder="Product title"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  data-ocid="upload.product_title_input"
                  className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                />
                <input
                  type="text"
                  placeholder="Price (e.g. $29.99)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  data-ocid="upload.price_input"
                  className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                />
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    data-ocid="upload.category_select"
                    className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth appearance-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-xs">
                    ▼
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Layout>
  );
}
