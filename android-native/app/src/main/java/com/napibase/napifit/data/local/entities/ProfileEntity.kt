package com.napibase.napifit.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "profiles")
data class ProfileEntity(
    @PrimaryKey
    val userId: String,
    val email: String?,
    val firstName: String?,
    val lastName: String?,
    val dateOfBirth: String?,
    val gender: String?,
    val height: Double?,
    val weight: Double?,
    val targetWeight: Double?,
    val activityLevel: String?,
    val createdAt: Long,
    val updatedAt: Long
)

