import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();

  const { loading, data, fn: fetchLongUrl } = useFetch(getLongUrl);

  useEffect(() => {
    if (id) {
      fetchLongUrl(id);
    }
  }, [id]);

  useEffect(() => {
    if (!loading && data?.original_url) {
      storeClicks({
        id: data.id,
        originalUrl: data.original_url,
      });

      // 🚀 ACTUAL REDIRECT
      window.location.href = data.original_url;
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="p-4">
        <BarLoader width="100%" color="#36d7b7" />
        <p className="mt-2 text-sm">Redirecting...</p>
      </div>
    );
  }

  if (!loading && data === null) {
    return (
      <div className="p-4 text-center text-red-400">
        Link not found
      </div>
    );
  }

  return null;
};

export default RedirectLink;
