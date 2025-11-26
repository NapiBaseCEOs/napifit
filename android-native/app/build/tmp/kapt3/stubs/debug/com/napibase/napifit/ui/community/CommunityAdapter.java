package com.napibase.napifit.ui.community;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000J\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0006\u0018\u0000 \u001f2\b\u0012\u0004\u0012\u00020\u00020\u0001:\u0002\u001f BA\u0012\u000e\b\u0002\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004\u0012\u0014\b\u0002\u0010\u0006\u001a\u000e\u0012\u0004\u0012\u00020\u0005\u0012\u0004\u0012\u00020\b0\u0007\u0012\u0014\b\u0002\u0010\t\u001a\u000e\u0012\u0004\u0012\u00020\u0005\u0012\u0004\u0012\u00020\b0\u0007\u00a2\u0006\u0002\u0010\nJ\u0010\u0010\u000b\u001a\u00020\f2\u0006\u0010\r\u001a\u00020\fH\u0002J\b\u0010\u000e\u001a\u00020\u000fH\u0016J\u0018\u0010\u0010\u001a\u00020\b2\u0006\u0010\u0011\u001a\u00020\u00022\u0006\u0010\u0012\u001a\u00020\u000fH\u0016J\u0018\u0010\u0013\u001a\u00020\u00022\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0016\u001a\u00020\u000fH\u0016J \u0010\u0017\u001a\u00020\b2\u0006\u0010\u0018\u001a\u00020\u00192\u0006\u0010\u001a\u001a\u00020\u001b2\u0006\u0010\u001c\u001a\u00020\u001bH\u0002J\u0014\u0010\u001d\u001a\u00020\b2\f\u0010\u001e\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004R\u001a\u0010\t\u001a\u000e\u0012\u0004\u0012\u00020\u0005\u0012\u0004\u0012\u00020\b0\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u001a\u0010\u0006\u001a\u000e\u0012\u0004\u0012\u00020\u0005\u0012\u0004\u0012\u00020\b0\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0014\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u0006!"}, d2 = {"Lcom/napibase/napifit/ui/community/CommunityAdapter;", "Landroidx/recyclerview/widget/RecyclerView$Adapter;", "Lcom/napibase/napifit/ui/community/CommunityAdapter$ViewHolder;", "requests", "", "Lcom/napibase/napifit/api/models/FeatureRequest;", "onLikeClick", "Lkotlin/Function1;", "", "onDislikeClick", "(Ljava/util/List;Lkotlin/jvm/functions/Function1;Lkotlin/jvm/functions/Function1;)V", "formatDate", "", "value", "getItemCount", "", "onBindViewHolder", "holder", "position", "onCreateViewHolder", "parent", "Landroid/view/ViewGroup;", "viewType", "styleVoteButton", "view", "Landroid/widget/TextView;", "isActive", "", "isPositive", "updateRequests", "newRequests", "Companion", "ViewHolder", "app_debug"})
public final class CommunityAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter<com.napibase.napifit.ui.community.CommunityAdapter.ViewHolder> {
    @org.jetbrains.annotations.NotNull()
    private java.util.List<com.napibase.napifit.api.models.FeatureRequest> requests;
    @org.jetbrains.annotations.NotNull()
    private final kotlin.jvm.functions.Function1<com.napibase.napifit.api.models.FeatureRequest, kotlin.Unit> onLikeClick = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlin.jvm.functions.Function1<com.napibase.napifit.api.models.FeatureRequest, kotlin.Unit> onDislikeClick = null;
    @org.jetbrains.annotations.NotNull()
    private static final java.time.format.DateTimeFormatter DATE_FORMATTER = null;
    @org.jetbrains.annotations.NotNull()
    public static final com.napibase.napifit.ui.community.CommunityAdapter.Companion Companion = null;
    
    public CommunityAdapter(@org.jetbrains.annotations.NotNull()
    java.util.List<com.napibase.napifit.api.models.FeatureRequest> requests, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super com.napibase.napifit.api.models.FeatureRequest, kotlin.Unit> onLikeClick, @org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function1<? super com.napibase.napifit.api.models.FeatureRequest, kotlin.Unit> onDislikeClick) {
        super();
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public com.napibase.napifit.ui.community.CommunityAdapter.ViewHolder onCreateViewHolder(@org.jetbrains.annotations.NotNull()
    android.view.ViewGroup parent, int viewType) {
        return null;
    }
    
    @java.lang.Override()
    public void onBindViewHolder(@org.jetbrains.annotations.NotNull()
    com.napibase.napifit.ui.community.CommunityAdapter.ViewHolder holder, int position) {
    }
    
    @java.lang.Override()
    public int getItemCount() {
        return 0;
    }
    
    public final void updateRequests(@org.jetbrains.annotations.NotNull()
    java.util.List<com.napibase.napifit.api.models.FeatureRequest> newRequests) {
    }
    
    private final void styleVoteButton(android.widget.TextView view, boolean isActive, boolean isPositive) {
    }
    
    private final java.lang.String formatDate(java.lang.String value) {
        return null;
    }
    
    public CommunityAdapter() {
        super();
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0005"}, d2 = {"Lcom/napibase/napifit/ui/community/CommunityAdapter$Companion;", "", "()V", "DATE_FORMATTER", "Ljava/time/format/DateTimeFormatter;", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u001a\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0011\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004R\u0011\u0010\u0005\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0007\u0010\bR\u0011\u0010\t\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\n\u0010\bR\u0011\u0010\u000b\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\f\u0010\bR\u0011\u0010\r\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\bR\u0011\u0010\u000f\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\bR\u0011\u0010\u0011\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\bR\u0011\u0010\u0013\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\bR\u0011\u0010\u0015\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0016\u0010\b\u00a8\u0006\u0017"}, d2 = {"Lcom/napibase/napifit/ui/community/CommunityAdapter$ViewHolder;", "Landroidx/recyclerview/widget/RecyclerView$ViewHolder;", "view", "Landroid/view/View;", "(Landroid/view/View;)V", "createdAt", "Landroid/widget/TextView;", "getCreatedAt", "()Landroid/widget/TextView;", "description", "getDescription", "dislikeCount", "getDislikeCount", "likeCount", "getLikeCount", "statusBadge", "getStatusBadge", "title", "getTitle", "user", "getUser", "version", "getVersion", "app_debug"})
    public static final class ViewHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView title = null;
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView description = null;
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView likeCount = null;
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView dislikeCount = null;
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView user = null;
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView version = null;
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView statusBadge = null;
        @org.jetbrains.annotations.NotNull()
        private final android.widget.TextView createdAt = null;
        
        public ViewHolder(@org.jetbrains.annotations.NotNull()
        android.view.View view) {
            super(null);
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getTitle() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getDescription() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getLikeCount() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getDislikeCount() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getUser() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getVersion() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getStatusBadge() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final android.widget.TextView getCreatedAt() {
            return null;
        }
    }
}