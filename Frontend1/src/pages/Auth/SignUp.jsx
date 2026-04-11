import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (!fullName) return setError("Please enter your name");
    if (!validateEmail(email)) return setError("Please enter a valid email address.");
    if (!password || password.length < 8) {
      return setError("Password must be at least 8 characters long");
    }

    setError("");
    setLoading(true); 

    try {
      let uploadedUrl = "";

      // 2. Upload Image (Using the plain axios version we fixed)
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        // Handle both possible response structures

        if (imgUploadRes) {
        uploadedUrl = imgUploadRes?.imageUrl || imgUploadRes?.url || "";
        console.log("Upload Success! URL:", uploadedUrl);
      } else {
        console.error("Image upload failed, continuing with empty URL");
      }
    }

      // 3. Register with Backend
      // Matches backend field: profileImageUrl
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { 
        fullName,
        email,
        password,
        profileImageUrl: uploadedUrl,
      });
            
      // 4. Handle Success
      if (response.data && response.data.token) {
        // CRITICAL: Set token in localStorage immediately
        localStorage.setItem("token", response.data.token);
        
        // Update context so SideMenu sees the image immediately
        updateUser({
          ...response.data.user,
          profileImageUrl: uploadedUrl
        });
        
        // Replace: true prevents back-button issues
        // Timeout prevents "Not authorized" race condition
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 600);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Invalid URL or Server Error. Check console.");
      setLoading(false); // Only stop loading if it fails
    }  
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-2xl font-medium text-slate-900 dark:text-white transition-colors">Create an Account</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-[5px] mb-6 transition-colors">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />
            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="At least 8 characters"
                type="password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs py-2">{error}</p>}

          <button 
            type="submit" 
            className="btn-primary mt-2 mt-4 py-3 rounded-lg shadow-xl shadow-violet-600/10 hover:scale-[1.01] transition-all" 
            disabled={loading} 
          >
            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>

          <p className="text-[14px] text-slate-800 dark:text-slate-300 mt-5 text-center md:text-left transition-colors">
            Already have an account?{" "}
            <Link className="font-medium text-primary dark:text-violet-400 underline decoration-2 underline-offset-4" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;