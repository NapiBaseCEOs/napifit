package com.napibase.napifit;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000P\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0011\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0005\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\b\u0010\u0017\u001a\u00020\u0018H\u0002J\b\u0010\u0019\u001a\u00020\u0018H\u0016J\u0012\u0010\u001a\u001a\u00020\u00182\b\u0010\u001b\u001a\u0004\u0018\u00010\u001cH\u0014J\b\u0010\u001d\u001a\u00020\u0018H\u0002J\b\u0010\u001e\u001a\u00020\u0018H\u0002J\u0010\u0010\u001f\u001a\u00020\u00182\u0006\u0010 \u001a\u00020\u0010H\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0004X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\u0004X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\tX\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\n\u001a\u00020\u000bX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\f\u001a\u00020\rX\u0082.\u00a2\u0006\u0002\n\u0000R\u0016\u0010\u000e\u001a\b\u0012\u0004\u0012\u00020\u00100\u000fX\u0082\u0004\u00a2\u0006\u0004\n\u0002\u0010\u0011R\u000e\u0010\u0012\u001a\u00020\u0013X\u0082.\u00a2\u0006\u0002\n\u0000R\u0016\u0010\u0014\u001a\b\u0012\u0004\u0012\u00020\u00100\u000fX\u0082\u0004\u00a2\u0006\u0004\n\u0002\u0010\u0011R\u000e\u0010\u0015\u001a\u00020\u0016X\u0082.\u00a2\u0006\u0002\n\u0000\u00a8\u0006!"}, d2 = {"Lcom/napibase/napifit/MainActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "()V", "fab", "Lcom/google/android/material/floatingactionbutton/FloatingActionButton;", "fabAddMeal", "fabAddWater", "fabAddWorkout", "fabOverlay", "Landroid/view/View;", "isSpeedDialOpen", "", "speedDialContainer", "Landroid/widget/LinearLayout;", "tabIcons", "", "", "[Ljava/lang/Integer;", "tabLayout", "Lcom/google/android/material/tabs/TabLayout;", "tabTitles", "viewPager", "Landroidx/viewpager2/widget/ViewPager2;", "closeSpeedDial", "", "onBackPressed", "onCreate", "savedInstanceState", "Landroid/os/Bundle;", "openSpeedDial", "toggleSpeedDial", "updateFabForTab", "position", "app_debug"})
public final class MainActivity extends androidx.appcompat.app.AppCompatActivity {
    private androidx.viewpager2.widget.ViewPager2 viewPager;
    private com.google.android.material.tabs.TabLayout tabLayout;
    private com.google.android.material.floatingactionbutton.FloatingActionButton fab;
    private android.widget.LinearLayout speedDialContainer;
    private android.view.View fabOverlay;
    private com.google.android.material.floatingactionbutton.FloatingActionButton fabAddMeal;
    private com.google.android.material.floatingactionbutton.FloatingActionButton fabAddWorkout;
    private com.google.android.material.floatingactionbutton.FloatingActionButton fabAddWater;
    private boolean isSpeedDialOpen = false;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.Integer[] tabIcons = null;
    @org.jetbrains.annotations.NotNull()
    private final java.lang.Integer[] tabTitles = null;
    
    public MainActivity() {
        super();
    }
    
    @java.lang.Override()
    protected void onCreate(@org.jetbrains.annotations.Nullable()
    android.os.Bundle savedInstanceState) {
    }
    
    private final void updateFabForTab(int position) {
    }
    
    private final void toggleSpeedDial() {
    }
    
    private final void openSpeedDial() {
    }
    
    private final void closeSpeedDial() {
    }
    
    @java.lang.Override()
    public void onBackPressed() {
    }
}