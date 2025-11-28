package com.napibase.napifit.utils

import androidx.recyclerview.widget.DiffUtil
import com.napibase.napifit.api.models.FeatureRequest

/**
 * DiffUtil callback for efficient RecyclerView updates
 */
class FeatureRequestDiffCallback(
    private val oldList: List<FeatureRequest>,
    private val newList: List<FeatureRequest>
) : DiffUtil.Callback() {
    
    override fun getOldListSize(): Int = oldList.size
    
    override fun getNewListSize(): Int = newList.size
    
    override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        return oldList[oldItemPosition].id == newList[newItemPosition].id
    }
    
    override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        val oldItem = oldList[oldItemPosition]
        val newItem = newList[newItemPosition]
        
        return oldItem.title == newItem.title &&
                oldItem.description == newItem.description &&
                oldItem.likeCount == newItem.likeCount &&
                oldItem.dislikeCount == newItem.dislikeCount &&
                oldItem.isImplemented == newItem.isImplemented
    }
    
    override fun getChangePayload(oldItemPosition: Int, newItemPosition: Int): Any? {
        val oldItem = oldList[oldItemPosition]
        val newItem = newList[newItemPosition]
        
        val changes = mutableMapOf<String, Any>()
        
        if (oldItem.likeCount != newItem.likeCount) {
            changes["likeCount"] = newItem.likeCount
        }
        
        if (oldItem.dislikeCount != newItem.dislikeCount) {
            changes["dislikeCount"] = newItem.dislikeCount
        }
        
        if (oldItem.isImplemented != newItem.isImplemented) {
            changes["isImplemented"] = newItem.isImplemented
        }
        
        return if (changes.isNotEmpty()) changes else null
    }
}

