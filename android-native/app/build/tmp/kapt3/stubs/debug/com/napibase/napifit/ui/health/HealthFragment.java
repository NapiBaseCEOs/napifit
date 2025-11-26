package com.napibase.napifit.ui.health;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000J\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0004\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0007\n\u0002\u0010\u0006\n\u0002\b\n\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\b\u0010\n\u001a\u00020\u000bH\u0002J\u0010\u0010\f\u001a\u00020\u000b2\u0006\u0010\r\u001a\u00020\u000eH\u0002J$\u0010\u000f\u001a\u00020\u00102\u0006\u0010\u0011\u001a\u00020\u00122\b\u0010\u0013\u001a\u0004\u0018\u00010\u00142\b\u0010\u0015\u001a\u0004\u0018\u00010\u0016H\u0016J\b\u0010\u0017\u001a\u00020\u000bH\u0016J\u001a\u0010\u0018\u001a\u00020\u000b2\u0006\u0010\u0019\u001a\u00020\u00102\b\u0010\u0015\u001a\u0004\u0018\u00010\u0016H\u0016J\b\u0010\u001a\u001a\u00020\u000bH\u0002J\u0018\u0010\u001b\u001a\u00020\u000b2\u0006\u0010\u001c\u001a\u00020\u00062\u0006\u0010\u001d\u001a\u00020\u001eH\u0002J!\u0010\u001f\u001a\u00020\u000b2\b\u0010 \u001a\u0004\u0018\u00010\u001e2\b\u0010!\u001a\u0004\u0018\u00010\u001eH\u0002\u00a2\u0006\u0002\u0010\"J\'\u0010#\u001a\u00020\u000b2\u0006\u0010\u001c\u001a\u00020\u00062\u0006\u0010$\u001a\u00020\u00062\b\u0010\u001d\u001a\u0004\u0018\u00010\u001eH\u0002\u00a2\u0006\u0002\u0010%J\u0010\u0010&\u001a\u00020\u000b2\u0006\u0010\'\u001a\u00020\u0006H\u0002R\u0010\u0010\u0003\u001a\u0004\u0018\u00010\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0014\u0010\u0007\u001a\u00020\u00048BX\u0082\u0004\u00a2\u0006\u0006\u001a\u0004\b\b\u0010\t\u00a8\u0006("}, d2 = {"Lcom/napibase/napifit/ui/health/HealthFragment;", "Landroidx/fragment/app/Fragment;", "()V", "_binding", "Lcom/napibase/napifit/databinding/FragmentHealthBinding;", "activeTab", "", "binding", "getBinding", "()Lcom/napibase/napifit/databinding/FragmentHealthBinding;", "animateTabCards", "", "highlightTab", "tabCard", "Lcom/google/android/material/card/MaterialCardView;", "onCreateView", "Landroid/view/View;", "inflater", "Landroid/view/LayoutInflater;", "container", "Landroid/view/ViewGroup;", "savedInstanceState", "Landroid/os/Bundle;", "onDestroyView", "onViewCreated", "view", "resetTabStyles", "saveMeal", "name", "calories", "", "saveMetric", "weight", "bowel", "(Ljava/lang/Double;Ljava/lang/Double;)V", "saveWorkout", "durationStr", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Double;)V", "switchTab", "tab", "app_debug"})
public final class HealthFragment extends androidx.fragment.app.Fragment {
    @org.jetbrains.annotations.Nullable()
    private com.napibase.napifit.databinding.FragmentHealthBinding _binding;
    @org.jetbrains.annotations.NotNull()
    private java.lang.String activeTab = "meal";
    
    public HealthFragment() {
        super();
    }
    
    private final com.napibase.napifit.databinding.FragmentHealthBinding getBinding() {
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
    
    private final void switchTab(java.lang.String tab) {
    }
    
    private final void resetTabStyles() {
    }
    
    private final void highlightTab(com.google.android.material.card.MaterialCardView tabCard) {
    }
    
    private final void animateTabCards() {
    }
    
    private final void saveMeal(java.lang.String name, double calories) {
    }
    
    private final void saveWorkout(java.lang.String name, java.lang.String durationStr, java.lang.Double calories) {
    }
    
    private final void saveMetric(java.lang.Double weight, java.lang.Double bowel) {
    }
    
    @java.lang.Override()
    public void onDestroyView() {
    }
}