import { Download, LinkIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import CopyButton from "./copy-button";

const LinkCard = ({ url, setUrls }) => {
  const { loading, fn } = useFetch(deleteUrl);

  const handleDelete = async () => {
    await fn({ id: url.id, user_id: url.user_id });
    setUrls((prev) => prev.filter((u) => u.id !== url.id));
  };

  const downloadImage = async () => {
    const res = await fetch(url.qr);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${url.title || "qr-code"}.png`;
    a.click();

    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="relative">

      {/* 🔄 Delete Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/60">
          <BeatLoader color="#fff" />
        </div>
      )}

      <div
        className={`flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:flex-row sm:gap-6
        ${loading ? "pointer-events-none opacity-60" : ""}`}
      >

        {/* QR */}
        <div className="flex justify-center sm:justify-start">
          <img
            src={url.qr}
            alt="qr code"
            className="h-28 w-28 rounded-lg ring-2 ring-blue-500"
          />
        </div>

        {/* CONTENT */}
        <Link
          to={`/link/${url.id}`}
          className="flex flex-1 flex-col gap-1 break-all"
        >
          <h2 className="text-lg sm:text-2xl font-extrabold hover:underline">
            {url.title}
          </h2>

          <p className="text-sm sm:text-lg text-blue-400 font-semibold hover:underline break-all">
            https://trimrr.in/{url.custom_url || url.short_url}
          </p>

          <p className="flex items-start gap-1 text-xs sm:text-sm text-gray-300 break-all">
            <LinkIcon size={14} className="mt-0.5 shrink-0" />
            {url.original_url}
          </p>

          <span className="mt-2 text-xs text-gray-400">
            {new Date(url.created_at).toLocaleString()}
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex flex-row justify-end gap-2 sm:flex-col sm:justify-start">
          <CopyButton url={url} />

          <Button size="icon" variant="ghost" onClick={downloadImage} disabled={loading}>
            <Download size={18} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            disabled={loading}
            onClick={handleDelete}
          >
            <Trash size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
