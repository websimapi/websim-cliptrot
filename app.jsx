import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
const room = new WebsimSocket();
const pfpsCollection = room.collection("cliptrot_pfps");
const postsCollection = room.collection("cliptrot_posts");
const hoovesCollection = room.collection("cliptrot_hooves");
const followsCollection = room.collection("cliptrot_follows");
function useCurrentUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    window.websim.getCurrentUser().then(setUser);
  }, []);
  return user;
}
function useUserProfile(username) {
  const userQuery = useMemo(() => room.query(
    "SELECT u.id, u.username, p.pfp_url FROM public.user u LEFT JOIN public.cliptrot_pfps p ON u.id = p.id WHERE u.username = $1",
    [username]
  ), [username]);
  const { data: userData } = useQuery(userQuery);
  return useMemo(() => {
    if (!userData || userData.length === 0) {
      return { id: null, username, pfp_url: `https://images.websim.com/avatar/${username}` };
    }
    const user = userData[0];
    return {
      ...user,
      pfp_url: user.pfp_url || `https://images.websim.com/avatar/${user.username}`
    };
  }, [userData, username]);
}
function App() {
  const [route, setRoute] = useState(window.location.hash || "#/");
  const [isPfpModalOpen, setIsPfpModalOpen] = useState(false);
  const currentUser = useCurrentUser();
  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  const openPfpModal = useCallback(() => setIsPfpModalOpen(true), []);
  const closePfpModal = useCallback(() => setIsPfpModalOpen(false), []);
  let pageContent;
  if (route.startsWith("#/profile/")) {
    const username = route.split("/")[2];
    pageContent = /* @__PURE__ */ jsxDEV(ProfilePage, { username, currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 62,
      columnNumber: 23
    }, this);
  } else if (route === "#/following") {
    pageContent = /* @__PURE__ */ jsxDEV(FollowingFeed, { currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 64,
      columnNumber: 23
    }, this);
  } else {
    pageContent = /* @__PURE__ */ jsxDEV(MainFeed, { currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 66,
      columnNumber: 23
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV(Header, { currentUser, activeRoute: route, onPfpClick: openPfpModal }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 71,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("main", { children: pageContent }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 72,
      columnNumber: 13
    }, this),
    isPfpModalOpen && /* @__PURE__ */ jsxDEV(PfpGenerator, { currentUser, onClose: closePfpModal }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 75,
      columnNumber: 32
    }, this),
    currentUser && /* @__PURE__ */ jsxDEV(BottomNav, { activeRoute: route, currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 76,
      columnNumber: 29
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 70,
    columnNumber: 9
  }, this);
}
function Header({ currentUser, activeRoute, onPfpClick }) {
  const { pfp_url } = useUserProfile(currentUser?.username);
  return /* @__PURE__ */ jsxDEV("header", { className: "header", children: [
    /* @__PURE__ */ jsxDEV("a", { href: "#/", className: "logo", children: [
      /* @__PURE__ */ jsxDEV("img", { src: "/pony-logo.png", alt: "ClipTrot Logo" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 87,
        columnNumber: 17
      }, this),
      "ClipTrot"
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 86,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("nav", { className: "nav", children: [
      /* @__PURE__ */ jsxDEV("a", { href: "#/", className: activeRoute === "#/" ? "active" : "", children: "Main Feed" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 91,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: "#/following", className: activeRoute === "#/following" ? "active" : "", children: "Following" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 92,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 90,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "profile-nav", children: currentUser ? /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: pfp_url,
        alt: currentUser.username,
        onClick: onPfpClick,
        title: "Generate Pony PFP"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 96,
        columnNumber: 21
      },
      this
    ) : /* @__PURE__ */ jsxDEV("div", { style: { width: "45px", height: "45px" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 102,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 85,
    columnNumber: 9
  }, this);
}
function BottomNav({ activeRoute, currentUser }) {
  if (!currentUser) return null;
  const isProfileActive = activeRoute === `#/profile/${currentUser.username}`;
  return /* @__PURE__ */ jsxDEV("nav", { className: "bottom-nav", children: [
    /* @__PURE__ */ jsxDEV("a", { href: "#/", className: `bottom-nav-link ${activeRoute === "#/" ? "active" : ""}`, children: [
      /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-house" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 116,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Home" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 117,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 115,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("a", { href: "#/following", className: `bottom-nav-link ${activeRoute === "#/following" ? "active" : ""}`, children: [
      /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-users" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 120,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Following" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 121,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 119,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("a", { href: `#/profile/${currentUser.username}`, className: `bottom-nav-link ${isProfileActive ? "active" : ""}`, children: [
      /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 124,
        columnNumber: 18
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Profile" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 125,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 123,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 114,
    columnNumber: 9
  }, this);
}
function MainFeed({ currentUser }) {
  return /* @__PURE__ */ jsxDEV("div", { children: [
    currentUser && /* @__PURE__ */ jsxDEV(PostForm, { currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 134,
      columnNumber: 29
    }, this),
    /* @__PURE__ */ jsxDEV(Feed, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 135,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 133,
    columnNumber: 9
  }, this);
}
function FollowingFeed({ currentUser }) {
  if (!currentUser) return /* @__PURE__ */ jsxDEV("div", { className: "loading", children: /* @__PURE__ */ jsxDEV("div", { className: "spinner" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 141,
    columnNumber: 55
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 141,
    columnNumber: 30
  }, this);
  const followsQuery = useMemo(() => room.query(
    "SELECT following_id FROM public.cliptrot_follows WHERE follower_id = $1",
    [currentUser.id]
  ), [currentUser.id]);
  const { data: follows, loading } = useQuery(followsQuery);
  const followingUserIds = useMemo(() => {
    if (!follows) return [];
    return follows.map((f) => f.following_id);
  }, [follows]);
  if (loading) return /* @__PURE__ */ jsxDEV("div", { className: "loading", children: /* @__PURE__ */ jsxDEV("div", { className: "spinner" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 155,
    columnNumber: 50
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 155,
    columnNumber: 25
  }, this);
  return /* @__PURE__ */ jsxDEV("div", { children: followingUserIds.length > 0 ? /* @__PURE__ */ jsxDEV(Feed, { userIds: followingUserIds }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 160,
    columnNumber: 18
  }, this) : /* @__PURE__ */ jsxDEV("div", { className: "empty-feed", children: "Not following anyone yet. Find some ponies!" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 162,
    columnNumber: 17
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 158,
    columnNumber: 9
  }, this);
}
function ProfilePage({ username, currentUser }) {
  const profileUser = useUserProfile(username);
  const isOwnProfile = currentUser?.username === username;
  const statsQuery = useMemo(() => {
    if (!profileUser.id) return null;
    return room.query(
      `SELECT
                (SELECT COUNT(*) FROM public.cliptrot_follows WHERE following_id = $1) as followers_count,
                (SELECT COUNT(*) FROM public.cliptrot_follows WHERE follower_id = $1) as following_count`,
      [profileUser.id]
    );
  }, [profileUser.id]);
  const { data: statsData } = useQuery(statsQuery);
  const stats = statsData?.[0] || { followers_count: 0, following_count: 0 };
  return /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV(
      ProfileHeader,
      {
        profileUser,
        stats,
        currentUser,
        isOwnProfile
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 188,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("h2", { style: { color: "var(--primary-color)", paddingLeft: "1rem" }, children: [
      isOwnProfile ? "My" : username + "'s",
      " Posts"
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 194,
      columnNumber: 13
    }, this),
    profileUser.id && /* @__PURE__ */ jsxDEV(Feed, { userIds: [profileUser.id] }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 195,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 187,
    columnNumber: 9
  }, this);
}
function ProfileHeader({ profileUser, stats, currentUser, isOwnProfile }) {
  const isFollowingQuery = useMemo(() => {
    if (!currentUser || !profileUser.id || isOwnProfile) return null;
    return room.query(
      "SELECT id FROM public.cliptrot_follows WHERE follower_id = $1 AND following_id = $2",
      [currentUser.id, profileUser.id]
    );
  }, [currentUser, profileUser.id, isOwnProfile]);
  const { data: followingData } = useQuery(isFollowingQuery);
  const isFollowing = followingData && followingData.length > 0;
  const handleFollow = async () => {
    if (!currentUser || isOwnProfile || !profileUser.id) return;
    await followsCollection.upsert({
      id: `${currentUser.id}-${profileUser.id}`,
      follower_id: currentUser.id,
      following_id: profileUser.id
    });
  };
  const handleUnfollow = async () => {
    if (!currentUser || isOwnProfile || !profileUser.id) return;
    await followsCollection.delete(`${currentUser.id}-${profileUser.id}`);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "profile-header", children: [
    /* @__PURE__ */ jsxDEV("img", { src: profileUser.pfp_url, alt: profileUser.username }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 228,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "profile-info", children: [
      /* @__PURE__ */ jsxDEV("h1", { children: profileUser.username }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 230,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "profile-stats", children: [
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: stats.followers_count }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 232,
            columnNumber: 27
          }, this),
          " Followers"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 232,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: stats.following_count }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 233,
            columnNumber: 27
          }, this),
          " Following"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 233,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 231,
        columnNumber: 17
      }, this),
      !isOwnProfile && currentUser && (isFollowing ? /* @__PURE__ */ jsxDEV("button", { className: "follow-button unfollow-button", onClick: handleUnfollow, children: "Unfollow" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 237,
        columnNumber: 26
      }, this) : /* @__PURE__ */ jsxDEV("button", { className: "follow-button", onClick: handleFollow, children: "Follow" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 239,
        columnNumber: 26
      }, this))
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 229,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 227,
    columnNumber: 9
  }, this);
}
function PostForm({ currentUser }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !caption || isUploading) return;
    setIsUploading(true);
    try {
      const mediaUrl = await window.websim.upload(file);
      const mediaType = file.type.startsWith("video") ? "video" : "image";
      await postsCollection.create({
        caption,
        media_url: mediaUrl,
        media_type: mediaType,
        user_id: currentUser.id
      });
      setCaption("");
      setFile(null);
      document.getElementById("post-file-input").value = "";
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    } finally {
      setIsUploading(false);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  return /* @__PURE__ */ jsxDEV("form", { className: "post-form", onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Create a new post" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 286,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      "textarea",
      {
        placeholder: "What's on your mind, pony?",
        value: caption,
        onChange: (e) => setCaption(e.target.value),
        required: true
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 287,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxDEV("label", { className: "file-input-wrapper", children: [
        /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-cloud-arrow-up" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 295,
          columnNumber: 21
        }, this),
        " Choose Media",
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "post-file-input",
            type: "file",
            accept: "image/*,video/*",
            onChange: handleFileChange,
            required: true
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 296,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 294,
        columnNumber: 17
      }, this),
      file && /* @__PURE__ */ jsxDEV("span", { className: "file-name", children: file.name }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 304,
        columnNumber: 27
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 293,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("button", { type: "submit", disabled: isUploading || !file || !caption, style: { marginTop: "1rem" }, children: isUploading ? "Posting..." : "Post to ClipTrot" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 307,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 285,
    columnNumber: 9
  }, this);
}
function Feed({ userIds }) {
  const feedQuery = useMemo(() => {
    let sql = `
            SELECT
                p.id, p.caption, p.media_url, p.media_type, p.user_id, p.created_at,
                u.username,
                pf.pfp_url
            FROM public.cliptrot_posts p
            JOIN public.user u ON p.user_id = u.id
            LEFT JOIN public.cliptrot_pfps pf ON p.user_id = pf.id
        `;
    const params = [];
    if (userIds && userIds.length > 0) {
      sql += ` WHERE p.user_id = ANY($1)`;
      params.push(userIds);
    }
    sql += ` ORDER BY p.created_at DESC`;
    return room.query(sql, params);
  }, [userIds]);
  const { data: posts, loading } = useQuery(feedQuery);
  const currentUser = useCurrentUser();
  if (loading) return /* @__PURE__ */ jsxDEV("div", { className: "loading", children: /* @__PURE__ */ jsxDEV("div", { className: "spinner" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 337,
    columnNumber: 50
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 337,
    columnNumber: 25
  }, this);
  if (!posts || posts.length === 0) return /* @__PURE__ */ jsxDEV("div", { className: "empty-feed", children: "It's a bit quiet here... No posts yet!" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 338,
    columnNumber: 46
  }, this);
  return /* @__PURE__ */ jsxDEV("div", { className: "feed", children: posts.map((post) => /* @__PURE__ */ jsxDEV(Post, { post, currentUser }, post.id, false, {
    fileName: "<stdin>",
    lineNumber: 343,
    columnNumber: 17
  }, this)) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 341,
    columnNumber: 9
  }, this);
}
function Post({ post, currentUser }) {
  const pfp = post.pfp_url || `https://images.websim.com/avatar/${post.username}`;
  const hoovesQuery = useMemo(() => room.query(
    "SELECT user_id FROM public.cliptrot_hooves WHERE post_id = $1",
    [post.id]
  ), [post.id]);
  const { data: hooves } = useQuery(hoovesQuery);
  const hasHoofed = useMemo(() => {
    if (!currentUser || !hooves) return false;
    return hooves.some((h) => h.user_id === currentUser.id);
  }, [hooves, currentUser]);
  const handleHoofClick = async () => {
    if (!currentUser) return;
    const hoofId = `${currentUser.id}-${post.id}`;
    if (hasHoofed) {
      await hoovesCollection.delete(hoofId);
    } else {
      await hoovesCollection.upsert({ id: hoofId, user_id: currentUser.id, post_id: post.id });
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "post", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "post-header", children: [
      /* @__PURE__ */ jsxDEV("img", { src: pfp, alt: post.username }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 377,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: `#/profile/${post.username}`, children: post.username }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 378,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 376,
      columnNumber: 13
    }, this),
    post.media_type === "video" ? /* @__PURE__ */ jsxDEV("video", { src: post.media_url, controls: true, className: "post-media", playsInline: true, loop: true, muted: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 381,
      columnNumber: 17
    }, this) : /* @__PURE__ */ jsxDEV("img", { src: post.media_url, alt: `Post by ${post.username}`, className: "post-media" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 383,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "post-content", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "post-actions", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: `hoof-button ${hasHoofed ? "hoofed" : ""}`,
            onClick: handleHoofClick,
            title: "Give a Hoof",
            disabled: !currentUser,
            children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-paw" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 393,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 387,
            columnNumber: 21
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("span", { children: [
          hooves?.length || 0,
          " Hooves"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 395,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 386,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "post-caption", children: [
        /* @__PURE__ */ jsxDEV("strong", { children: /* @__PURE__ */ jsxDEV("a", { href: `#/profile/${post.username}`, children: post.username }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 398,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 398,
          columnNumber: 21
        }, this),
        " ",
        post.caption
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 397,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 385,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 375,
    columnNumber: 9
  }, this);
}
function PfpGenerator({ currentUser, onClose }) {
  const [prompt, setPrompt] = useState("a magical pony with a rainbow mane");
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const generateImage = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setImageUrl(null);
    setError(null);
    try {
      const result = await window.websim.ai.generateImage({
        prompt: `${prompt}, cute pony, digital art, profile picture`,
        aspectRatio: "1:1"
      });
      setImageUrl(result.url);
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Sorry, could not generate a pony right now.");
    } finally {
      setIsLoading(false);
    }
  };
  const setAsPfp = async () => {
    if (!imageUrl || !currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      await pfpsCollection.upsert({
        id: currentUser.id,
        pfp_url: imageUrl
      });
      onClose();
    } catch (err) {
      console.error("Error setting PFP:", err);
      setError("Could not set your new profile picture.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "pfp-generator", children: /* @__PURE__ */ jsxDEV("div", { className: "pfp-modal", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Create Your Pony PFP" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 453,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("p", { children: "Describe your perfect pony and let AI bring it to life!" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 454,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("textarea", { value: prompt, onChange: (e) => setPrompt(e.target.value) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 455,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("button", { onClick: generateImage, disabled: isLoading, children: isLoading && !imageUrl ? "Generating..." : "Generate Pony" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 456,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("button", { className: "secondary", onClick: onClose, children: "Cancel" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 459,
      columnNumber: 17
    }, this),
    isLoading && !imageUrl && /* @__PURE__ */ jsxDEV("div", { className: "loading", style: { padding: "2rem 0" }, children: /* @__PURE__ */ jsxDEV("div", { className: "spinner" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 461,
      columnNumber: 97
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 461,
      columnNumber: 44
    }, this),
    error && /* @__PURE__ */ jsxDEV("p", { style: { color: "red" }, children: error }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 462,
      columnNumber: 27
    }, this),
    imageUrl && /* @__PURE__ */ jsxDEV("div", { className: "pfp-result", children: [
      /* @__PURE__ */ jsxDEV("img", { src: imageUrl, alt: "AI generated pony" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 466,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV("button", { onClick: setAsPfp, disabled: isLoading, children: isLoading ? "Saving..." : "Set as Profile Picture" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 468,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 467,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 465,
      columnNumber: 21
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 452,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 451,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 480,
  columnNumber: 13
}));
