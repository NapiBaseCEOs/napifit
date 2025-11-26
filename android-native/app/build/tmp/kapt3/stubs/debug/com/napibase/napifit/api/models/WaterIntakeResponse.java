package com.napibase.napifit.api.models;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00000\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0006\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0002\b\u0017\n\u0002\u0010\u000e\n\u0000\b\u0086\b\u0018\u00002\u00020\u0001B;\u0012\f\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003\u0012\u0006\u0010\u0005\u001a\u00020\u0006\u0012\u0006\u0010\u0007\u001a\u00020\b\u0012\u0006\u0010\t\u001a\u00020\u0006\u0012\u0006\u0010\n\u001a\u00020\u000b\u0012\u0006\u0010\f\u001a\u00020\b\u00a2\u0006\u0002\u0010\rJ\u000f\u0010\u0018\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003H\u00c6\u0003J\t\u0010\u0019\u001a\u00020\u0006H\u00c6\u0003J\t\u0010\u001a\u001a\u00020\bH\u00c6\u0003J\t\u0010\u001b\u001a\u00020\u0006H\u00c6\u0003J\t\u0010\u001c\u001a\u00020\u000bH\u00c6\u0003J\t\u0010\u001d\u001a\u00020\bH\u00c6\u0003JK\u0010\u001e\u001a\u00020\u00002\u000e\b\u0002\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u00032\b\b\u0002\u0010\u0005\u001a\u00020\u00062\b\b\u0002\u0010\u0007\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\u00062\b\b\u0002\u0010\n\u001a\u00020\u000b2\b\b\u0002\u0010\f\u001a\u00020\bH\u00c6\u0001J\u0013\u0010\u001f\u001a\u00020\u000b2\b\u0010 \u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010!\u001a\u00020\bH\u00d6\u0001J\t\u0010\"\u001a\u00020#H\u00d6\u0001R\u0011\u0010\u0007\u001a\u00020\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u000fR\u0017\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011R\u0011\u0010\t\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013R\u0011\u0010\n\u001a\u00020\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\u0015R\u0011\u0010\f\u001a\u00020\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0016\u0010\u000fR\u0011\u0010\u0005\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0017\u0010\u0013\u00a8\u0006$"}, d2 = {"Lcom/napibase/napifit/api/models/WaterIntakeResponse;", "", "intakes", "", "Lcom/napibase/napifit/api/models/WaterIntake;", "totalAmount", "", "dailyGoal", "", "progress", "reminderEnabled", "", "reminderInterval", "(Ljava/util/List;DIDZI)V", "getDailyGoal", "()I", "getIntakes", "()Ljava/util/List;", "getProgress", "()D", "getReminderEnabled", "()Z", "getReminderInterval", "getTotalAmount", "component1", "component2", "component3", "component4", "component5", "component6", "copy", "equals", "other", "hashCode", "toString", "", "app_debug"})
public final class WaterIntakeResponse {
    @org.jetbrains.annotations.NotNull()
    private final java.util.List<com.napibase.napifit.api.models.WaterIntake> intakes = null;
    private final double totalAmount = 0.0;
    private final int dailyGoal = 0;
    private final double progress = 0.0;
    private final boolean reminderEnabled = false;
    private final int reminderInterval = 0;
    
    public WaterIntakeResponse(@org.jetbrains.annotations.NotNull()
    java.util.List<com.napibase.napifit.api.models.WaterIntake> intakes, double totalAmount, int dailyGoal, double progress, boolean reminderEnabled, int reminderInterval) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.napibase.napifit.api.models.WaterIntake> getIntakes() {
        return null;
    }
    
    public final double getTotalAmount() {
        return 0.0;
    }
    
    public final int getDailyGoal() {
        return 0;
    }
    
    public final double getProgress() {
        return 0.0;
    }
    
    public final boolean getReminderEnabled() {
        return false;
    }
    
    public final int getReminderInterval() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.napibase.napifit.api.models.WaterIntake> component1() {
        return null;
    }
    
    public final double component2() {
        return 0.0;
    }
    
    public final int component3() {
        return 0;
    }
    
    public final double component4() {
        return 0.0;
    }
    
    public final boolean component5() {
        return false;
    }
    
    public final int component6() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.napibase.napifit.api.models.WaterIntakeResponse copy(@org.jetbrains.annotations.NotNull()
    java.util.List<com.napibase.napifit.api.models.WaterIntake> intakes, double totalAmount, int dailyGoal, double progress, boolean reminderEnabled, int reminderInterval) {
        return null;
    }
    
    @java.lang.Override()
    public boolean equals(@org.jetbrains.annotations.Nullable()
    java.lang.Object other) {
        return false;
    }
    
    @java.lang.Override()
    public int hashCode() {
        return 0;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public java.lang.String toString() {
        return null;
    }
}