"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Example users (replace with real users from DB)
const exampleUsers = [
  { id: 1, name: "Alice", avatar: "/avatars/alice.png", profile: "/profile/alice" },
  { id: 2, name: "Bob", avatar: "/avatars/bob.png", profile: "/profile/bob" },
];

export default function BlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [newPost, setNewPost] = useState({ text: "", media: null, userId: 1 });
  const [reactions, setReactions] = useState<{ [key: number]: { like: number; love: number } }>({});
  const [comments, setComments] = useState<{ [key: number]: { user: any; text: string }[] }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});

  // Handle file upload
  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setNewPost({ ...newPost, media: URL.createObjectURL(e.target.files[0]) });
    }
  };

  // Post submission
  const handlePost = () => {
    if (!newPost.text && !newPost.media) return;
    const user = exampleUsers.find((u) => u.id === newPost.userId);
    const postId = Date.now();
    setPosts([{ ...newPost, user, id: postId }, ...posts]);
    setReactions({ ...reactions, [postId]: { like: 0, love: 0 } });
    setComments({ ...comments, [postId]: [] });
    setCommentInputs({ ...commentInputs, [postId]: "" });
    setNewPost({ text: "", media: null, userId: 1 });
    setShowEditor(false);
  };

  // Handle reactions
  const handleReact = (id: number, type: "like" | "love") => {
    setReactions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: prev[id][type] + 1,
      },
    }));
  };

  // Handle comment submission
  const handleComment = (postId: number) => {
    if (!commentInputs[postId]) return;
    const user = exampleUsers.find((u) => u.id === 1); // currently logged-in user mock
    const newComment = { user, text: commentInputs[postId] };
    setComments((prev) => ({
      ...prev,
      [postId]: [...prev[postId], newComment],
    }));
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  // Delete post
  const handleDelete = (postId: number) => {
    setPosts(posts.filter((p) => p.id !== postId));
    const newReactions = { ...reactions };
    delete newReactions[postId];
    setReactions(newReactions);
    const newComments = { ...comments };
    delete newComments[postId];
    setComments(newComments);
  };

  return (
    <main className="bg-gray-50 min-h-screen px-6 pt-28 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">ZenOS Community Blog</h1>
          <p className="text-gray-600 text-lg">
            Share your thoughts, ideas, and experiences. Add text, images, or videos.
          </p>
        </div>

        {/* New Post Button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
          >
            <span className="text-2xl font-bold">+</span> Create a Post
          </button>
        </div>

        {/* Post Editor */}
        {showEditor && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-8 mb-12 border border-gray-100"
          >
            <textarea
              value={newPost.text}
              onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
              placeholder="What's on your mind?"
              className="w-full p-4 rounded-2xl border border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-lg text-black bg-white"
              rows={4}
            />
            <input className="bg-black rounded-5xl" type="file" accept="image/*,video/*" onChange={handleFileChange} className="mb-4 rounded-xl border p-2" />
            {newPost.media && (
              <div className="mt-4">
                {newPost.media.endsWith(".mp4") || newPost.media.endsWith(".mov") ? (
                  <video src={newPost.media} controls className="rounded-2xl w-full max-h-[600px]" />
                ) : (
                  <img
                    src={newPost.media}
                    alt="preview"
                    className="rounded-2xl w-full max-h-[600px] object-cover"
                  />
                )}
              </div>
            )}
            <div className="text-right">
              <button
                onClick={handlePost}
                className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl text-lg font-medium hover:bg-blue-700 transition-all"
              >
                Post
              </button>
            </div>
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-10">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col border border-gray-100"
            >
              {/* Post header */}
              <div className="flex items-center justify-between mb-6">
                <a href={post.user.profile} className="flex items-center gap-4">
                  <Image
                    src={post.user.avatar}
                    alt={post.user.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <span className="font-semibold text-gray-900 text-xl">{post.user.name}</span>
                </a>
                {/* Delete Button only for post owner */}
                {post.userId === 1 && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 font-semibold hover:text-red-800 transition"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Text content */}
              <p className="text-gray-800 text-lg leading-relaxed mb-6">{post.text}</p>

              {/* Media */}
              {post.media && (
                <div className="rounded-2xl overflow-hidden mb-6">
                  {post.media.endsWith(".mp4") || post.media.endsWith(".mov") ? (
                    <video src={post.media} controls className="w-full max-h-[700px]" />
                  ) : (
                    <img
                      src={post.media}
                      alt="post media"
                      className="w-full max-h-[700px] object-cover"
                    />
                  )}
                </div>
              )}

              {/* Reactions */}
              <div className="flex gap-6 items-center border-t pt-4 mb-4">
                <button
                  onClick={() => handleReact(post.id, "like")}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                  👍 <span className="text-lg">{reactions[post.id]?.like || 0}</span>
                </button>
                <button
                  onClick={() => handleReact(post.id, "love")}
                  className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition"
                >
                  💖 <span className="text-lg">{reactions[post.id]?.love || 0}</span>
                </button>
              </div>

              {/* Comments */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Comments</h3>
                {comments[post.id]?.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-3 mb-2">
                    <Image src={c.user.avatar} alt={c.user.name} width={32} height={32} className="rounded-full" />
                    <div>
                      <span className="font-semibold text-gray-900">{c.user.name}</span>
                      <p className="text-gray-700">{c.text}</p>
                    </div>
                  </div>
                ))}
                {/* Comment Input */}
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                  >
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
