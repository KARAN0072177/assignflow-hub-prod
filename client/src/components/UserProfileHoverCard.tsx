import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  GraduationCap,
  User,
  Copy,
  Check,
  Loader2,
  Calendar,
} from "lucide-react";
import { getProfileCard, type PublicProfileCard } from "../services/auth.api";

interface UserProfileHoverCardProps {
  identifier: string;
  userId?: string;
  children: React.ReactNode;
  fallbackName?: string;
  fallbackRole?: string;
  className?: string;
}

export const UserProfileHoverCard = ({
  identifier,
  userId,
  children,
  fallbackName,
  fallbackRole,
  className = "",
}: UserProfileHoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<PublicProfileCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);

  const cleanIdentifier = identifier.trim().replace(/^@/, "");
  const queryKey = (userId || identifier || "").trim().replace(/^@/, "");

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    openTimeoutRef.current = setTimeout(async () => {
      setIsOpen(true);
      if (!profile && queryKey) {
        setLoading(true);
        try {
          const data = await getProfileCard(queryKey);
          setProfile(data);
        } catch (err) {
          console.debug("Failed to fetch profile card for hover persona:", err);
        } finally {
          setLoading(false);
        }
      }
    }, 180);
  };

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const handleCopyEmail = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const isTeacher = (profile?.role || fallbackRole) === "TEACHER";
  const displayName = profile?.username
    ? `@${profile.username}`
    : fallbackName
    ? fallbackName.startsWith("@")
      ? fallbackName
      : `@${fallbackName}`
    : `@${cleanIdentifier}`;

  const emailDisplay = profile?.email || (cleanIdentifier.includes("@") ? cleanIdentifier : null);
  const initial = (
    profile?.username
      ? profile.username[0]
      : fallbackName
      ? fallbackName.replace(/^@/, "")[0]
      : cleanIdentifier[0] || "U"
  ).toUpperCase();

  const formattedDate = profile?.joinedAt
    ? new Date(profile.joinedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block ${className}`}
    >
      <span className="cursor-pointer hover:underline focus:outline-none">
        {children}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute bottom-full left-0 mb-2 z-50 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-left pointer-events-auto"
            style={{ filter: "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.12))" }}
          >
            {/* Top Banner (Teams Style) */}
            <div
              className={`h-16 w-full ${
                isTeacher
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500"
              } relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-2xs" />
              <div className="absolute top-2.5 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-black/25 backdrop-blur-sm rounded-full text-white text-[10px] font-semibold">
                {isTeacher ? (
                  <>
                    <GraduationCap className="w-3 h-3 text-blue-200" />
                    <span>Instructor</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-emerald-200" />
                    <span>Student</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile Body */}
            <div className="px-4 pb-4 pt-0 relative">
              {/* Avatar + Status Indicator */}
              <div className="flex items-end justify-between -mt-9 mb-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full aspect-square ring-3 ring-white shadow-md overflow-hidden bg-slate-100 flex items-center justify-center">
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center text-xl font-extrabold ${
                          isTeacher
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                            : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                        }`}
                      >
                        {initial}
                      </div>
                    )}
                  </div>
                  {/* Teams Green Status Dot */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
                    title="Active"
                  />
                </div>

                {/* Email Action */}
                {emailDisplay && (
                  <div className="flex items-center gap-1.5 pb-0.5">
                    <a
                      href={`mailto:${emailDisplay}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-xl transition-colors cursor-pointer"
                      title={`Send email to ${emailDisplay}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopyEmail(e, emailDisplay)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
                      title="Copy email address"
                    >
                      {copiedEmail ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* User Identity */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-sm">{displayName}</h4>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isTeacher
                        ? "bg-blue-50 text-blue-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {isTeacher ? "Instructor" : "Student"}
                  </span>
                </div>

                {emailDisplay && (
                  <p className="text-xs text-slate-500 font-mono truncate">
                    {emailDisplay}
                  </p>
                )}
              </div>

              {/* Bio Section */}
              {loading ? (
                <div className="py-3 flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  <span>Loading user details...</span>
                </div>
              ) : profile?.bio ? (
                <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">
                    &ldquo;{profile.bio}&rdquo;
                  </p>
                </div>
              ) : null}

              {/* Card Footer (Joined Date) */}
              {formattedDate && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Joined {formattedDate}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-600 font-medium">AssignFlow Member</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default UserProfileHoverCard;
