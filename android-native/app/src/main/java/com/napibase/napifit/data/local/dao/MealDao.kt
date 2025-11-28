package com.napibase.napifit.data.local.dao

import androidx.room.*
import com.napibase.napifit.data.local.entities.MealEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MealDao {
    @Query("SELECT * FROM meals WHERE userId = :userId ORDER BY createdAt DESC LIMIT :limit OFFSET :offset")
    fun getMeals(userId: String, limit: Int = 50, offset: Int = 0): Flow<List<MealEntity>>
    
    @Query("SELECT * FROM meals WHERE id = :id LIMIT 1")
    suspend fun getMealById(id: String): MealEntity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMeal(meal: MealEntity)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMeals(meals: List<MealEntity>)
    
    @Delete
    suspend fun deleteMeal(meal: MealEntity)
    
    @Query("DELETE FROM meals WHERE userId = :userId")
    suspend fun clearUserMeals(userId: String)
    
    @Query("DELETE FROM meals")
    suspend fun clearAll()
}

