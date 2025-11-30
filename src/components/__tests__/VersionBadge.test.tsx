import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VersionBadge from '../VersionBadge'

// Mock the config
vi.mock('@/config/version', () => ({
    APP_VERSION: '1.0.0'
}))

// Mock the hook
const mockCheckForUpdate = vi.fn()
vi.mock('../UpdateCheckerProvider', () => ({
    useUpdateChecker: () => ({
        checkForUpdate: mockCheckForUpdate
    })
}))

describe('VersionBadge', () => {
    it('renders the version number correctly', () => {
        render(<VersionBadge />)
        expect(screen.getByText('Yeni sürüm v1.0.0')).toBeInTheDocument()
    })

    it('calls checkForUpdate when clicked', () => {
        render(<VersionBadge />)
        const button = screen.getByRole('button')
        fireEvent.click(button)
        expect(mockCheckForUpdate).toHaveBeenCalled()
    })
})
