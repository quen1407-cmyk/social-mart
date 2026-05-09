import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, a as ue } from "./index-CgYOV5jf.js";
import { L as Layout } from "./Layout-B60O5qPC.js";
import { u as useAuth } from "./index-BikGRg3B.js";
import { a as useCreatePost } from "./useQueries-B3XIVZSS.js";
import { c as createLucideIcon, m as motion } from "./proxy-BwgDIH52.js";
import { S as Send } from "./send-C19q2KBk.js";
import { A as AnimatePresence } from "./index-C5JKQtdB.js";
import { X } from "./x-DcXq6A6d.js";
import { T as Tag } from "./tag-BLMLDK9F.js";
import "./user-D4VcQ6pj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
const CATEGORIES = [
  "Fashion",
  "Tech",
  "Food",
  "Art",
  "Home",
  "Sports",
  "Beauty",
  "Other"
];
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
function UploadPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const [preview, setPreview] = reactExports.useState(null);
  const [imageBase64, setImageBase64] = reactExports.useState(null);
  const [caption, setCaption] = reactExports.useState("");
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [isProduct, setIsProduct] = reactExports.useState(false);
  const [productTitle, setProductTitle] = reactExports.useState("");
  const [price, setPrice] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("Other");
  const [errors, setErrors] = reactExports.useState(
    {}
  );
  const fileInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/auth/login" });
  }, [isAuthenticated, navigate]);
  const processFile = async (file) => {
    if (!file.type.startsWith("image/")) return;
    try {
      const base64 = await readFileAsBase64(file);
      setImageBase64(base64);
      setPreview(base64);
      setErrors((prev) => ({ ...prev, image: void 0 }));
    } catch {
      ue.error("Could not read image file.");
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };
  const handleDragOver = (e) => {
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
    const newErrors = {};
    if (!imageBase64) newErrors.image = "Please select an image.";
    if (!caption.trim()) newErrors.caption = "Caption is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !imageBase64) return;
    try {
      await createPost.mutateAsync({
        imageUrl: imageBase64,
        caption: caption.trim()
      });
      ue.success("Post shared! 🚀");
      resetForm();
      navigate({ to: "/" });
    } catch {
      ue.error("Failed to share post. Try again.");
    }
  };
  const canShare = !!imageBase64 && caption.trim().length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-display font-bold text-foreground", children: "New Post" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "submit",
          form: "upload-form",
          "data-ocid": "upload.share_button",
          disabled: !canShare || createPost.isPending,
          className: "flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 transition-smooth hover:opacity-90 active:scale-95",
          children: [
            createPost.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 15 }),
            createPost.isPending ? "Sharing…" : "Share"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        id: "upload-form",
        onSubmit: handleSubmit,
        className: "flex flex-col gap-0 divide-y divide-border pb-24",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.96 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.96 },
                transition: { duration: 0.2 },
                className: "relative rounded-2xl overflow-hidden",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: preview,
                      alt: "Selected preview",
                      className: "w-full aspect-square object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "upload.remove_image_button",
                      onClick: () => {
                        setPreview(null);
                        setImageBase64(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      },
                      className: "absolute top-3 right-3 p-2 rounded-full bg-foreground/60 text-background transition-smooth hover:bg-foreground/80 active:scale-95",
                      "aria-label": "Remove image",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
                    }
                  )
                ]
              },
              "preview"
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.96 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.96 },
                transition: { duration: 0.2 },
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                onDrop: handleDrop,
                onDragOver: handleDragOver,
                onDragLeave: handleDragLeave,
                "data-ocid": "upload.dropzone",
                className: `aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-smooth ${isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 bg-muted/30 hover:bg-muted/50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      animate: isDragging ? { scale: 1.1 } : { scale: 1 },
                      transition: { type: "spring", stiffness: 400 },
                      className: "h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ImagePlus,
                        {
                          size: 32,
                          className: isDragging ? "text-primary" : "text-primary/70"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center px-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm", children: isDragging ? "Drop it here!" : "Add a photo" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Tap or drag & drop" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: fileInputRef,
                      type: "file",
                      accept: "image/*",
                      "data-ocid": "upload.file_input",
                      className: "hidden",
                      onChange: (e) => {
                        var _a;
                        const file = (_a = e.target.files) == null ? void 0 : _a[0];
                        if (file) processFile(file);
                      }
                    }
                  )
                ]
              },
              "dropzone"
            ) }),
            errors.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "upload.image_error",
                className: "mt-2 text-xs text-destructive font-medium",
                children: errors.image
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                placeholder: "Write a caption…",
                value: caption,
                onChange: (e) => {
                  setCaption(e.target.value);
                  if (e.target.value.trim())
                    setErrors((prev) => ({ ...prev, caption: void 0 }));
                },
                onBlur: () => {
                  if (!caption.trim())
                    setErrors((prev) => ({
                      ...prev,
                      caption: "Caption is required."
                    }));
                },
                "data-ocid": "upload.caption_textarea",
                rows: 4,
                className: "w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none leading-relaxed"
              }
            ),
            errors.caption && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "upload.caption_error",
                className: "mt-1 text-xs text-destructive font-medium",
                children: errors.caption
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 18, className: "text-secondary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Mark as product" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                role: "switch",
                "aria-checked": isProduct,
                "data-ocid": "upload.product_toggle",
                onClick: () => setIsProduct((v) => !v),
                className: `relative h-6 w-11 rounded-full transition-smooth ${isProduct ? "bg-primary" : "bg-muted"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-primary-foreground shadow-sm transition-smooth ${isProduct ? "translate-x-5" : "translate-x-0"}`
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
              transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
              className: "overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Product title",
                    value: productTitle,
                    onChange: (e) => setProductTitle(e.target.value),
                    "data-ocid": "upload.product_title_input",
                    className: "w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Price (e.g. $29.99)",
                    value: price,
                    onChange: (e) => setPrice(e.target.value),
                    "data-ocid": "upload.price_input",
                    className: "w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: category,
                      onChange: (e) => setCategory(e.target.value),
                      "data-ocid": "upload.category_select",
                      className: "w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth appearance-none",
                      children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-xs", children: "▼" })
                ] })
              ] })
            },
            "product-fields"
          ) })
        ]
      }
    )
  ] });
}
export {
  UploadPage as default
};
