package com.napibase.napifit.ui.community;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000h\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\f\n\u0002\u0010\b\n\u0002\b\u0007\u0018\u00002\u00020\u0001:\u000223B\u0005\u00a2\u0006\u0002\u0010\u0002J\u0018\u0010\u0011\u001a\u00020\u00122\u0006\u0010\u0013\u001a\u00020\u000e2\u0006\u0010\u0014\u001a\u00020\u0015H\u0002J\u0012\u0010\u0016\u001a\u00020\u00122\b\b\u0002\u0010\u0017\u001a\u00020\u0018H\u0002J$\u0010\u0019\u001a\u00020\u001a2\u0006\u0010\u001b\u001a\u00020\u001c2\b\u0010\u001d\u001a\u0004\u0018\u00010\u001e2\b\u0010\u001f\u001a\u0004\u0018\u00010 H\u0016J\b\u0010!\u001a\u00020\u0012H\u0016J\u0010\u0010\"\u001a\u00020\u00122\u0006\u0010#\u001a\u00020\u0010H\u0002J\u001a\u0010$\u001a\u00020\u00122\u0006\u0010%\u001a\u00020\u001a2\b\u0010\u001f\u001a\u0004\u0018\u00010 H\u0016J\b\u0010&\u001a\u00020\u0012H\u0002J\b\u0010\'\u001a\u00020\u0012H\u0002J\b\u0010(\u001a\u00020\u0012H\u0002J\u0016\u0010)\u001a\u00020\u00122\f\u0010*\u001a\b\u0012\u0004\u0012\u00020\u000e0\rH\u0002J\u0012\u0010+\u001a\u00020\u00122\b\b\u0001\u0010,\u001a\u00020-H\u0002J\u0018\u0010.\u001a\u00020\u00122\u0006\u0010/\u001a\u00020\u00182\u0006\u00100\u001a\u00020\u0018H\u0002J\b\u00101\u001a\u00020\u0012H\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082D\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u0005\u001a\u0004\u0018\u00010\u0006X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082.\u00a2\u0006\u0002\n\u0000R\u0014\u0010\t\u001a\u00020\u00068BX\u0082\u0004\u00a2\u0006\u0006\u001a\u0004\b\n\u0010\u000bR\u0014\u0010\f\u001a\b\u0012\u0004\u0012\u00020\u000e0\rX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000f\u001a\u00020\u0010X\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u00064"}, d2 = {"Lcom/napibase/napifit/ui/community/CommunityFragment;", "Landroidx/fragment/app/Fragment;", "()V", "TAG", "", "_binding", "Lcom/napibase/napifit/databinding/FragmentCommunityBinding;", "adapter", "Lcom/napibase/napifit/ui/community/CommunityAdapter;", "binding", "getBinding", "()Lcom/napibase/napifit/databinding/FragmentCommunityBinding;", "currentRequests", "", "Lcom/napibase/napifit/api/models/FeatureRequest;", "currentSort", "Lcom/napibase/napifit/ui/community/CommunityFragment$SortType;", "handleVote", "", "request", "action", "Lcom/napibase/napifit/ui/community/CommunityFragment$VoteAction;", "loadFeatureRequests", "showFullLoading", "", "onCreateView", "Landroid/view/View;", "inflater", "Landroid/view/LayoutInflater;", "container", "Landroid/view/ViewGroup;", "savedInstanceState", "Landroid/os/Bundle;", "onDestroyView", "onSortSelected", "sort", "onViewCreated", "view", "setupFilters", "setupRecycler", "showEmptyState", "showList", "requests", "showToast", "messageRes", "", "toggleLoading", "isVisible", "hideContent", "updateFilterButtons", "SortType", "VoteAction", "app_debug"})
public final class CommunityFragment extends androidx.fragment.app.Fragment {
    @org.jetbrains.annotations.Nullable()
    private com.napibase.napifit.databinding.FragmentCommunityBinding _binding;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.String TAG = "CommunityFragment";
    private com.napibase.napifit.ui.community.CommunityAdapter adapter;
    @org.jetbrains.annotations.NotNull()
    private com.napibase.napifit.ui.community.CommunityFragment.SortType currentSort = com.napibase.napifit.ui.community.CommunityFragment.SortType.TRENDING;
    @org.jetbrains.annotations.NotNull()
    private java.util.List<com.napibase.napifit.api.models.FeatureRequest> currentRequests;
    
    public CommunityFragment() {
        super();
    }
    
    private final com.napibase.napifit.databinding.FragmentCommunityBinding getBinding() {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public android.view.View onCreateView(@org.jetbrains.annotations.NotNull()
    android.view.LayoutInflater inflater, @org.jetbrains.annotations.Nullable()
    android.view.ViewGroup container, @org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
        return null;
    }
    
    @java.lang.Override()
    public void onViewCreated(@org.jetbrains.annotations.NotNull()
    android.view.View view, @org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    private final void setupRecycler() {
    }
    
    private final void setupFilters() {
    }
    
    private final void onSortSelected(com.napibase.napifit.ui.community.CommunityFragment.SortType sort) {
    }
    
    private final void updateFilterButtons() {
    }
    
    private final void loadFeatureRequests(boolean showFullLoading) {
    }
    
    private final void showList(java.util.List<com.napibase.napifit.api.models.FeatureRequest> requests) {
    }
    
    private final void showEmptyState() {
    }
    
    private final void handleVote(com.napibase.napifit.api.models.FeatureRequest request, com.napibase.napifit.ui.community.CommunityFragment.VoteAction action) {
    }
    
    private final void toggleLoading(boolean isVisible, boolean hideContent) {
    }
    
    private final void showToast(@androidx.annotation.StringRes()
    int messageRes) {
    }
    
    @java.lang.Override()
    public void onDestroyView() {
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0010\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0006\b\u0082\u0081\u0002\u0018\u00002\b\u0012\u0004\u0012\u00020\u00000\u0001B\u000f\b\u0002\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0005\u0010\u0006j\u0002\b\u0007j\u0002\b\b\u00a8\u0006\t"}, d2 = {"Lcom/napibase/napifit/ui/community/CommunityFragment$SortType;", "", "apiValue", "", "(Ljava/lang/String;ILjava/lang/String;)V", "getApiValue", "()Ljava/lang/String;", "TRENDING", "RECENT", "app_debug"})
    static enum SortType {
        /*public static final*/ TRENDING /* = new TRENDING(null) */,
        /*public static final*/ RECENT /* = new RECENT(null) */;
        @org.jetbrains.annotations.NotNull()
        private final java.lang.String apiValue = null;
        
        SortType(java.lang.String apiValue) {
        }
        
        @org.jetbrains.annotations.NotNull()
        public final java.lang.String getApiValue() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public static kotlin.enums.EnumEntries<com.napibase.napifit.ui.community.CommunityFragment.SortType> getEntries() {
            return null;
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0018\n\u0002\u0018\u0002\n\u0002\u0010\u0010\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000e\n\u0002\b\b\b\u0082\u0081\u0002\u0018\u00002\b\u0012\u0004\u0012\u00020\u00000\u0001B\u0019\b\u0002\u0012\b\b\u0001\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006R\u0011\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0007\u0010\bR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\t\u0010\nj\u0002\b\u000bj\u0002\b\f\u00a8\u0006\r"}, d2 = {"Lcom/napibase/napifit/ui/community/CommunityFragment$VoteAction;", "", "successMessageRes", "", "endpoint", "", "(Ljava/lang/String;IILjava/lang/String;)V", "getEndpoint", "()Ljava/lang/String;", "getSuccessMessageRes", "()I", "LIKE", "DISLIKE", "app_debug"})
    static enum VoteAction {
        /*public static final*/ LIKE /* = new LIKE(0, null) */,
        /*public static final*/ DISLIKE /* = new DISLIKE(0, null) */;
        private final int successMessageRes = 0;
        @org.jetbrains.annotations.NotNull()
        private final java.lang.String endpoint = null;
        
        VoteAction(@androidx.annotation.StringRes()
        int successMessageRes, java.lang.String endpoint) {
        }
        
        public final int getSuccessMessageRes() {
            return 0;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final java.lang.String getEndpoint() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public static kotlin.enums.EnumEntries<com.napibase.napifit.ui.community.CommunityFragment.VoteAction> getEntries() {
            return null;
        }
    }
}