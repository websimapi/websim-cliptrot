import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
const room = new WebsimSocket();
const profilesCollection = room.collection("cliptrot_profiles_v1");
const postsCollection = room.collection("cliptrot_posts_v2");
const hoovesCollection = room.collection("cliptrot_hooves_v2");
const followsCollection = room.collection("cliptrot_follows_v2");
function useCurrentUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    window.websim.getCurrentUser().then(setUser);
  }, []);
  return user;
}
function useUser(username) {
  const { data: users } = useQuery(room.query(
    `SELECT u.id, u.username FROM public.user u WHERE u.username = $1`,
    [username]
  ));
  return users?.[0] || null;
}
function useUserPfp(user) {
  const { data: profile } = useQuery(
    user ? profilesCollection.filter({ id: user.id }) : null
  );
  const customPfp = profile?.[0]?.pfp_url;
  const defaultPfp = user ? `https://images.websim.com/avatar/${user.username}` : "pony-logo.png";
  return customPfp || defaultPfp;
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
  let pageContent;
  if (route.startsWith("#/profile/")) {
    const username = route.split("/")[2];
    pageContent = /* @__PURE__ */ jsxDEV(ProfilePage, { username, currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 56,
      columnNumber: 23
    }, this);
  } else if (route === "#/following") {
    pageContent = /* @__PURE__ */ jsxDEV(FollowingFeed, { currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 58,
      columnNumber: 23
    }, this);
  } else {
    pageContent = /* @__PURE__ */ jsxDEV(MainFeed, { currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 60,
      columnNumber: 23
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV(Header, { currentUser, activeRoute: route, onPfpClick: () => setIsPfpModalOpen(true) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 65,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("main", { children: pageContent }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 66,
      columnNumber: 13
    }, this),
    isPfpModalOpen && /* @__PURE__ */ jsxDEV(PfpGenerator, { currentUser, onClose: () => setIsPfpModalOpen(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 69,
      columnNumber: 32
    }, this),
    currentUser && /* @__PURE__ */ jsxDEV(BottomNav, { activeRoute: route, currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 70,
      columnNumber: 29
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 64,
    columnNumber: 9
  }, this);
}
function Header({ currentUser, activeRoute, onPfpClick }) {
  const pfp = useUserPfp(currentUser);
  return /* @__PURE__ */ jsxDEV("header", { className: "header", children: [
    /* @__PURE__ */ jsxDEV("a", { href: "#/", className: "logo", children: [
      /* @__PURE__ */ jsxDEV("img", { src: "pony-logo.png", alt: "ClipTrot Logo" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 81,
        columnNumber: 17
      }, this),
      "ClipTrot"
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 80,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("nav", { className: "nav", children: [
      /* @__PURE__ */ jsxDEV("a", { href: "#/", className: activeRoute === "#/" ? "active" : "", children: "Main Feed" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 85,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: "#/following", className: activeRoute === "#/following" ? "active" : "", children: "Following" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 86,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 84,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "profile-nav", children: currentUser ? /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: pfp,
        alt: currentUser.username,
        onClick: onPfpClick,
        title: "Generate Pony PFP"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 90,
        columnNumber: 21
      },
      this
    ) : /* @__PURE__ */ jsxDEV("div", { style: { width: "45px", height: "45px" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 96,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 88,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 79,
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
        lineNumber: 110,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Home" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 111,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 109,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("a", { href: "#/following", className: `bottom-nav-link ${activeRoute === "#/following" ? "active" : ""}`, children: [
      /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-users" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 114,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Following" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 115,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 113,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("a", { href: `#/profile/${currentUser.username}`, className: `bottom-nav-link ${isProfileActive ? "active" : ""}`, children: [
      /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-user" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 118,
        columnNumber: 18
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: "Profile" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 119,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 117,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 108,
    columnNumber: 9
  }, this);
}
function MainFeed({ currentUser }) {
  const { data: posts, loading } = useQuery(room.query(`
        SELECT p.*, u.username
        FROM public.cliptrot_posts_v2 p
        JOIN public.user u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT 50
    `));
  return /* @__PURE__ */ jsxDEV("div", { children: [
    currentUser && /* @__PURE__ */ jsxDEV(PostForm, { currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 136,
      columnNumber: 29
    }, this),
    /* @__PURE__ */ jsxDEV(Feed, { posts, loading, currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 137,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 135,
    columnNumber: 9
  }, this);
}
function FollowingFeed({ currentUser }) {
  const query = useMemo(() => {
    if (!currentUser) return null;
    return room.query(`
            SELECT p.*, u.username
            FROM public.cliptrot_posts_v2 p
            JOIN public.user u ON p.user_id = u.id
            JOIN public.cliptrot_follows_v2 f ON f.following_id = p.user_id
            WHERE f.user_id = $1
            ORDER BY p.created_at DESC
            LIMIT 50
        `, [currentUser.id]);
  }, [currentUser]);
  const { data: posts, loading } = useQuery(query);
  if (!currentUser) return /* @__PURE__ */ jsxDEV("div", { className: "loading", children: "Loading..." }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 158,
    columnNumber: 30
  }, this);
  return /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(Feed, { posts, loading, currentUser, emptyMessage: "Follow users to see their posts here!" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 162,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 161,
    columnNumber: 9
  }, this);
}
function ProfilePage({ username, currentUser }) {
  const profileUser = useUser(username);
  const isOwnProfile = currentUser?.username === username;
  const { data: posts, loading } = useQuery(profileUser ? room.query(`
        SELECT p.*, u.username FROM public.cliptrot_posts_v2 p
        JOIN public.user u ON p.user_id = u.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
    `, [profileUser.id]) : null);
  if (!profileUser) return /* @__PURE__ */ jsxDEV("div", { className: "loading", children: /* @__PURE__ */ jsxDEV("div", { className: "spinner" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 178,
    columnNumber: 55
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 178,
    columnNumber: 30
  }, this);
  return /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV(
      ProfileHeader,
      {
        profileUser,
        currentUser,
        isOwnProfile
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 182,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("h2", { style: { color: "var(--primary-color)" }, children: [
      isOwnProfile ? "My" : `${username}'s`,
      " Posts"
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 187,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Feed, { posts, loading, currentUser }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 188,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 181,
    columnNumber: 9
  }, this);
}
function ProfileHeader({ profileUser, currentUser, isOwnProfile }) {
  const pfp = useUserPfp(profileUser);
  const { data: followers } = useQuery(room.query("SELECT count(*)::int FROM public.cliptrot_follows_v2 WHERE following_id = $1", [profileUser.id]));
  const { data: following } = useQuery(room.query("SELECT count(*)::int FROM public.cliptrot_follows_v2 WHERE user_id = $1", [profileUser.id]));
  const followersCount = followers?.[0]?.count ?? 0;
  const followingCount = following?.[0]?.count ?? 0;
  const followId = currentUser ? `${currentUser.id}-${profileUser.id}` : null;
  const { data: followRecord } = useQuery(followId ? room.collection("cliptrot_follows_v2").filter({ id: followId }) : null);
  const isFollowing = !!followRecord?.[0];
  const handleFollow = async () => {
    if (!currentUser || !followId) return;
    await followsCollection.upsert({ id: followId, following_id: profileUser.id });
  };
  const handleUnfollow = async () => {
    if (!followId) return;
    await followsCollection.delete(followId);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "profile-header", children: [
    /* @__PURE__ */ jsxDEV("img", { src: pfp, alt: profileUser.username }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 219,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "profile-info", children: [
      /* @__PURE__ */ jsxDEV("h1", { children: profileUser.username }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 221,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "profile-stats", children: [
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: followersCount }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 223,
            columnNumber: 27
          }, this),
          " Followers"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 223,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: followingCount }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 224,
            columnNumber: 27
          }, this),
          " Following"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 224,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 222,
        columnNumber: 17
      }, this),
      !isOwnProfile && currentUser && (isFollowing ? /* @__PURE__ */ jsxDEV("button", { className: "follow-button unfollow-button", onClick: handleUnfollow, children: "Unfollow" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 228,
        columnNumber: 26
      }, this) : /* @__PURE__ */ jsxDEV("button", { className: "follow-button", onClick: handleFollow, children: "Follow" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 230,
        columnNumber: 26
      }, this))
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 220,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 218,
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
        media_type: mediaType
      });
      setCaption("");
      setFile(null);
      e.target.reset();
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
      lineNumber: 276,
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
        lineNumber: 277,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxDEV("label", { className: "file-input-wrapper", children: [
        /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-cloud-arrow-up" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 285,
          columnNumber: 21
        }, this),
        " Choose Media",
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "file",
            accept: "image/*,video/*",
            onChange: handleFileChange,
            required: true
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 286,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 284,
        columnNumber: 17
      }, this),
      file && /* @__PURE__ */ jsxDEV("span", { className: "file-name", children: file.name }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 293,
        columnNumber: 27
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 283,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("button", { type: "submit", disabled: isUploading || !file || !caption, style: { marginTop: "1rem" }, children: isUploading ? "Posting..." : "Post to ClipTrot" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 296,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 275,
    columnNumber: 9
  }, this);
}
function Feed({ posts, loading, currentUser, emptyMessage }) {
  if (loading) return /* @__PURE__ */ jsxDEV("div", { className: "loading", children: /* @__PURE__ */ jsxDEV("div", { className: "spinner" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 304,
    columnNumber: 50
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 304,
    columnNumber: 25
  }, this);
  if (!posts || posts.length === 0) return /* @__PURE__ */ jsxDEV("div", { className: "empty-feed", children: emptyMessage || "It's a bit quiet here... No posts yet!" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 305,
    columnNumber: 46
  }, this);
  return /* @__PURE__ */ jsxDEV("div", { className: "feed", children: posts.map((post) => /* @__PURE__ */ jsxDEV(Post, { post, currentUser }, post.id, false, {
    fileName: "<stdin>",
    lineNumber: 310,
    columnNumber: 17
  }, this)) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 308,
    columnNumber: 9
  }, this);
}
function Post({ post, currentUser }) {
  const postUser = useMemo(() => ({ id: post.user_id, username: post.username }), [post.user_id, post.username]);
  const pfp = useUserPfp(postUser);
  const { data: hoovesData } = useQuery(room.query(
    "SELECT user_id, count(*)::int FROM public.cliptrot_hooves_v2 WHERE post_id = $1 GROUP BY user_id",
    [post.id]
  ));
  const hoofCount = hoovesData?.length ?? 0;
  const hasHoofed = useMemo(() => {
    return currentUser ? hoovesData?.some((h) => h.user_id === currentUser.id) : false;
  }, [hoovesData, currentUser]);
  const handleHoofClick = async () => {
    if (!currentUser) return;
    const hoofId = `${currentUser.id}-${post.id}`;
    if (hasHoofed) {
      await hoovesCollection.delete(hoofId);
    } else {
      await hoovesCollection.upsert({ id: hoofId, post_id: post.id });
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "post", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "post-header", children: [
      /* @__PURE__ */ jsxDEV("img", { src: pfp, alt: post.username }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 344,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: `#/profile/${post.username}`, children: post.username }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 345,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 343,
      columnNumber: 13
    }, this),
    post.media_type === "video" ? /* @__PURE__ */ jsxDEV("video", { src: post.media_url, controls: true, className: "post-media" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 348,
      columnNumber: 17
    }, this) : /* @__PURE__ */ jsxDEV("img", { src: post.media_url, alt: `Post by ${post.username}`, className: "post-media" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 350,
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
            children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-paw" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 359,
              columnNumber: 25
            }, this)
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 354,
            columnNumber: 21
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("span", { children: [
          hoofCount,
          " Hooves"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 361,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 353,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "post-caption", children: [
        /* @__PURE__ */ jsxDEV("strong", { children: /* @__PURE__ */ jsxDEV("a", { href: `#/profile/${post.username}`, children: post.username }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 364,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 364,
          columnNumber: 21
        }, this),
        post.caption
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 363,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 352,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 342,
    columnNumber: 9
  }, this);
}
function PfpGenerator({ currentUser, onClose }) {
  const [prompt, setPrompt] = useState("a magical pony with a rainbow mane");
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const generateImage = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setImageUrl(null);
    try {
      const result = await websim.imageGen({
        prompt: `${prompt}, cute pony, digital art, profile picture`,
        aspect_ratio: "1:1"
      });
      setImageUrl(result.url);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Sorry, could not generate a pony right now.");
    } finally {
      setIsLoading(false);
    }
  };
  const setAsPfp = async () => {
    if (!imageUrl || !currentUser) return;
    setIsLoading(true);
    try {
      await profilesCollection.upsert({
        id: currentUser.id,
        pfp_url: imageUrl
      });
      onClose();
    } catch (error) {
      console.error("Error setting PFP:", error);
      alert("Could not set your new profile picture.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "pfp-generator", children: /* @__PURE__ */ jsxDEV("div", { className: "pfp-modal", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Create Your Pony PFP" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 415,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("p", { children: "Describe your perfect pony and let AI bring it to life!" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 416,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("textarea", { value: prompt, onChange: (e) => setPrompt(e.target.value) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 417,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("button", { onClick: generateImage, disabled: isLoading, children: isLoading && !imageUrl ? "Generating..." : "Generate Pony" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 418,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("button", { className: "secondary", onClick: onClose, children: "Cancel" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 421,
      columnNumber: 17
    }, this),
    isLoading && !imageUrl && /* @__PURE__ */ jsxDEV("div", { className: "loading", style: { padding: "2rem 0" }, children: /* @__PURE__ */ jsxDEV("div", { className: "spinner" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 423,
      columnNumber: 97
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 423,
      columnNumber: 44
    }, this),
    imageUrl && /* @__PURE__ */ jsxDEV("div", { className: "pfp-result", children: [
      /* @__PURE__ */ jsxDEV("img", { src: imageUrl, alt: "AI generated pony" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 427,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV("button", { onClick: setAsPfp, disabled: isLoading, children: isLoading ? "Saving..." : "Set as Profile Picture" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 429,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 428,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 426,
      columnNumber: 21
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 414,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 413,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 441,
  columnNumber: 13
}));
