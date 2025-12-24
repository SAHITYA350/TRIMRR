import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Error from "@/components/error";
import LinkCard from "@/components/link-card";
import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import { UrlState } from "@/context";
import { Button } from "@/components/ui/button";
import { CreateLink } from "@/components/create-link";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [urls, setUrls] = useState([]); // ✅ local state
  const { user } = UrlState();

  const {
    loading,
    error,
    fn: fnUrls,
  } = useFetch(getUrls);

  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(getClicksForUrls);

  // Fetch URLs
  useEffect(() => {
    if (!user?.id) return;

    fnUrls(user.id).then((res) => {
      setUrls(res || []);
    });
  }, [user?.id]);

  // Fetch clicks
  useEffect(() => {
    if (!urls.length) return;
    fnClicks(urls.map((url) => url.id));
  }, [urls.length]);

  const filteredUrls = urls.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {(loading || (loadingClicks && !clicks)) && (
        <BarLoader width="100%" color="#fff" />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <CreateLink />
      </div>

      <div className="relative">
        <Input
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>

      {error && <Error message={error.message} />}

      {filteredUrls.map((url) => (
        <LinkCard
          key={url.id}                 // ✅ stable key
          url={url}
          setUrls={setUrls}            // ✅ pass setter
        />
      ))}
    </div>
  );
};

export default Dashboard;
