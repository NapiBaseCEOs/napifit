package com.napibase.napifit.ui.community

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.annotation.StringRes
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.napibase.napifit.R
import com.napibase.napifit.api.ApiClient
import com.napibase.napifit.api.ApiError
import com.napibase.napifit.api.Logger
import com.napibase.napifit.api.models.FeatureRequest
import com.napibase.napifit.databinding.FragmentCommunityBinding
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.launch

class CommunityFragment : Fragment() {
    private var _binding: FragmentCommunityBinding? = null
    private val binding get() = _binding!!
    private val TAG = "CommunityFragment"

    private lateinit var adapter: CommunityAdapter
    private var currentSort: SortType = SortType.TRENDING
    private var currentRequests: List<FeatureRequest> = emptyList()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCommunityBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecycler()
        setupFilters()
        loadFeatureRequests()
    }

    private fun setupRecycler() {
        binding.communityRecycler.layoutManager = LinearLayoutManager(requireContext())
        adapter = CommunityAdapter(
            onLikeClick = { request -> handleVote(request, VoteAction.LIKE) },
            onDislikeClick = { request -> handleVote(request, VoteAction.DISLIKE) }
        )
        binding.communityRecycler.adapter = adapter
    }

    private fun setupFilters() {
        binding.btnFilterTrending.setOnClickListener { onSortSelected(SortType.TRENDING) }
        binding.btnFilterRecent.setOnClickListener { onSortSelected(SortType.RECENT) }
        updateFilterButtons()
    }

    private fun onSortSelected(sort: SortType) {
        if (currentSort == sort) return
        currentSort = sort
        updateFilterButtons()
        loadFeatureRequests(showFullLoading = false)
    }

    private fun updateFilterButtons() {
        val trendingActive = currentSort == SortType.TRENDING
        binding.btnFilterTrending.alpha = if (trendingActive) 1f else 0.6f
        binding.btnFilterRecent.alpha = if (trendingActive) 0.6f else 1f
    }

    private fun loadFeatureRequests(showFullLoading: Boolean = true) {
        viewLifecycleOwner.lifecycleScope.launch {
            toggleLoading(isVisible = true, hideContent = showFullLoading && currentRequests.isEmpty())

            try {
                val response = ApiClient.apiService.getFeatureRequests(
                    sort = currentSort.apiValue,
                    limit = 50,
                    offset = 0
                )
                if (response.isSuccessful) {
                    val requests = response.body()?.requests.orEmpty()
                    currentRequests = requests
                    if (requests.isEmpty()) {
                        showEmptyState()
                    } else {
                        showList(requests)
                    }
                } else {
                    val apiError = ApiError.fromHttpResponse(
                        statusCode = response.code(),
                        url = response.raw().request.url.toString(),
                        method = response.raw().request.method,
                        errorBody = response.errorBody()?.string()
                    )
                    Logger.logError(TAG, apiError)
                    if (currentRequests.isEmpty()) {
                        showEmptyState()
                    }
                }
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                val apiError = ApiError.fromException(
                    exception = e,
                    url = "feature-requests",
                    method = "GET"
                )
                Logger.logError(TAG, apiError)
                if (currentRequests.isEmpty()) {
                    showEmptyState()
                }
            } finally {
                toggleLoading(isVisible = false, hideContent = false)
            }
        }
    }

    private fun showList(requests: List<FeatureRequest>) {
        binding.emptyState.visibility = View.GONE
        binding.communityRecycler.visibility = View.VISIBLE
        adapter.updateRequests(requests)
    }

    private fun showEmptyState() {
        binding.communityRecycler.visibility = View.GONE
        binding.emptyState.visibility = View.VISIBLE
    }

    private fun handleVote(request: FeatureRequest, action: VoteAction) {
        viewLifecycleOwner.lifecycleScope.launch {
            try {
                val response = when (action) {
                    VoteAction.LIKE -> ApiClient.apiService.likeFeatureRequest(request.id)
                    VoteAction.DISLIKE -> ApiClient.apiService.dislikeFeatureRequest(request.id)
                }
                if (response.isSuccessful) {
                    showToast(action.successMessageRes)
                    loadFeatureRequests(showFullLoading = false)
                } else {
                    val apiError = ApiError.fromHttpResponse(
                        statusCode = response.code(),
                        url = response.raw().request.url.toString(),
                        method = response.raw().request.method,
                        errorBody = response.errorBody()?.string()
                    )
                    Logger.logError(TAG, apiError)
                    showToast(R.string.community_vote_error)
                }
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                val apiError = ApiError.fromException(
                    exception = e,
                    url = "feature-requests/${request.id}/${action.endpoint}",
                    method = "POST"
                )
                Logger.logError(TAG, apiError)
                showToast(R.string.community_vote_error)
            }
        }
    }

    private fun toggleLoading(isVisible: Boolean, hideContent: Boolean) {
        if (isVisible) {
            if (hideContent) {
                binding.communityRecycler.visibility = View.GONE
                binding.emptyState.visibility = View.GONE
            }
            binding.loadingIndicator.visibility = View.VISIBLE
            binding.loadingIndicator.alpha = 0f
            binding.loadingIndicator.animate()
                .alpha(1f)
                .setDuration(200)
                .start()
        } else {
            binding.loadingIndicator.animate()
                .alpha(0f)
                .setDuration(200)
                .withEndAction {
                    binding.loadingIndicator.visibility = View.GONE
                }
                .start()
        }
    }

    private fun showToast(@StringRes messageRes: Int) {
        Toast.makeText(requireContext(), getString(messageRes), Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private enum class SortType(val apiValue: String) {
        TRENDING("likes"),
        RECENT("new")
    }

    private enum class VoteAction(
        @StringRes val successMessageRes: Int,
        val endpoint: String
    ) {
        LIKE(R.string.community_vote_like_success, "like"),
        DISLIKE(R.string.community_vote_dislike_success, "dislike")
    }
}

