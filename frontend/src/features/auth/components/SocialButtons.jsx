import React from 'react'
import Button from '../../../components/ui/Button'

const SocialButtons = () => {
    return (
        <div className="grid grid-cols-1 gap-4">
            <Button variant="secondary" size="md" className="w-full text-sm">
                <span className="mr-2">G</span> Google
            </Button>
        </div>
    )
}

export default SocialButtons