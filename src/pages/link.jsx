import CopyButton from "@/components/copy-button";
import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { LinkIcon, Download, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const Link = () => {
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();

  // URL data
  const {
    loading: loadingUrl,
    data: url,
    fn: fetchUrl,
    error,
  } = useFetch(() => getUrl({ id, user_id: user?.id }));

  // Stats data
  const {
    loading: loadingStats,
    data: stats,
    fn: fetchStats,
  } = useFetch(() => getClicksForUrl(id));

  // Delete
  const {
    loading: loadingDelete,
    fn: deleteLink,
  } = useFetch(() => deleteUrl(id));

  // Fetch data once user is ready
  useEffect(() => {
    if (!user?.id) return;

    fetchUrl();
    fetchStats();
  }, [user?.id]);

  // Redirect on error
  useEffect(() => {
    if (error) navigate("/dashboard");
  }, [error, navigate]);

  const handleDelete = async () => {
    await deleteLink();
    navigate("/dashboard");
  };

  const downloadImage = async () => {
    if (!url?.qr) return;

    const res = await fetch(url.qr);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${url.title || "qr-code"}.png`;
    a.click();

    URL.revokeObjectURL(blobUrl);
  };

  const shortLink = url?.custom_url || url?.short_url;

  const isLoading = loadingUrl || loadingStats;

  return (
    <>
      {/* Global loader */}
      {isLoading && (
        <BarLoader className="mb-6" width="100%" color="#fff" />
      )}

      <div className="flex flex-col gap-8 sm:flex-row justify-between">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6 sm:w-2/5">

          {loadingUrl ? (
            <BeatLoader />
          ) : (
            <>
              <span className="text-6xl font-extrabold">
                {url?.title}
              </span>

             <a
                // href={`https://trimrr.in/${shortLink}`}
                href={`https://trimrr-dun.vercel.app/${shortLink}`}
                target="_blank"
                className="text-3xl text-blue-400 font-bold hover:underline"
              >
                {/* https://trimrr.in/{shortLink} */}
               https://trimrr-dun.vercel.app/{shortLink}
              </a> 

              <a
                href={url?.original_url}
                target="_blank"
                className="flex items-center gap-1 hover:underline"
              >
                <LinkIcon size={16} />
                {url?.original_url}
              </a>

              <span className="text-sm font-extralight">
                {new Date(url?.created_at).toLocaleString()}
              </span>

              <div className="flex gap-2">
                <CopyButton url={url} />

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={downloadImage}
                  disabled={loadingUrl}
                >
                  <Download size={18} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={loadingDelete}
                >
                  {loadingDelete ? <BeatLoader size={8} /> : <Trash size={18} />}
                </Button>
              </div>

              <img
                src={url?.qr}
                className="w-full ring ring-blue-500 p-1 object-contain"
                alt="qr code"
              />
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">
              Stats
            </CardTitle>
          </CardHeader>

          {loadingStats ? (
            <CardContent className="flex justify-center py-12">
              <BeatLoader />
            </CardContent>
          ) : stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {stats.length}
                  </p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />

              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent className="text-center py-12 text-muted-foreground">
              No statistics yet
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link;
