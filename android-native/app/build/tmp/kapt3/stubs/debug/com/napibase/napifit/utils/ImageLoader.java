package com.napibase.napifit.utils;

/**
 * Optimized image loading utility using Glide
 */
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00004\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u000e\u0010\u0005\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\bJ\u000e\u0010\t\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\bJ8\u0010\n\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\b2\b\u0010\u000b\u001a\u0004\u0018\u00010\f2\u0006\u0010\r\u001a\u00020\u000e2\n\b\u0002\u0010\u000f\u001a\u0004\u0018\u00010\u00102\n\b\u0002\u0010\u0011\u001a\u0004\u0018\u00010\u0010J,\u0010\u0012\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\b2\b\u0010\u000b\u001a\u0004\u0018\u00010\f2\u0006\u0010\r\u001a\u00020\u000e2\n\b\u0002\u0010\u000f\u001a\u0004\u0018\u00010\u0010J\u0018\u0010\u0013\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\b2\b\u0010\u000b\u001a\u0004\u0018\u00010\fR\u000e\u0010\u0003\u001a\u00020\u0004X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0014"}, d2 = {"Lcom/napibase/napifit/utils/ImageLoader;", "", "()V", "defaultOptions", "Lcom/bumptech/glide/request/RequestOptions;", "clearDiskCache", "", "context", "Landroid/content/Context;", "clearMemoryCache", "load", "url", "", "imageView", "Landroid/widget/ImageView;", "placeholder", "Landroid/graphics/drawable/Drawable;", "error", "loadCircular", "preload", "app_debug"})
public final class ImageLoader {
    @org.jetbrains.annotations.NotNull()
    private static final com.bumptech.glide.request.RequestOptions defaultOptions = null;
    @org.jetbrains.annotations.NotNull()
    public static final com.napibase.napifit.utils.ImageLoader INSTANCE = null;
    
    private ImageLoader() {
        super();
    }
    
    /**
     * Load image from URL with optimization
     */
    public final void load(@org.jetbrains.annotations.NotNull()
    android.content.Context context, @org.jetbrains.annotations.Nullable()
    java.lang.String url, @org.jetbrains.annotations.NotNull()
    android.widget.ImageView imageView, @org.jetbrains.annotations.Nullable()
    android.graphics.drawable.Drawable placeholder, @org.jetbrains.annotations.Nullable()
    android.graphics.drawable.Drawable error) {
    }
    
    /**
     * Load circular image (for avatars)
     */
    public final void loadCircular(@org.jetbrains.annotations.NotNull()
    android.content.Context context, @org.jetbrains.annotations.Nullable()
    java.lang.String url, @org.jetbrains.annotations.NotNull()
    android.widget.ImageView imageView, @org.jetbrains.annotations.Nullable()
    android.graphics.drawable.Drawable placeholder) {
    }
    
    /**
     * Preload image into cache
     */
    public final void preload(@org.jetbrains.annotations.NotNull()
    android.content.Context context, @org.jetbrains.annotations.Nullable()
    java.lang.String url) {
    }
    
    /**
     * Clear memory cache
     */
    public final void clearMemoryCache(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
    }
    
    /**
     * Clear disk cache (must be called on background thread)
     */
    public final void clearDiskCache(@org.jetbrains.annotations.NotNull()
    android.content.Context context) {
    }
}