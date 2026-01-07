import { useAuth } from "@/app/providers/AuthProvider"

const DashboardPage = () => {
  const { currentUser, authToken } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard Page</h1>
      <p>Welcome {currentUser?.name}</p>
      <p>Your role: {currentUser?.role}</p>
    </div>
  )
}

export default DashboardPage
