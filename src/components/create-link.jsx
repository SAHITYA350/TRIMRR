import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRef, useState } from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { UrlState } from "@/context";
import { QRCode } from "react-qrcode-logo";

export function CreateLink({ setUrls }) {
  const { user } = UrlState();
  const navigate = useNavigate();
  const ref = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "", 
    longUrl: longLink || "",
    customUrl: "",
  });

  const schema = yup.object({
    title: yup.string().required("Title is required"),
    longUrl: yup.string().url("Must be a valid URL").required(),
    customUrl: yup.string(),
  });


  const { loading, error, fn } = useFetch(createUrl);

  const handleChange = (e) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current?.canvasRef?.current;
      const blob = await new Promise((res) => canvas.toBlob(res));

      const data = await fn(
        {
          ...formValues,
          user_id: user.id,
        },
        blob
      );

      // ✅ instant UI update
      setUrls?.((prev) => [data[0], ...prev]);

      navigate(`/link/${data[0].id}`);
    } catch (err) {
      if (err.inner) {
        const newErrors = {};
        err.inner.forEach((e) => (newErrors[e.path] = e.message));
        setErrors(newErrors);
      }
    }
  };

  return (
    <Dialog
      defaultOpen={!!longLink}
      onOpenChange={(open) => !open && setSearchParams({})}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New
          </DialogTitle>
        </DialogHeader>

        {formValues.longUrl && (
          <QRCode ref={ref} size={250} value={formValues.longUrl} />
        )}

        <Input id="title" placeholder="Title" onChange={handleChange} />
        {errors.title && <Error message={errors.title} />}

        <Input id="longUrl" placeholder="Long URL" onChange={handleChange} />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-2">
          <Card className="p-2">trimrr.in</Card> /
          <Input id="customUrl" placeholder="Custom URL" onChange={handleChange} />
        </div>

        {error && <Error message={error.message} />}

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}