package com.napibase.napifit.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "meals")
data class MealEntity(
    @PrimaryKey
    val id: String,
    val userId: String,
    val name: String,
    val calories: Int,
    val protein: Double?,
    val carbs: Double?,
    val fat: Double?,
    val mealType: String?,
    val createdAt: Long,
    val updatedAt: Long
)

