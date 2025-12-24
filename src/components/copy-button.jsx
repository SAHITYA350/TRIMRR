import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";

const CopyButton = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `https://trimrr.in/${url.custom_url || url.short_url}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className="flex items-center gap-1"
    >
      {copied ? (
        <>
          <Check size={18} className="text-green-500" />
          <span className="text-xs text-green-500 hidden sm:inline">
            Copied
          </span>
        </>
      ) : (
        <Copy size={18} />
      )}
    </Button>
  );
};

export default CopyButton;
