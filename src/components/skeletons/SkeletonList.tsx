export default function SkeletonList({ count = 3, className = "" }: { count?: number; className?: string }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-gray-800/60 bg-gray-900/80 p-4">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="h-12 w-12 bg-gray-800 rounded-full flex-shrink-0"></div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-800 rounded"></div>
                            <div className="h-3 w-1/2 bg-gray-800 rounded"></div>
                        </div>

                        {/* Action */}
                        <div className="h-8 w-16 bg-gray-800 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
