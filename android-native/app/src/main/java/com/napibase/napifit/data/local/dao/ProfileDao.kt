package com.napibase.napifit.data.local.dao

import androidx.room.*
import com.napibase.napifit.data.local.entities.ProfileEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ProfileDao {
    @Query("SELECT * FROM profiles WHERE userId = :userId LIMIT 1")
    fun getProfile(userId: String): Flow<ProfileEntity?>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProfile(profile: ProfileEntity)
    
    @Update
    suspend fun updateProfile(profile: ProfileEntity)
    
    @Query("DELETE FROM profiles WHERE userId = :userId")
    suspend fun deleteProfile(userId: String)
    
    @Query("DELETE FROM profiles")
    suspend fun clearAll()
}

