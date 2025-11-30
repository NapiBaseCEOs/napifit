export default function SkeletonChart({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 ${className}`}>
            <div className="space-y-4">
                {/* Title */}
                <div className="h-6 w-40 bg-gray-800 rounded"></div>

                {/* Chart bars */}
                <div className="flex items-end justify-between gap-2 h-48">
                    {[60, 80, 45, 90, 70, 85, 55].map((height, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-gray-800 rounded-t-lg"
                            style={{ height: `${height}%` }}
                        ></div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-gray-800 rounded-full"></div>
                        <div className="h-3 w-16 bg-gray-800 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-gray-800 rounded-full"></div>
                        <div className="h-3 w-16 bg-gray-800 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
