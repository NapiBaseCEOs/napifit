package com.napibase.napifit.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.napibase.napifit.data.local.dao.MealDao
import com.napibase.napifit.data.local.dao.ProfileDao
import com.napibase.napifit.data.local.dao.WaterIntakeDao
import com.napibase.napifit.data.local.dao.WorkoutDao
import com.napibase.napifit.data.local.entities.MealEntity
import com.napibase.napifit.data.local.entities.ProfileEntity
import com.napibase.napifit.data.local.entities.WaterIntakeEntity
import com.napibase.napifit.data.local.entities.WorkoutEntity

@Database(
    entities = [
        ProfileEntity::class,
        MealEntity::class,
        WorkoutEntity::class,
        WaterIntakeEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    
    abstract fun profileDao(): ProfileDao
    abstract fun mealDao(): MealDao
    abstract fun workoutDao(): WorkoutDao
    abstract fun waterIntakeDao(): WaterIntakeDao
    
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        
        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "napifit_database"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}

