"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaLeaf,
  FaInbox,
  FaEnvelope,
  FaEnvelopeOpen,
  FaStar,
  FaRegStar,
  FaBoxArchive,
  FaTrashCan,
  FaPaperPlane,
  FaMagnifyingGlass,
  FaRotateRight,
  FaArrowLeft,
  FaReply,
  FaArrowUpRightFromSquare,
  FaPhone,
  FaCircleCheck,
  FaCircleExclamation,
  FaSpinner,
  FaRightFromBracket,
  FaBars,
  FaXmark,
  FaFilter,
  FaWpforms,
} from "react-icons/fa6";
import { EmailRecord, EmailReplyRecord, DashboardStats } from "@/lib/email/storage-types";

type FolderType = "inbox" | "unread" | "starred" | "contact_form" | "sent" | "archived" | "trash";

export default function AdminEmailsDashboard() {
  const router = useRouter();

  // Navigation & filtering state
  const [currentFolder, setCurrentFolder] = useState<FolderType>("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<"all" | "inbound" | "contact_form">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Data state
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null);
  const [replies, setReplies] = useState<EmailReplyRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    inbox: 0,
    unread: 0,
    starred: 0,
    contactForm: 0,
    sent: 0,
    archived: 0,
    trash: 0,
  });

  // UI state
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Reply Composer State
  const [isReplying, setIsReplying] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Show temporary toast notification
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fetch dashboard stats for badges
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/emails/stats");
      if (res.status === 401) {
        router.push("/admin/emails/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch email stats:", err);
    }
  }, [router]);

  // Fetch email list
  const fetchEmails = useCallback(async () => {
    setLoadingList(true);
    try {
      const params = new URLSearchParams();
      params.set("folder", currentFolder);
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }
      if (selectedSourceFilter !== "all") {
        params.set("source", selectedSourceFilter);
      }

      const res = await fetch(`/api/emails?${params.toString()}`);
      if (res.status === 401) {
        router.push("/admin/emails/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);

        // Auto-select first email on desktop if none selected
        setSelectedEmailId((prev) => {
          if (!prev && data.emails?.length > 0 && typeof window !== "undefined" && window.innerWidth >= 1024) {
            return data.emails[0].id;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Failed to fetch emails:", err);
      showToast("Failed to load emails", "error");
    } finally {
      setLoadingList(false);
      fetchStats();
    }
  }, [currentFolder, searchQuery, selectedSourceFilter, router, fetchStats]);

  // Fetch detail for selected email
  const fetchEmailDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/emails/${id}`);
      if (res.status === 401) {
        router.push("/admin/emails/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSelectedEmail(data.email);
        setReplies(data.replies || []);

        // Prepare reply composer defaults
        const cleanSubj = data.email.subject.startsWith("Re:")
          ? data.email.subject
          : `Re: ${data.email.subject}`;
        setReplySubject(cleanSubj);

        // Mark as read if not already read
        if (!data.email.isRead) {
          await fetch(`/api/emails/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true }),
          });

          // Update local state and stats
          setEmails((prev) =>
            prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
          );
          setSelectedEmail((prev) => (prev ? { ...prev, isRead: true } : null));
          fetchStats();
        }
      }
    } catch (err) {
      console.error("Failed to load email details:", err);
      showToast("Failed to load conversation", "error");
    } finally {
      setLoadingDetail(false);
    }
  }, [router, fetchStats]);

  const [authChecked, setAuthChecked] = useState(false);

  // Initial auth verification and load
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/emails/login");
        } else {
          setAuthChecked(true);
          fetchEmails();
        }
      })
      .catch(() => {
        router.push("/admin/emails/login");
      });
  }, [fetchEmails, router]);


  // Load detail whenever selected ID changes
  useEffect(() => {
    if (selectedEmailId) {
      fetchEmailDetail(selectedEmailId);
      setIsReplying(false);
      setReplyBody("");
    } else {
      setSelectedEmail(null);
      setReplies([]);
    }
  }, [selectedEmailId, fetchEmailDetail]);

  // Toggle Starred
  const handleToggleStar = async (email: EmailRecord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStarred = !email.isStarred;

    // Optimistic update
    setEmails((prev) =>
      prev.map((item) => (item.id === email.id ? { ...item, isStarred: newStarred } : item))
    );
    if (selectedEmail?.id === email.id) {
      setSelectedEmail({ ...selectedEmail, isStarred: newStarred });
    }

    try {
      await fetch(`/api/emails/${email.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: newStarred }),
      });
      fetchStats();
    } catch {
      showToast("Failed to update starred status", "error");
    }
  };

  // Toggle Read / Unread
  const handleToggleRead = async (email: EmailRecord) => {
    const newRead = !email.isRead;
    setEmails((prev) =>
      prev.map((item) => (item.id === email.id ? { ...item, isRead: newRead } : item))
    );
    if (selectedEmail?.id === email.id) {
      setSelectedEmail({ ...selectedEmail, isRead: newRead });
    }

    try {
      await fetch(`/api/emails/${email.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: newRead }),
      });
      fetchStats();
      showToast(newRead ? "Marked as read" : "Marked as unread", "info");
    } catch {
      showToast("Failed to update read status", "error");
    }
  };

  // Archive / Unarchive
  const handleToggleArchive = async (email: EmailRecord) => {
    const newArchived = !email.isArchived;

    setEmails((prev) => prev.filter((item) => item.id !== email.id));
    if (selectedEmail?.id === email.id) {
      setSelectedEmailId(null);
      setSelectedEmail(null);
      setMobileView("list");
    }

    try {
      await fetch(`/api/emails/${email.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: newArchived }),
      });
      fetchStats();
      showToast(newArchived ? "Conversation archived" : "Conversation restored to inbox", "success");
    } catch {
      showToast("Failed to update archive status", "error");
      fetchEmails();
    }
  };

  // Delete Email
  const handleDeleteEmail = async (id: string) => {
    try {
      const isTrashFolder = currentFolder === "trash";
      const res = await fetch(`/api/emails/${id}?hard=${isTrashFolder}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEmails((prev) => prev.filter((item) => item.id !== id));
        if (selectedEmailId === id) {
          setSelectedEmailId(null);
          setSelectedEmail(null);
          setMobileView("list");
        }
        setDeleteConfirmId(null);
        fetchStats();
        showToast(isTrashFolder ? "Message permanently deleted" : "Message moved to trash", "success");
      } else {
        showToast("Failed to delete message", "error");
      }
    } catch {
      showToast("Error deleting message", "error");
    }
  };

  // Send Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail || !replyBody.trim()) return;

    setSendingReply(true);

    try {
      const res = await fetch(`/api/emails/${selectedEmail.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedEmail.senderEmail,
          subject: replySubject,
          bodyText: replyBody,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReplies((prev) => [...prev, data.reply]);
        setIsReplying(false);
        setReplyBody("");
        showToast(data.message || "Reply sent successfully!", "success");
        fetchStats();
      } else {
        showToast(data.error || "Failed to send reply", "error");
      }
    } catch (err) {
      console.error("Reply error:", err);
      showToast("Network failure while sending reply", "error");
    } finally {
      setSendingReply(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/emails/login");
      router.refresh();
    } catch {
      router.push("/admin/emails/login");
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }

      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: "short" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Filtered & sorted email list
  const displayEmails = useMemo(() => {
    const list = [...emails];
    list.sort((a, b) => {
      const tA = new Date(a.receivedAt).getTime();
      const tB = new Date(b.receivedAt).getTime();
      return sortOrder === "newest" ? tB - tA : tA - tB;
    });
    return list;
  }, [emails, sortOrder]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F7F9F6] text-[#11231A] overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium transition-all transform animate-in slide-in-from-top-4 ${
            toastMessage.type === "success"
              ? "bg-[#113B27] text-white border border-[#84C135]/40"
              : toastMessage.type === "error"
              ? "bg-red-700 text-white border border-red-500"
              : "bg-white text-[#113B27] border border-[#113B27]/20"
          }`}
        >
          {toastMessage.type === "success" ? (
            <FaCircleCheck className="w-4 h-4 text-[#84C135]" />
          ) : (
            <FaCircleExclamation className="w-4 h-4 text-red-300" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#113B27]/15 shadow-2xl">
            <h3 className="text-lg font-bold text-[#113B27]">Confirm Deletion</h3>
            <p className="text-xs sm:text-sm text-[#52665B] mt-2 leading-relaxed">
              {currentFolder === "trash"
                ? "Are you sure you want to permanently delete this email? This action cannot be undone."
                : "Move this email conversation to the trash folder?"}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#52665B] hover:text-[#113B27] rounded-xl hover:bg-[#F7F9F6] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEmail(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
              >
                {currentFolder === "trash" ? "Permanently Delete" : "Move to Trash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-14 border-b border-[#113B27]/10 bg-white px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#113B27] hover:bg-[#F7F9F6] rounded-xl transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <FaXmark className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#EBF7D9] flex items-center justify-center text-[#113B27] shadow-inner group-hover:scale-105 transition-transform">
              <FaLeaf className="w-4 h-4 text-[#84C135]" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base text-[#113B27] tracking-tight block leading-tight">
                Nettle Regenerative
              </span>
              <span className="text-[10px] text-[#708579] font-semibold tracking-wider uppercase block">
                Email Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#708579]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, subject, or message content..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F7F9F6] border border-[#113B27]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84C135] focus:bg-white transition-all text-[#11231A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#708579] hover:text-[#113B27]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchEmails}
            title="Refresh emails"
            className="p-2 text-[#52665B] hover:text-[#113B27] hover:bg-[#F7F9F6] rounded-xl transition-colors"
          >
            <FaRotateRight className={`w-3.5 h-3.5 ${loadingList ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/"
            target="_blank"
            title="View Live Website"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#52665B] hover:text-[#113B27] px-2.5 py-1.5 rounded-xl hover:bg-[#F7F9F6] font-medium transition-colors"
          >
            <span>Live Site</span>
            <FaArrowUpRightFromSquare className="w-3 h-3 text-[#708579]" />
          </Link>

          <div className="h-4 w-px bg-[#113B27]/10 mx-1" />

          <button
            type="button"
            onClick={handleLogout}
            title="Log out of session"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-xl transition-colors"
          >
            <FaRightFromBracket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ============================================================ */}
        {/* COLUMN 1: SIDEBAR NAVIGATION */}
        {/* ============================================================ */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-[#113B27]/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          {/* Folder Navigation */}
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-[#708579] uppercase">
              Folders
            </div>

            {[
              { id: "inbox", label: "Inbox", icon: FaInbox, count: stats.inbox },
              { id: "unread", label: "Unread", icon: FaEnvelope, count: stats.unread, highlight: true },
              { id: "starred", label: "Starred", icon: FaStar, count: stats.starred },
              { id: "contact_form", label: "Contact Form", icon: FaWpforms, count: stats.contactForm },
              { id: "sent", label: "Sent Replies", icon: FaPaperPlane, count: stats.sent },
              { id: "archived", label: "Archived", icon: FaBoxArchive, count: stats.archived },
              { id: "trash", label: "Trash", icon: FaTrashCan, count: stats.trash },
            ].map((folder) => {
              const Icon = folder.icon;
              const isActive = currentFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => {
                    setCurrentFolder(folder.id as FolderType);
                    setIsMobileMenuOpen(false);
                    setMobileView("list");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#113B27] text-white shadow-sm"
                      : "text-[#52665B] hover:text-[#113B27] hover:bg-[#F7F9F6]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#84C135]" : "text-[#708579]"}`} />
                    <span>{folder.label}</span>
                  </div>
                  {folder.count !== undefined && folder.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : folder.highlight
                          ? "bg-[#84C135] text-[#11231A]"
                          : "bg-[#F7F9F6] text-[#52665B]"
                      }`}
                    >
                      {folder.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 border-t border-[#113B27]/10 bg-[#FAFDF8]">
            <div className="p-2.5 rounded-xl bg-white border border-[#113B27]/10 text-[11px] text-[#52665B] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#113B27]">Resend Inbound</span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#84C135]" />
              </div>
              <p className="text-[10px] text-[#708579] leading-tight">
                Listening for incoming emails & contact inquiries
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile menu backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-20 lg:hidden"
          />
        )}

        {/* ============================================================ */}
        {/* COLUMN 2: INBOX LIST */}
        {/* ============================================================ */}
        <section
          className={`w-full lg:w-[380px] xl:w-[420px] bg-white border-r border-[#113B27]/10 flex flex-col shrink-0 overflow-hidden ${
            mobileView === "detail" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Header & Source Filter Bar */}
          <div className="p-3 border-b border-[#113B27]/10 space-y-2 bg-[#FAFDF8]">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#113B27]">
                {currentFolder.replace("_", " ")} ({displayEmails.length})
              </h2>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                className="text-[11px] bg-transparent font-medium text-[#52665B] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>

            {/* Mobile search bar if screen < md */}
            <div className="md:hidden relative">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#708579]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#113B27]/15 rounded-xl text-[#11231A]"
              />
            </div>

            {/* Inbound vs Contact Form Pill Filter */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {[
                { id: "all", label: "All Sources" },
                { id: "inbound", label: "Inbound Email" },
                { id: "contact_form", label: "Contact Form" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedSourceFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                    selectedSourceFilter === tab.id
                      ? "bg-[#113B27] text-white"
                      : "bg-[#F7F9F6] text-[#52665B] hover:text-[#113B27]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email Item List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#113B27]/5">
            {loadingList ? (
              <div className="flex flex-col items-center justify-center h-48 text-[#708579] space-y-2">
                <FaSpinner className="w-5 h-5 animate-spin text-[#84C135]" />
                <span className="text-xs">Loading conversations...</span>
              </div>
            ) : displayEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-[#EBF7D9] flex items-center justify-center text-[#113B27] mb-3">
                  <FaEnvelopeOpen className="w-5 h-5 text-[#84C135]" />
                </div>
                <h4 className="text-sm font-bold text-[#113B27]">No messages found</h4>
                <p className="text-xs text-[#708579] mt-1 max-w-[200px]">
                  {searchQuery
                    ? `No matches for "${searchQuery}"`
                    : `No emails in ${currentFolder.replace("_", " ")}`}
                </p>
              </div>
            ) : (
              displayEmails.map((email) => {
                const isSelected = selectedEmailId === email.id;
                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      setSelectedEmailId(email.id);
                      setMobileView("detail");
                    }}
                    className={`p-3.5 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? "bg-[#F4F9F1] border-l-[#113B27]"
                        : !email.isRead
                        ? "bg-white border-l-[#84C135] font-semibold hover:bg-[#FAFDF8]"
                        : "bg-white border-l-transparent hover:bg-[#FAFDF8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        {/* Unread Indicator */}
                        {!email.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#84C135] shrink-0" />
                        )}
                        <span className={`text-xs truncate ${!email.isRead ? "font-bold text-[#113B27]" : "text-[#11231A]"}`}>
                          {email.senderName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-[#708579]">
                          {formatDate(email.receivedAt)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleToggleStar(email, e)}
                          className="p-1 text-[#708579] hover:text-[#84C135] transition-colors"
                        >
                          {email.isStarred ? (
                            <FaStar className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <FaRegStar className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="text-xs font-medium text-[#11231A] truncate mt-1">
                      {email.subject}
                    </div>

                    {/* Snippet */}
                    <p className="text-[11px] text-[#52665B] line-clamp-2 mt-1 leading-relaxed">
                      {email.bodyText}
                    </p>

                    {/* Footer Tags */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {email.source === "contact_form" ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FAF7F3] text-[#654320] border border-[#654320]/20">
                          <FaWpforms className="w-2.5 h-2.5" />
                          Contact Form
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#EBF7D9] text-[#113B27] border border-[#84C135]/30">
                          <FaEnvelope className="w-2.5 h-2.5 text-[#84C135]" />
                          Inbound
                        </span>
                      )}

                      {email.replyCount && email.replyCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#EBF7D9] text-[#113B27]">
                          {email.replyCount} {email.replyCount === 1 ? "reply" : "replies"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* COLUMN 3: EMAIL READING PANEL */}
        {/* ============================================================ */}
        <main
          className={`flex-1 bg-[#F7F9F6] flex flex-col overflow-hidden ${
            mobileView === "list" ? "hidden lg:flex" : "flex"
          }`}
        >
          {loadingDetail ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#708579] space-y-3">
              <FaSpinner className="w-6 h-6 animate-spin text-[#84C135]" />
              <span className="text-xs font-medium">Opening conversation...</span>
            </div>
          ) : !selectedEmail ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-3xl bg-white border border-[#113B27]/10 flex items-center justify-center text-[#84C135] shadow-xs mb-4">
                <FaLeaf className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#113B27]">No Conversation Selected</h3>
              <p className="text-xs text-[#708579] mt-1 max-w-sm leading-relaxed">
                Choose an inquiry from the inbox on the left to read full details and send direct replies.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Action Toolbar */}
              <div className="h-12 border-b border-[#113B27]/10 bg-white px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileView("list")}
                    className="lg:hidden p-1.5 text-[#52665B] hover:text-[#113B27] rounded-lg hover:bg-[#F7F9F6]"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReplying(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#113B27] hover:bg-[#174A32] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <FaReply className="w-3 h-3" />
                    <span>Reply</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStar(selectedEmail)}
                    className="p-2 text-[#52665B] hover:text-amber-500 rounded-xl hover:bg-[#F7F9F6] transition-colors"
                    title={selectedEmail.isStarred ? "Unstar" : "Star"}
                  >
                    {selectedEmail.isStarred ? (
                      <FaStar className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <FaRegStar className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleRead(selectedEmail)}
                    className="p-2 text-[#52665B] hover:text-[#113B27] rounded-xl hover:bg-[#F7F9F6] transition-colors"
                    title={selectedEmail.isRead ? "Mark as unread" : "Mark as read"}
                  >
                    {selectedEmail.isRead ? (
                      <FaEnvelope className="w-3.5 h-3.5" />
                    ) : (
                      <FaEnvelopeOpen className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleArchive(selectedEmail)}
                    className="p-2 text-[#52665B] hover:text-[#113B27] rounded-xl hover:bg-[#F7F9F6] transition-colors"
                    title={selectedEmail.isArchived ? "Unarchive" : "Archive"}
                  >
                    <FaBoxArchive className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(selectedEmail.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete conversation"
                >
                  <FaTrashCan className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Message Details & Thread Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Email Header Card */}
                <div className="bg-white rounded-3xl p-6 border border-[#113B27]/10 shadow-[0_4px_20px_rgba(17,59,39,0.03)] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#113B27]/10 pb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-[#113B27] tracking-tight">
                      {selectedEmail.subject}
                    </h2>
                    <span className="text-xs text-[#708579] font-medium shrink-0">
                      {new Date(selectedEmail.receivedAt).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  {/* Sender Info Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#EBF7D9] text-[#113B27] font-bold text-sm flex items-center justify-center shrink-0 shadow-inner">
                        {selectedEmail.senderName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#11231A] flex items-center gap-2">
                          <span>{selectedEmail.senderName}</span>
                          {selectedEmail.source === "contact_form" ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F3] text-[#654320] border border-[#654320]/20">
                              Contact Form Submission
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF7D9] text-[#113B27] border border-[#84C135]/30">
                              Inbound Email
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#52665B] mt-0.5">
                          From:{" "}
                          <a
                            href={`mailto:${selectedEmail.senderEmail}`}
                            className="text-[#113B27] font-medium hover:underline"
                          >
                            {selectedEmail.senderEmail}
                          </a>
                        </div>
                        <div className="text-[11px] text-[#708579]">
                          To: {selectedEmail.recipientEmail}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form Submission Metadata Callout */}
                  {selectedEmail.contactMetadata && (
                    <div className="p-3.5 rounded-2xl bg-[#FAFDF8] border border-[#84C135]/30 text-xs text-[#113B27] space-y-1">
                      <div className="font-semibold text-xs flex items-center gap-1.5 text-[#113B27]">
                        <FaPhone className="w-3 h-3 text-[#84C135]" />
                        <span>Contact Preferences Provided:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-[#52665B]">
                        {selectedEmail.contactMetadata.phone && (
                          <div>
                            <strong>Phone:</strong> {selectedEmail.contactMetadata.phone}
                          </div>
                        )}
                        {selectedEmail.contactMetadata.preferredMethod && (
                          <div>
                            <strong>Preferred Method:</strong>{" "}
                            {selectedEmail.contactMetadata.preferredMethod}
                          </div>
                        )}
                        {selectedEmail.contactMetadata.inquiryType && (
                          <div>
                            <strong>Topic:</strong> {selectedEmail.contactMetadata.inquiryType}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Main Message Body */}
                  <div className="pt-2 text-sm text-[#11231A] leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedEmail.bodyHtml ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                        className="prose prose-sm max-w-none text-[#11231A]"
                      />
                    ) : (
                      selectedEmail.bodyText
                    )}
                  </div>
                </div>

                {/* Sent Conversation Replies Thread */}
                {replies.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#708579]">
                      <FaReply className="w-3 h-3" />
                      <span>Sent Replies ({replies.length})</span>
                    </div>

                    {replies.map((reply, idx) => (
                      <div
                        key={reply.id || idx}
                        className="bg-white rounded-3xl p-5 border border-[#113B27]/10 shadow-xs space-y-3 pl-6 border-l-4 border-l-[#113B27]"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-bold text-[#113B27]">
                            <span>You replied</span>
                            <span className="text-[10px] text-[#708579] font-normal">
                              via {reply.from}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#708579]">
                            {new Date(reply.sentAt).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>

                        <div className="text-xs text-[#708579]">
                          To: <span className="text-[#11231A] font-medium">{reply.to}</span>
                        </div>

                        <div className="text-sm text-[#11231A] leading-relaxed whitespace-pre-wrap pt-1">
                          {reply.bodyText}
                        </div>

                        <div className="pt-2 flex items-center justify-between text-[10px] text-[#708579] border-t border-[#113B27]/5">
                          <span>Status: {reply.status}</span>
                          {reply.resendId && <span>Resend ID: {reply.resendId}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Composer Card */}
                {isReplying && (
                  <div className="bg-white rounded-3xl p-6 border border-[#84C135]/40 shadow-lg space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-[#113B27]/10 pb-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#113B27]">
                        <FaReply className="w-4 h-4 text-[#84C135]" />
                        <span>Reply to {selectedEmail.senderName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsReplying(false)}
                        className="text-xs text-[#708579] hover:text-[#113B27]"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <form onSubmit={handleSendReply} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#113B27] mb-1">
                            Recipient
                          </label>
                          <input
                            type="text"
                            value={selectedEmail.senderEmail}
                            readOnly
                            className="w-full px-3 py-2 bg-[#F7F9F6] border border-[#113B27]/10 rounded-xl text-[#52665B] cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#113B27] mb-1">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={replySubject}
                            onChange={(e) => setReplySubject(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white border border-[#113B27]/15 rounded-xl text-[#11231A] focus:outline-none focus:ring-2 focus:ring-[#84C135]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#113B27] mb-1">
                          Reply Message
                        </label>
                        <textarea
                          rows={6}
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="Type your reply to this inquiry..."
                          required
                          className="w-full p-3.5 bg-white border border-[#113B27]/15 rounded-2xl text-sm text-[#11231A] focus:outline-none focus:ring-2 focus:ring-[#84C135] leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-[#708579]">
                          Will be sent via Resend from your verified sender address.
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsReplying(false)}
                            className="px-4 py-2 text-xs font-semibold text-[#52665B] hover:text-[#113B27] rounded-xl hover:bg-[#F7F9F6]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={sendingReply || !replyBody.trim()}
                            className="px-5 py-2.5 bg-[#113B27] hover:bg-[#174A32] text-white text-xs font-semibold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                          >
                            {sendingReply ? (
                              <>
                                <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <FaPaperPlane className="w-3 h-3 text-[#84C135]" />
                                <span>Send Reply</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
