package com.napibase.napifit.ui.community

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.napibase.napifit.R
import com.napibase.napifit.api.models.FeatureRequest
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

class CommunityAdapter(
    private var requests: List<FeatureRequest> = emptyList(),
    private val onLikeClick: (FeatureRequest) -> Unit = {},
    private val onDislikeClick: (FeatureRequest) -> Unit = {}
) : RecyclerView.Adapter<CommunityAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(R.id.request_title)
        val description: TextView = view.findViewById(R.id.request_description)
        val likeCount: TextView = view.findViewById(R.id.request_like_count)
        val dislikeCount: TextView = view.findViewById(R.id.request_dislike_count)
        val user: TextView = view.findViewById(R.id.request_user)
        val version: TextView = view.findViewById(R.id.request_version)
        val statusBadge: TextView = view.findViewById(R.id.request_status_badge)
        val createdAt: TextView = view.findViewById(R.id.request_date)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_feature_request, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val request = requests[position]
        val context = holder.itemView.context

        holder.title.text = request.title
        holder.description.text = request.description
        holder.user.text = "👤 ${request.user.name}"
        holder.version.text = request.implementedVersion?.let { "v$it" }
            ?: context.getString(R.string.community_version_pending)
        holder.createdAt.text = formatDate(request.createdAt)

        val isImplemented = request.isImplemented
        holder.statusBadge.text = if (isImplemented) {
            context.getString(R.string.community_status_done)
        } else {
            context.getString(R.string.community_status_planned)
        }
        val badgeBackground = if (isImplemented) {
            R.drawable.badge_success
        } else {
            R.drawable.badge_warning
        }
        val badgeTextColor = if (isImplemented) R.color.primary else R.color.fitness_orange
        holder.statusBadge.background = ContextCompat.getDrawable(context, badgeBackground)
        holder.statusBadge.setTextColor(ContextCompat.getColor(context, badgeTextColor))

        holder.likeCount.text = context.getString(
            R.string.community_like_format,
            request.likeCount
        )
        holder.dislikeCount.text = context.getString(
            R.string.community_dislike_format,
            request.dislikeCount
        )
        styleVoteButton(holder.likeCount, request.isLiked, true)
        styleVoteButton(holder.dislikeCount, request.isDisliked, false)

        holder.likeCount.setOnClickListener { onLikeClick(request) }
        holder.dislikeCount.setOnClickListener { onDislikeClick(request) }
    }

    override fun getItemCount() = requests.size

    fun updateRequests(newRequests: List<FeatureRequest>) {
        requests = newRequests
        notifyDataSetChanged()
    }

    private fun styleVoteButton(view: TextView, isActive: Boolean, isPositive: Boolean) {
        val context = view.context
        val backgroundRes = if (isPositive) {
            R.drawable.vote_button_positive
        } else {
            R.drawable.vote_button_negative
        }
        val activeColor = if (isPositive) R.color.primary else R.color.fitness_orange
        val inactiveColor = if (isPositive) R.color.primary_300_text else R.color.orange_400_text

        view.background = ContextCompat.getDrawable(context, backgroundRes)
        view.setTextColor(
            ContextCompat.getColor(
                context,
                if (isActive) activeColor else inactiveColor
            )
        )
        view.alpha = if (isActive) 1f else 0.85f
    }

    private fun formatDate(value: String): String {
        return try {
            val instant = Instant.parse(value)
            DATE_FORMATTER.format(instant.atZone(ZoneId.systemDefault()))
        } catch (e: Exception) {
            value.take(10)
        }
    }

    companion object {
        private val DATE_FORMATTER: DateTimeFormatter =
            DateTimeFormatter.ofPattern("d MMM yyyy", Locale("tr"))
    }
}

