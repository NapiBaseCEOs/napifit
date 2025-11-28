package com.napibase.napifit.utils

import android.content.Context
import android.graphics.drawable.Drawable
import android.widget.ImageView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.request.RequestOptions

/**
 * Optimized image loading utility using Glide
 */
object ImageLoader {
    
    private val defaultOptions = RequestOptions()
        .diskCacheStrategy(DiskCacheStrategy.ALL)
        .centerCrop()
    
    /**
     * Load image from URL with optimization
     */
    fun load(
        context: Context,
        url: String?,
        imageView: ImageView,
        placeholder: Drawable? = null,
        error: Drawable? = null
    ) {
        var request = Glide.with(context)
            .load(url)
            .apply(defaultOptions)
        
        placeholder?.let { request = request.placeholder(it) }
        error?.let { request = request.error(it) }
        
        request.into(imageView)
    }
    
    /**
     * Load circular image (for avatars)
     */
    fun loadCircular(
        context: Context,
        url: String?,
        imageView: ImageView,
        placeholder: Drawable? = null
    ) {
        val circularOptions = RequestOptions()
            .diskCacheStrategy(DiskCacheStrategy.ALL)
            .circleCrop()
        
        var request = Glide.with(context)
            .load(url)
            .apply(circularOptions)
        
        placeholder?.let { request = request.placeholder(it) }
        
        request.into(imageView)
    }
    
    /**
     * Preload image into cache
     */
    fun preload(context: Context, url: String?) {
        Glide.with(context)
            .load(url)
            .preload()
    }
    
    /**
     * Clear memory cache
     */
    fun clearMemoryCache(context: Context) {
        Glide.get(context).clearMemory()
    }
    
    /**
     * Clear disk cache (must be called on background thread)
     */
    fun clearDiskCache(context: Context) {
        Glide.get(context).clearDiskCache()
    }
}

