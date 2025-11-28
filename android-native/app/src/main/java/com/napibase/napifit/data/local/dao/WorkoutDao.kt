package com.napibase.napifit.data.local.dao

import androidx.room.*
import com.napibase.napifit.data.local.entities.WorkoutEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface WorkoutDao {
    @Query("SELECT * FROM workouts WHERE userId = :userId ORDER BY createdAt DESC LIMIT :limit OFFSET :offset")
    fun getWorkouts(userId: String, limit: Int = 50, offset: Int = 0): Flow<List<WorkoutEntity>>
    
    @Query("SELECT * FROM workouts WHERE id = :id LIMIT 1")
    suspend fun getWorkoutById(id: String): WorkoutEntity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWorkout(workout: WorkoutEntity)
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWorkouts(workouts: List<WorkoutEntity>)
    
    @Delete
    suspend fun deleteWorkout(workout: WorkoutEntity)
    
    @Query("DELETE FROM workouts WHERE userId = :userId")
    suspend fun clearUserWorkouts(userId: String)
    
    @Query("DELETE FROM workouts")
    suspend fun clearAll()
}

