package com.napibase.napifit.utils

import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.DecelerateInterpolator

/**
 * Optimized animation utilities
 */
object AnimationUtils {
    
    /**
     * Fade in animation with optimized settings
     */
    fun fadeIn(
        view: View,
        duration: Long = 300,
        startDelay: Long = 0,
        onEnd: (() -> Unit)? = null
    ) {
        view.alpha = 0f
        view.visibility = View.VISIBLE
        view.animate()
            .alpha(1f)
            .setDuration(duration)
            .setStartDelay(startDelay)
            .setInterpolator(DecelerateInterpolator())
            .withLayer() // Hardware layer for better performance
            .withEndAction {
                onEnd?.invoke()
            }
            .start()
    }
    
    /**
     * Fade out animation with optimized settings
     */
    fun fadeOut(
        view: View,
        duration: Long = 300,
        startDelay: Long = 0,
        onEnd: (() -> Unit)? = null
    ) {
        view.animate()
            .alpha(0f)
            .setDuration(duration)
            .setStartDelay(startDelay)
            .setInterpolator(AccelerateDecelerateInterpolator())
            .withLayer()
            .withEndAction {
                view.visibility = View.GONE
                onEnd?.invoke()
            }
            .start()
    }
    
    /**
     * Slide up animation (for cards and items)
     */
    fun slideUp(
        view: View,
        duration: Long = 400,
        startDelay: Long = 0,
        distance: Float = 50f
    ) {
        view.alpha = 0f
        view.translationY = distance
        view.animate()
            .alpha(1f)
            .translationY(0f)
            .setDuration(duration)
            .setStartDelay(startDelay)
            .setInterpolator(DecelerateInterpolator())
            .withLayer()
            .start()
    }
    
    /**
     * Scale animation (for buttons and FABs)
     */
    fun scale(
        view: View,
        scaleX: Float = 1f,
        scaleY: Float = 1f,
        duration: Long = 200
    ) {
        view.animate()
            .scaleX(scaleX)
            .scaleY(scaleY)
            .setDuration(duration)
            .setInterpolator(AccelerateDecelerateInterpolator())
            .withLayer()
            .start()
    }
    
    /**
     * Staggered animation for list of views
     */
    fun staggeredSlideUp(
        views: List<View>,
        staggerDelay: Long = 100,
        duration: Long = 400
    ) {
        views.forEachIndexed { index, view ->
            slideUp(
                view = view,
                duration = duration,
                startDelay = index * staggerDelay,
                distance = 50f
            )
        }
    }
    
    /**
     * Pulse animation for notifications/badges
     */
    fun pulse(view: View, count: Int = 2) {
        view.animate()
            .scaleX(1.1f)
            .scaleY(1.1f)
            .setDuration(150)
            .withLayer()
            .withEndAction {
                view.animate()
                    .scaleX(1f)
                    .scaleY(1f)
                    .setDuration(150)
                    .withLayer()
                    .withEndAction {
                        if (count > 1) {
                            pulse(view, count - 1)
                        }
                    }
                    .start()
            }
            .start()
    }
}

