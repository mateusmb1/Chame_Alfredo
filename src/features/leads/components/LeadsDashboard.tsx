
import React from 'react'
import { LeadsGrid } from '../components/leads/LeadsGrid'
// import { useAuth } from '../contexts/AuthContext'
// import { Navigate } from 'react-router-dom'

const LeadsDashboard = () => {
    // Example Auth Protection (Uncomment when integrating)
    // const { user, profile } = useAuth()
    // if (!user || profile?.role !== 'admin') {
    //     return <Navigate to="/login" />
    // }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* If there is a Sidebar or Layout, it should wrap this or this component should be inside it */}
            <LeadsGrid />
        </div>
    )
}

export default LeadsDashboard
