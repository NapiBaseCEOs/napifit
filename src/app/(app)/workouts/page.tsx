import DailySummaryCard from "@/components/dashboard/DailySummaryCard";
import WeeklyProgressChart from "@/components/dashboard/WeeklyProgressChart";
import QuickActionsWidget from "@/components/dashboard/QuickActionsWidget";

export default function WorkoutsPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6">Egzersiz Takibi</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DailySummaryCard />
                <WeeklyProgressChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Son Egzersizler</h2>
                        <p className="text-gray-400">Henüz egzersiz eklenmemiş.</p>
                        {/* Workout list will go here */}
                    </div>
                </div>

                <div>
                    <QuickActionsWidget />
                </div>
            </div>
        </div>
    );
}
