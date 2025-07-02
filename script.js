const { useState, useEffect, useMemo, useSyncExternalStore, useCallback } = React;
const { createRoot } = ReactDOM;

const room = new WebsimSocket();

// --- Collections ---
const usersCollection = room.collection('cliptrot_users_v2');
const postsCollection = room.collection('cliptrot_posts_v1');
const hoovesCollection = room.collection('cliptrot_hooves_v1');
const followsCollection = room.collection('cliptrot_follows_v1');

// --- Hooks ---
function useCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        window.websim.getCurrentUser().then(setUser);
    }, []);
    return user;
}

function useUserPfp(username) {
    const filter = useMemo(() => ({ username }), [username]);
    const userRecords = useSyncExternalStore(
        usersCollection.filter(filter).subscribe,
        usersCollection.filter(filter).getList
    );
    const defaultPfp = `https://images.websim.com/avatar/${username}`;
    if (!username) return 'pony-logo.png';
    return userRecords?.[0]?.pfp_url || defaultPfp;
}


// --- Components ---

function App() {
    const [route, setRoute] = useState(window.location.hash || '#/');
    const [isPfpModalOpen, setIsPfpModalOpen] = useState(false);
    const currentUser = useCurrentUser();

    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    let pageContent;
    if (route.startsWith('#/profile/')) {
        const username = route.split('/')[2];
        pageContent = <ProfilePage username={username} currentUser={currentUser} />;
    } else if (route === '#/following') {
        pageContent = <FollowingFeed currentUser={currentUser} />;
    } else {
        pageContent = <MainFeed currentUser={currentUser} />;
    }

    return (
        <div>
            <Header currentUser={currentUser} activeRoute={route} onPfpClick={() => setIsPfpModalOpen(true)} />
            <main>
                {pageContent}
            </main>
            {isPfpModalOpen && <PfpGenerator currentUser={currentUser} onClose={() => setIsPfpModalOpen(false)} />}
        </div>
    );
}

function Header({ currentUser, activeRoute, onPfpClick }) {
    const pfp = useUserPfp(currentUser?.username);

    return (
        <header className="header">
            <a href="#/" className="logo">
                <img src="pony-logo.png" alt="ClipTrot Logo" />
                ClipTrot
            </a>
            <nav className="nav">
                <a href="#/" className={activeRoute === '#/' ? 'active' : ''}>Main Feed</a>
                <a href="#/following" className={activeRoute === '#/following' ? 'active' : ''}>Following</a>
            </nav>
            <div className="profile-nav">
                {currentUser ? (
                    <img
                        src={pfp}
                        alt={currentUser.username}
                        onClick={onPfpClick}
                        title="Generate Pony PFP"
                    />
                ) : <div style={{width: '45px', height: '45px'}}></div>}
            </div>
        </header>
    );
}

function MainFeed({ currentUser }) {
    return (
        <div>
            {currentUser && <PostForm currentUser={currentUser} />}
            <Feed />
        </div>
    );
}

function FollowingFeed({ currentUser }) {
    if (!currentUser) return <div className="loading">Loading...</div>;

    const followsFilter = useMemo(() => ({ follower_id: currentUser.id }), [currentUser.id]);
    const follows = useSyncExternalStore(
        followsCollection.filter(followsFilter).subscribe,
        followsCollection.filter(followsFilter).getList
    );

    const followingUsernames = useMemo(() => {
        if (!follows) return [];
        return follows.map(f => f.following_username);
    }, [follows]);

    return (
        <div>
            <Feed usernames={followingUsernames} />
        </div>
    );
}

function ProfilePage({ username, currentUser }) {
    const isOwnProfile = currentUser?.username === username;

    const followsFilter = useMemo(() => ({ follower_id: username }), [username]);
    const follows = useSyncExternalStore(
        followsCollection.filter(followsFilter).subscribe,
        followsCollection.filter(followsFilter).getList,
    ) || [];

    const followersFilter = useMemo(() => ({ following_id: username }), [username]);
    const followers = useSyncExternalStore(
        followsCollection.filter(followersFilter).subscribe,
        followsCollection.filter(followersFilter).getList,
    ) || [];

    return (
        <div>
            <ProfileHeader 
                username={username}
                followingCount={follows.length}
                followersCount={followers.length}
                currentUser={currentUser} 
                isOwnProfile={isOwnProfile}
            />
            <h2 style={{color: 'var(--primary-color)'}}>{isOwnProfile ? "My" : username+"'s"} Posts</h2>
            <Feed usernames={[username]} />
        </div>
    );
}


function ProfileHeader({ username, followingCount, followersCount, currentUser, isOwnProfile }) {
    const pfp = useUserPfp(username);
    const follows = useSyncExternalStore(followsCollection.subscribe, followsCollection.getList) || [];

    const isFollowing = useMemo(() => {
        if (!currentUser) return false;
        return follows.some(f => f.follower_id === currentUser.id && f.following_id === username);
    }, [follows, currentUser, username]);

    const handleFollow = async () => {
        if (!currentUser || isOwnProfile) return;
        await followsCollection.create({
            follower_id: currentUser.id,
            follower_username: currentUser.username,
            following_id: username,
            following_username: username,
        });
    };

    const handleUnfollow = async () => {
        if (!currentUser || isOwnProfile) return;
        const followRecord = follows.find(f => f.follower_id === currentUser.id && f.following_id === username);
        if (followRecord) {
            await followsCollection.delete(followRecord.id);
        }
    };
    
    return (
        <div className="profile-header">
            <img src={pfp} alt={username} />
            <div className="profile-info">
                <h1>{username}</h1>
                <div className="profile-stats">
                    <span><strong>{followersCount}</strong> Followers</span>
                    <span><strong>{followingCount}</strong> Following</span>
                </div>
                {!isOwnProfile && currentUser && (
                    isFollowing ? (
                         <button className="follow-button unfollow-button" onClick={handleUnfollow}>Unfollow</button>
                    ) : (
                         <button className="follow-button" onClick={handleFollow}>Follow</button>
                    )
                )}
            </div>
        </div>
    );
}


function PostForm({ currentUser }) {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !caption || isUploading) return;
        setIsUploading(true);
        try {
            const mediaUrl = await window.websim.upload(file);
            const mediaType = file.type.startsWith('video') ? 'video' : 'image';
            await postsCollection.create({
                caption: caption,
                media_url: mediaUrl,
                media_type: mediaType,
                user_id: currentUser.id,
            });
            setCaption('');
            setFile(null);
            e.target.reset(); // Reset file input
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <h2>Create a new post</h2>
            <textarea
                placeholder="What's on your mind, pony?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
            />
            <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
            />
            <button type="submit" disabled={isUploading || !file || !caption}>
                {isUploading ? 'Posting...' : 'Post to ClipTrot'}
            </button>
        </form>
    );
}

function Feed({ usernames }) {
    const allPosts = useSyncExternalStore(postsCollection.subscribe, postsCollection.getList);

    const posts = useMemo(() => {
        if (!allPosts) return null; // loading state
        const sortedPosts = [...allPosts].reverse(); // newest first
        if (!usernames) {
            return sortedPosts; // Main feed
        }
        return sortedPosts.filter(post => usernames.includes(post.username));
    }, [allPosts, usernames]);
    
    const currentUser = useCurrentUser();

    if (posts === null) return <div className="loading"><div className="spinner"></div></div>;
    if (posts.length === 0) return <div className="empty-feed">It's a bit quiet here... No posts yet!</div>;

    return (
        <div className="feed">
            {posts.map(post => (
                <Post key={post.id} post={post} currentUser={currentUser} />
            ))}
        </div>
    );
}

function Post({ post, currentUser }) {
    const pfp = useUserPfp(post.username);
    
    const hoovesFilter = useMemo(() => ({ post_id: post.id }), [post.id]);
    const hooves = useSyncExternalStore(
        hoovesCollection.filter(hoovesFilter).subscribe,
        hoovesCollection.filter(hoovesFilter).getList
    ) || [];

    const hasHoofed = useMemo(() => {
        return currentUser ? hooves.some(h => h.username === currentUser.username) : false;
    }, [hooves, currentUser]);

    const handleHoofClick = async () => {
        if (!currentUser) return;
        if (hasHoofed) {
            const hoof = hooves.find(h => h.username === currentUser.username);
            if (hoof) await hoovesCollection.delete(hoof.id);
        } else {
            await hoovesCollection.create({ post_id: post.id, user_id: currentUser.id });
        }
    };

    return (
        <div className="post">
            <div className="post-header">
                <img src={pfp} alt={post.username} />
                <a href={`#/profile/${post.username}`}>{post.username}</a>
            </div>
            {post.media_type === 'video' ? (
                <video src={post.media_url} controls className="post-media" />
            ) : (
                <img src={post.media_url} alt={`Post by ${post.username}`} className="post-media" />
            )}
            <div className="post-content">
                <div className="post-actions">
                    <button
                        className={`hoof-button ${hasHoofed ? 'hoofed' : ''}`}
                        onClick={handleHoofClick}
                        title="Give a Hoof"
                    >
                        <i className="fa-solid fa-paw"></i>
                    </button>
                    <span>{hooves.length} Hooves</span>
                </div>
                <p className="post-caption">
                    <strong><a href={`#/profile/${post.username}`}>{post.username}</a></strong>
                    {post.caption}
                </p>
            </div>
        </div>
    );
}

function PfpGenerator({ currentUser, onClose }) {
    const [prompt, setPrompt] = useState('a magical pony with a rainbow mane');
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
             const userFilter = usersCollection.filter({ user_id: currentUser.id });
             const existingUserRecords = userFilter.getList();
             if (existingUserRecords.length > 0) {
                 await usersCollection.update(existingUserRecords[0].id, { pfp_url: imageUrl });
             } else {
                 await usersCollection.create({
                     user_id: currentUser.id,
                     username: currentUser.username,
                     pfp_url: imageUrl,
                 });
             }
            onClose();
        } catch(error) {
            console.error("Error setting PFP:", error);
            alert("Could not set your new profile picture.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pfp-generator">
            <div className="pfp-modal">
                <h2>Create Your Pony PFP</h2>
                <p>Describe your perfect pony and let AI bring it to life!</p>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                <button onClick={generateImage} disabled={isLoading}>
                    {isLoading && !imageUrl ? 'Generating...' : 'Generate Pony'}
                </button>
                <button className="secondary" onClick={onClose}>Cancel</button>
                
                {isLoading && !imageUrl && <div className="loading" style={{padding: '2rem 0'}}><div className="spinner"></div></div>}

                {imageUrl && (
                    <div className="pfp-result">
                        <img src={imageUrl} alt="AI generated pony" />
                        <div>
                            <button onClick={setAsPfp} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Set as Profile Picture'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

