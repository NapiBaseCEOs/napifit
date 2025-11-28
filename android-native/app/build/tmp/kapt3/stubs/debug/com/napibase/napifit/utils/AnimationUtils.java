package com.napibase.napifit.utils;

/**
 * Optimized animation utilities
 */
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000@\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0010\u0007\n\u0002\b\u0005\n\u0002\u0010 \n\u0002\b\u0002\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J4\u0010\u0003\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u00062\b\b\u0002\u0010\u0007\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\b2\u0010\b\u0002\u0010\n\u001a\n\u0012\u0004\u0012\u00020\u0004\u0018\u00010\u000bJ4\u0010\f\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u00062\b\b\u0002\u0010\u0007\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\b2\u0010\b\u0002\u0010\n\u001a\n\u0012\u0004\u0012\u00020\u0004\u0018\u00010\u000bJ\u0018\u0010\r\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u00062\b\b\u0002\u0010\u000e\u001a\u00020\u000fJ,\u0010\u0010\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u00062\b\b\u0002\u0010\u0011\u001a\u00020\u00122\b\b\u0002\u0010\u0013\u001a\u00020\u00122\b\b\u0002\u0010\u0007\u001a\u00020\bJ,\u0010\u0014\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u00062\b\b\u0002\u0010\u0007\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\b2\b\b\u0002\u0010\u0015\u001a\u00020\u0012J(\u0010\u0016\u001a\u00020\u00042\f\u0010\u0017\u001a\b\u0012\u0004\u0012\u00020\u00060\u00182\b\b\u0002\u0010\u0019\u001a\u00020\b2\b\b\u0002\u0010\u0007\u001a\u00020\b\u00a8\u0006\u001a"}, d2 = {"Lcom/napibase/napifit/utils/AnimationUtils;", "", "()V", "fadeIn", "", "view", "Landroid/view/View;", "duration", "", "startDelay", "onEnd", "Lkotlin/Function0;", "fadeOut", "pulse", "count", "", "scale", "scaleX", "", "scaleY", "slideUp", "distance", "staggeredSlideUp", "views", "", "staggerDelay", "app_debug"})
public final class AnimationUtils {
    @org.jetbrains.annotations.NotNull()
    public static final com.napibase.napifit.utils.AnimationUtils INSTANCE = null;
    
    private AnimationUtils() {
        super();
    }
    
    /**
     * Fade in animation with optimized settings
     */
    public final void fadeIn(@org.jetbrains.annotations.NotNull()
    android.view.View view, long duration, long startDelay, @org.jetbrains.annotations.Nullable()
    kotlin.jvm.functions.Function0<kotlin.Unit> onEnd) {
    }
    
    /**
     * Fade out animation with optimized settings
     */
    public final void fadeOut(@org.jetbrains.annotations.NotNull()
    android.view.View view, long duration, long startDelay, @org.jetbrains.annotations.Nullable()
    kotlin.jvm.functions.Function0<kotlin.Unit> onEnd) {
    }
    
    /**
     * Slide up animation (for cards and items)
     */
    public final void slideUp(@org.jetbrains.annotations.NotNull()
    android.view.View view, long duration, long startDelay, float distance) {
    }
    
    /**
     * Scale animation (for buttons and FABs)
     */
    public final void scale(@org.jetbrains.annotations.NotNull()
    android.view.View view, float scaleX, float scaleY, long duration) {
    }
    
    /**
     * Staggered animation for list of views
     */
    public final void staggeredSlideUp(@org.jetbrains.annotations.NotNull()
    java.util.List<? extends android.view.View> views, long staggerDelay, long duration) {
    }
    
    /**
     * Pulse animation for notifications/badges
     */
    public final void pulse(@org.jetbrains.annotations.NotNull()
    android.view.View view, int count) {
    }
}