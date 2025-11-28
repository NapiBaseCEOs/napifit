package com.napibase.napifit.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "water_intakes")
data class WaterIntakeEntity(
    @PrimaryKey
    val id: String,
    val userId: String,
    val amountMl: Int,
    val date: String,
    val createdAt: Long
)

