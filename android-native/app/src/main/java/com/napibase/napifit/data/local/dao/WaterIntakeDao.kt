package com.napibase.napifit.data.local.dao

import androidx.room.*
import com.napibase.napifit.data.local.entities.WaterIntakeEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface WaterIntakeDao {
    @Query("SELECT * FROM water_intakes WHERE userId = :userId AND date = :date ORDER BY createdAt DESC")
    fun getWaterIntakesByDate(userId: String, date: String): Flow<List<WaterIntakeEntity>>
    
    @Query("SELECT SUM(amountMl) FROM water_intakes WHERE userId = :userId AND date = :date")
    suspend fun getTotalWaterForDate(userId: String, date: String): Int?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWaterIntake(waterIntake: WaterIntakeEntity)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWaterIntakes(waterIntakes: List<WaterIntakeEntity>)
    
    @Delete
    suspend fun deleteWaterIntake(waterIntake: WaterIntakeEntity)
    
    @Query("DELETE FROM water_intakes WHERE userId = :userId")
    suspend fun clearUserWaterIntakes(userId: String)
    
    @Query("DELETE FROM water_intakes")
    suspend fun clearAll()
}

