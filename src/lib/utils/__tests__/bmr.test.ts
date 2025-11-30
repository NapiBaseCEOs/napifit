import { describe, it, expect } from 'vitest'
import { calculateBMR, calculateTDEE, calculateDailyCalorieNeed } from '../bmr'

describe('BMR Calculations', () => {
    describe('calculateBMR', () => {
        it('should calculate correct BMR for male', () => {
            // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
            const params = {
                weight: 80,
                height: 180,
                age: 30,
                gender: 'male' as const
            }
            expect(calculateBMR(params)).toBe(1780)
        })

        it('should calculate correct BMR for female', () => {
            // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 -> 1345
            const params = {
                weight: 60,
                height: 165,
                age: 25,
                gender: 'female' as const
            }
            expect(calculateBMR(params)).toBe(1345)
        })

        it('should return minimum 800 kcal', () => {
            const params = {
                weight: 30,
                height: 100,
                age: 90,
                gender: 'female' as const
            }
            // Very low calculation, should be capped at 800
            expect(calculateBMR(params)).toBe(800)
        })
    })

    describe('calculateTDEE', () => {
        it('should calculate sedentary TDEE correctly', () => {
            const bmr = 2000
            // 2000 * 1.2 = 2400
            expect(calculateTDEE(bmr, 'sedentary')).toBe(2400)
        })

        it('should calculate active TDEE correctly', () => {
            const bmr = 2000
            // 2000 * 1.725 = 3450
            expect(calculateTDEE(bmr, 'active')).toBe(3450)
        })
    })

    describe('calculateDailyCalorieNeed', () => {
        it('should calculate deficit for weight loss', () => {
            const bmr = 2000
            const activity = 'sedentary' // TDEE = 2400
            const targetDiff = -5 // Lose weight

            // Weekly goal -500 -> Daily -71.4
            // 2400 - 71.4 = 2328.6 -> 2329
            expect(calculateDailyCalorieNeed(bmr, activity, targetDiff)).toBe(2329)
        })

        it('should calculate surplus for weight gain', () => {
            const bmr = 2000
            const activity = 'sedentary' // TDEE = 2400
            const targetDiff = 5 // Gain weight

            // Weekly goal +500 -> Daily +71.4
            // 2400 + 71.4 = 2471.4 -> 2471
            expect(calculateDailyCalorieNeed(bmr, activity, targetDiff)).toBe(2471)
        })
    })
})
