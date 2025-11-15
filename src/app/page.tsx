import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-20 sm:px-6 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary-500/15 via-fitness-orange/15 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-fitness-purple/15 via-fitness-blue/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary-400/8 via-fitness-orange/8 to-fitness-purple/8 blur-3xl" />
      </div>

      <div className="max-w-4xl w-full space-y-12 animate-fade-up">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-300 shadow-lg shadow-primary-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            NapiFit Platformu
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Sağlıklı Yaşamın
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-fitness-orange to-fitness-purple bg-clip-text text-transparent">
              Yeni Başlangıcı
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Fitness hedeflerinizi takip edin, sağlık metriklerinizi izleyin ve 
            <span className="text-primary-400 font-medium"> başarıya ulaşın</span>. 
            Modern teknoloji ile sağlıklı yaşam yolculuğunuzu başlatın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105 transition-all duration-300"
            >
              <span>Hemen Başla</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-700 bg-gray-900/50 px-8 py-4 text-base font-semibold text-gray-200 hover:border-primary-500/50 hover:text-primary-400 hover:bg-gray-900/70 transition-all duration-300"
            >
              Giriş Yap
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-3 gap-6 pt-8">
          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-primary-500/50 hover:bg-gray-900/70 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/20 mb-4">
                <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sağlık Metrikleri</h3>
              <p className="text-sm text-gray-400">BMI, kilo, hedef takibi ve detaylı sağlık istatistikleri</p>
            </div>
          </div>

          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-fitness-orange/50 hover:bg-gray-900/70 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fitness-orange/0 to-fitness-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-fitness-orange/20 mb-4">
                <svg className="w-6 h-6 text-fitness-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Egzersiz Takibi</h3>
              <p className="text-sm text-gray-400">Antrenmanlarınızı kaydedin ve ilerlemenizi görüntüleyin</p>
            </div>
          </div>

          <div className="group relative rounded-2xl border border-gray-800/70 bg-gray-900/50 p-6 backdrop-blur-sm hover:border-fitness-purple/50 hover:bg-gray-900/70 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fitness-purple/0 to-fitness-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-fitness-purple/20 mb-4">
                <svg className="w-6 h-6 text-fitness-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Beslenme Takibi</h3>
              <p className="text-sm text-gray-400">Öğünlerinizi kaydedin ve kalori alımınızı takip edin</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            by <span className="text-primary-400 font-medium">NapiBase</span>
          </p>
        </div>
      </div>
    </main>
  );
}

