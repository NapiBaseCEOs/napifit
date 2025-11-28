package com.napibase.napifit;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010\t\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\b\u0010\f\u001a\u00020\rH\u0002J\u0012\u0010\u000e\u001a\u00020\r2\b\u0010\u000f\u001a\u0004\u0018\u00010\u0010H\u0014J\b\u0010\u0011\u001a\u00020\rH\u0002J\b\u0010\u0012\u001a\u00020\rH\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082.\u00a2\u0006\u0002\n\u0000R\u0012\u0010\u0007\u001a\u0004\u0018\u00010\u0004X\u0082\u000e\u00a2\u0006\u0004\n\u0002\u0010\bR\u000e\u0010\t\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\n\u001a\u00020\u000bX\u0082D\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0013"}, d2 = {"Lcom/napibase/napifit/SplashActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "()V", "authCheckComplete", "", "binding", "Lcom/napibase/napifit/databinding/ActivitySplashBinding;", "hasToken", "Ljava/lang/Boolean;", "minimumTimeElapsed", "splashDuration", "", "navigateToNextScreen", "", "onCreate", "savedInstanceState", "Landroid/os/Bundle;", "startParallelAuthCheck", "tryNavigate", "app_debug"})
public final class SplashActivity extends androidx.appcompat.app.AppCompatActivity {
    private com.napibase.napifit.databinding.ActivitySplashBinding binding;
    private final long splashDuration = 1200L;
    private boolean authCheckComplete = false;
    @org.jetbrains.annotations.Nullable()
    private java.lang.Boolean hasToken;
    private boolean minimumTimeElapsed = false;
    
    public SplashActivity() {
        super();
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    /**
     * Start auth check in background while splash animation plays
     */
    private final void startParallelAuthCheck() {
    }
    
    /**
     * Navigate only when both auth check is complete AND minimum time elapsed
     */
    private final void tryNavigate() {
    }
    
    private final void navigateToNextScreen() {
    }
}