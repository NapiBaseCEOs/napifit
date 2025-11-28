package com.napibase.napifit.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "workouts")
data class WorkoutEntity(
    @PrimaryKey
    val id: String,
    val userId: String,
    val name: String,
    val duration: Int,
    val caloriesBurned: Int,
    val workoutType: String?,
    val createdAt: Long,
    val updatedAt: Long
)

