import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { BeatLoader } from "react-spinners";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Error from "@/components/error";

import useFetch from "@/hooks/use-fetch";
import { signup } from "@/db/apiAuth";
import { CircleX, LucideDelete } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const [errors, setErrors] = useState({});

  const { data, error, loading, fn: fnSignup } = useFetch(signup);

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    if (!error && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [data, error, navigate, longLink]);

  /* -------------------- Handlers -------------------- */
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const removeProfilePic = () => {
    if (formData.profile_pic) {
      URL.revokeObjectURL(formData.profile_pic);
    }

    setFormData((prev) => ({ ...prev, profile_pic: null }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setErrors((prev) => ({ ...prev, profile_pic: null }));
  };

  const handleSignup = async () => {
    setErrors({});

    try {
      const schema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup(formData);
    } catch (err) {
      if (err?.inner) {
        const formErrors = {};
        err.inner.forEach((e) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      }
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Card className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Signup</CardTitle>
        <CardDescription className="text-slate-400">
          Create a new account if you haven’t already
        </CardDescription>
        {error && <Error message={error} />}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Name */}
        <div>
          <Input
            name="name"
            placeholder="Enter name"
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name} />}
        </div>

        {/* Email */}
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>

        {/* Password */}
        <div>
          <Input
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>

        {/* Profile Picture */}
        <div className="space-y-2">
          <span className="text-sm text-slate-400">Profile Picture</span>

          <div className="flex items-center gap-4">
            {/* Preview */}
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-slate-700">
              {formData.profile_pic ? (
                <>
                  <img
                    src={URL.createObjectURL(formData.profile_pic)}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
  type="button"
  onClick={removeProfilePic}
  className="
    absolute top-0.5 left-0.5 right-1
    h-15 w-15 rounded-full animate-pulse cursor-pointer
   text-[#ffffff] text-5xl
    flex items-center justify-center
    shadow-md hover:bg-transparent
  "
>
  <CircleX />
</button>

                </>
              ) : (
                <span className="flex h-full items-center justify-center text-xs text-slate-400">
                  No Image
                </span>
              )}
            </div>

            {/* Upload */}
            <label
              htmlFor="profile_pic"
              className="cursor-pointer rounded-md border border-slate-600 px-4 py-2 text-sm
                         hover:bg-slate-700 transition"
            >
              Choose Image
            </label>

            <input
              ref={fileInputRef}
              id="profile_pic"
              name="profile_pic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>

          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSignup} disabled={loading} className="cursor-pointer">
          {loading ? <BeatLoader size={10} color="black"/> : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
