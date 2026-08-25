import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Camera,
  Loader2,
  CheckCircle2,
  XCircle,
  KeyRound,
  Sparkles,
  Save,
  Lock,
  ExternalLink,
  Info,
  X,
  ShieldCheck,
  Trash2,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getMe,
  updateProfile,
  getAvatarPresignedUrl,
  uploadAvatarToS3,
  checkUsernameAvailability,
} from "../services/auth.api";
import type { UserProfile } from "../types/auth.types";
import AvatarCropperModal from "../components/AvatarCropperModal";

export const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropperData, setCropperData] = useState<{
    src: string;
    fileName: string;
  } | null>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingAvatarKey, setPendingAvatarKey] = useState<string | null>(null);

  // Username validation states
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid" | "current"
  >("idle");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setProfile(data);
        setUsername(data.username || "");
        setBio(data.bio || "");
        setAvatarPreview(data.avatarUrl || null);
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        if (err?.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Debounced username availability check
  useEffect(() => {
    if (!profile) return;

    const clean = username.trim().toLowerCase();
    if (!clean) {
      setUsernameStatus("invalid");
      setUsernameMsg("Username cannot be empty");
      return;
    }

    // If it matches the current username, it's valid & current
    if (profile.username && clean === profile.username.toLowerCase()) {
      setUsernameStatus("current");
      setUsernameMsg("Your current username");
      return;
    }

    if (clean.length < 3 || clean.length > 30) {
      setUsernameStatus("invalid");
      setUsernameMsg("Username must be between 3 and 30 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(clean)) {
      setUsernameStatus("invalid");
      setUsernameMsg("Only letters, numbers, _, -, and . allowed");
      return;
    }

    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailability(clean);
        if (res.available) {
          setUsernameStatus("available");
          setUsernameMsg("Username is available!");
        } else {
          setUsernameStatus("taken");
          setUsernameMsg(res.message || "Username is already taken");
        }
      } catch (err: any) {
        setUsernameStatus("taken");
        setUsernameMsg(err?.response?.data?.message || "Username is already taken");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username, profile]);

  // Handle initial avatar file selection -> Open Cropper Modal
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be selected again
    e.target.value = "";

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size cannot exceed 5MB. Only PNG and JPG formats are supported.");
      return;
    }

    // Validate format: only PNG and JPG
    const validMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validMimeTypes.includes(file.type)) {
      toast.error("Only PNG and JPG/JPEG image formats are supported.");
      return;
    }

    // Read image as Data URL and open cropper
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCropperData({
          src: reader.result,
          fileName: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle final cropped avatar upload to S3
  const handleCroppedAvatarUpload = async (croppedFile: File) => {
    setCropperData(null);
    setUploadingAvatar(true);

    const toastId = toast.loading("Verifying and uploading profile photo...");
    const previousPreview = avatarPreview;

    try {
      // 1. Get presigned upload URL for cropped image
      const { uploadUrl, fileKey } = await getAvatarPresignedUrl(
        croppedFile.name,
        croppedFile.type
      );

      // 2. Direct PUT to S3
      await uploadAvatarToS3(uploadUrl, croppedFile);

      // 3. Auto-save avatarKey to user profile (runs AWS Rekognition moderation)
      const updated = await updateProfile({ avatarKey: fileKey });

      if (updated.user.avatarUrl) {
        setAvatarPreview(updated.user.avatarUrl);
      } else {
        const localPreviewUrl = URL.createObjectURL(croppedFile);
        setAvatarPreview(localPreviewUrl);
      }

      setPendingAvatarKey(null);
      setProfile((prev) => (prev ? { ...prev, ...updated.user } : updated.user));
      toast.success("Profile photo verified & updated successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      // Revert preview so rejected photo is not displayed
      setAvatarPreview(previousPreview);
      setPendingAvatarKey(null);

      const isModerationError = err?.response?.data?.code === "MODERATION_REJECTED";

      if (isModerationError) {
        toast.error("This image violates our community safety policy and cannot be used.", {
          id: toastId,
          duration: 5000,
        });
      } else {
        toast.error(
          err?.response?.data?.message || err?.message || "Failed to upload profile photo. Please try again.",
          { id: toastId }
        );
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle avatar removal (revert to initials)
  const handleRemoveAvatar = async () => {
    const toastId = toast.loading("Removing profile photo...");
    try {
      setUploadingAvatar(true);
      const updated = await updateProfile({ avatarKey: "" });
      setAvatarPreview(null);
      setPendingAvatarKey(null);
      setProfile((prev) => (prev ? { ...prev, ...updated.user, avatarUrl: undefined } : updated.user));
      toast.success("Profile photo removed successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove avatar.", { id: toastId });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Submit profile updates (bio, username)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      toast.error("Please choose a valid and available username");
      return;
    }

    if (bio.length > 500) {
      toast.error("Bio cannot exceed 500 characters");
      return;
    }

    const toastId = toast.loading("Saving profile changes...");

    try {
      setSaving(true);
      const res = await updateProfile({
        username: cleanUsername,
        bio: bio.trim(),
        avatarKey: pendingAvatarKey || undefined,
      });

      setProfile((prev) => (prev ? { ...prev, ...res.user } : res.user));
      setPendingAvatarKey(null);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Profile update failed:", err);
      toast.error(
        err?.response?.data?.message || "Failed to update profile. Please try again.",
        { id: toastId }
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (!profile) return;
    setUsername(profile.username || "");
    setBio(profile.bio || "");
    toast("Changes discarded", { icon: "↩️" });
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const isTeacher = profile?.role === "TEACHER";
  const userInitial = (profile?.username ? profile.username[0] : profile?.email[0] || "U").toUpperCase();
  const isDirty =
    (profile?.username || "").toLowerCase() !== username.trim().toLowerCase() ||
    (profile?.bio || "").trim() !== bio.trim();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
      />

      {/* Sticky Top Header Action Bar */}
      <div className="sticky top-3 z-30 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 sm:px-6 py-3 shadow-md flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
              {profile?.username ? `@${profile.username}` : "Account Profile"}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                }`}
              />
              <p className="text-[11px] text-slate-500 font-medium">
                {isDirty ? "Unsaved changes" : "All changes saved"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={saving}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              title="Revert form changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discard</span>
            </button>
          )}

          <button
            type="submit"
            form="profile-settings-form"
            disabled={
              saving ||
              uploadingAvatar ||
              usernameStatus === "taken" ||
              usernameStatus === "invalid" ||
              !isDirty
            }
            className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner Gradient */}
        <div
          className={`h-36 sm:h-44 w-full ${
            isTeacher
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500"
              : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500"
          } relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/20" />
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isTeacher ? "Educator Profile" : "Student Profile"}</span>
          </div>
        </div>

        {/* User Card Content */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with Camera Trigger (1:1 Circle) */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full aspect-square ring-4 ring-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={profile?.username || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center text-4xl sm:text-5xl font-black ${
                      isTeacher
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                        : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                    }`}
                  >
                    {userInitial}
                  </div>
                )}

                {/* Uploading Overlay */}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-7 h-7 animate-spin mb-1 text-blue-400" />
                    <span className="text-[11px] font-semibold">Uploading...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Avatar */}
              <div className="absolute bottom-1 right-0 flex items-center gap-1.5">
                {/* Upload Trigger Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="p-2.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
                  title="Upload profile photo (PNG / JPG)"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Remove Avatar Button (if custom avatar exists) */}
                {(avatarPreview || profile?.avatarUrl) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={uploadingAvatar}
                    className="p-2.5 bg-red-600/90 hover:bg-red-700 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
                    title="Remove custom profile photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Profile Identification */}
            <div className="text-center sm:text-left flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {profile?.username ? `@${profile.username}` : "Your Account"}
                </h1>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Safety Active</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isTeacher
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  <User className="w-3 h-3" />
                  {isTeacher ? "Teacher" : "Student"}
                </span>
                {profile?.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                    <CheckCircle2 className="w-3 h-3 text-sky-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-mono">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Settings Form */}
      <form id="profile-settings-form" onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Public Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Public Details</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Customize how your name and identity appear across classrooms and discussions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Username Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-800">
                  Username (Handle)
                </label>
                {usernameMsg && (
                  <span
                    className={`text-xs font-semibold ${
                      usernameStatus === "available" || usernameStatus === "current"
                        ? "text-emerald-600"
                        : usernameStatus === "checking"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {usernameMsg}
                  </span>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  @
                </div>
                <input
                  type="text"
                  value={username}
                  required
                  minLength={3}
                  maxLength={30}
                  onChange={(e) =>
                    setUsername(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, "")
                    )
                  }
                  className={`w-full pl-9 pr-11 py-3 bg-slate-50 border rounded-2xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    usernameStatus === "available" || usernameStatus === "current"
                      ? "border-emerald-400 focus:ring-emerald-500/20"
                      : usernameStatus === "taken" || usernameStatus === "invalid"
                      ? "border-red-400 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                  placeholder="alex_rivera"
                  disabled={saving}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                  {usernameStatus === "checking" && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                  {(usernameStatus === "available" || usernameStatus === "current") && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                  {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Letters, numbers, underscores, hyphens, and dots (3-30 characters).
              </p>
            </div>

            {/* Bio Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-800">
                  Bio / About
                </label>
                <span className="text-xs text-slate-400 font-mono">
                  {bio.length}/500
                </span>
              </div>
              <textarea
                value={bio}
                maxLength={500}
                rows={4}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400 resize-none"
                placeholder="Tell your students or classmates a little about yourself, your subjects, or study goals..."
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Account & Security */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Account &amp; Security</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage your linked credentials and account permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address</span>
                </span>
                <p className="font-semibold text-slate-800 text-sm font-mono truncate">
                  {profile?.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                className="self-start text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Change Email</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Role Box (Read-Only) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account Role</span>
                </span>
                <p className="font-bold text-slate-800 text-sm">
                  {profile?.role === "TEACHER" ? "Teacher / Educator" : "Student"}
                </p>
              </div>

              <span className="text-[11px] text-slate-400 font-medium">
                Roles are permanent and cannot be modified.
              </span>
            </div>

            {/* Password Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 sm:col-span-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Account Password</h4>
                  <p className="text-xs text-slate-500">
                    Reset or change your account password securely via email OTP.
                  </p>
                </div>
              </div>

              <Link
                to="/forgot-password"
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Reset Password</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </form>

      {/* Change Email Informative Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Change Email</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-slate-600 text-sm">
                <p>
                  Your current email is <strong className="text-slate-900 font-mono">{profile?.email}</strong>.
                </p>
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Email address migration logic with security verification is currently being configured and will be available in an upcoming release.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}

        {/* Avatar Crop / Resize / Zoom Modal */}
        {cropperData && (
          <AvatarCropperModal
            imageSrc={cropperData.src}
            fileName={cropperData.fileName}
            onCrop={handleCroppedAvatarUpload}
            onClose={() => setCropperData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
