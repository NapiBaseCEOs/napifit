"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type FeatureRequest = {
  id: string;
  title: string;
  description: string;
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  isImplemented: boolean;
  implementedAt: string | null;
  implementedVersion: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    joinedAt: string;
    showStats: boolean;
    showPublicProfile: boolean;
  };
};

interface FeatureRequestCardProps {
  request: FeatureRequest;
  onLike: (id: string) => Promise<void>;
  onDislike: (id: string) => Promise<void>;
  currentUserId?: string;
}

export default function FeatureRequestCard({ request, onLike, onDislike, currentUserId }: FeatureRequestCardProps) {
  const [isLiked, setIsLiked] = useState(request.isLiked);
  const [likeCount, setLikeCount] = useState(request.likeCount);
  const [isDisliked, setIsDisliked] = useState(request.isDisliked);
  const [dislikeCount, setDislikeCount] = useState(request.dislikeCount);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  const handleLike = async () => {
    if (isLiking || isDisliking || !currentUserId) return;

    setIsLiking(true);
    const previousLiked = isLiked;
    const previousDisliked = isDisliked;
    const previousLikeCount = likeCount;
    const previousDislikeCount = dislikeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(previousLiked ? likeCount - 1 : likeCount + 1);
    
    // Eğer dislike varsa kaldır
    if (previousDisliked) {
      setIsDisliked(false);
      setDislikeCount(Math.max(0, dislikeCount - 1));
    }

    try {
      await onLike(request.id);
    } catch (error) {
      // Rollback on error
      setIsLiked(previousLiked);
      setLikeCount(previousLikeCount);
      setIsDisliked(previousDisliked);
      setDislikeCount(previousDislikeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (isLiking || isDisliking || !currentUserId) return;

    setIsDisliking(true);
    const previousLiked = isLiked;
    const previousDisliked = isDisliked;
    const previousLikeCount = likeCount;
    const previousDislikeCount = dislikeCount;

    // Optimistic update
    setIsDisliked(!isDisliked);
    setDislikeCount(previousDisliked ? dislikeCount - 1 : dislikeCount + 1);
    
    // Eğer like varsa kaldır
    if (previousLiked) {
      setIsLiked(false);
      setLikeCount(Math.max(0, likeCount - 1));
    }

    try {
      await onDislike(request.id);
    } catch (error) {
      // Rollback on error
      setIsLiked(previousLiked);
      setLikeCount(previousLikeCount);
      setIsDisliked(previousDisliked);
      setDislikeCount(previousDislikeCount);
    } finally {
      setIsDisliking(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-6 backdrop-blur-lg transition-all ${
        request.isImplemented
          ? "border-green-500/30 bg-green-500/5"
          : "border-gray-800/60 bg-gray-900/80"
      } hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{request.title}</h3>
            {request.isImplemented && (
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                ✓ Uygulandı
              </span>
            )}
            {request.implementedVersion && (
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                v{request.implementedVersion}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{request.description}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* User Info */}
        {request.user.showPublicProfile ? (
          <Link
            href={`/profile?userId=${request.user.id}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors"
          >
            {request.user.avatar ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image src={request.user.avatar} alt={request.user.name} fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-semibold text-white">
                {request.user.name[0].toUpperCase()}
              </div>
            )}
            <span>{request.user.name}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400 cursor-not-allowed">
            {request.user.avatar ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image src={request.user.avatar} alt={request.user.name} fill className="object-cover unoptimized" />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-xs font-semibold text-white">
                {request.user.name[0].toUpperCase()}
              </div>
            )}
            <span>{request.user.name}</span>
          </div>
        )}

        {/* Like/Dislike Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={isLiking || isDisliking || !currentUserId}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              isLiked
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-primary-500/30 hover:text-primary-400"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isLiked ? (
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            )}
            <span>{likeCount}</span>
          </button>
          <button
            onClick={handleDislike}
            disabled={isLiking || isDisliking || !currentUserId}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              isDisliked
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-red-500/30 hover:text-red-400"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isDisliked ? (
              <svg className="h-4 w-4 fill-current rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 rotate-180" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            )}
            <span>{dislikeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

