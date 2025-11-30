export default function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-2xl border border-gray-800/60 bg-gray-900/80 p-6 ${className}`}>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-gray-800 rounded"></div>
                    <div className="h-4 w-16 bg-gray-800 rounded"></div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-800 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-800 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-800 rounded"></div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 pt-2">
                    <div className="h-8 w-20 bg-gray-800 rounded-lg"></div>
                    <div className="h-8 w-20 bg-gray-800 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
