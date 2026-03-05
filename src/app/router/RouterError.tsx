import { useRouteError, isRouteErrorResponse } from "react-router-dom"

const RouterError = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="p-10">
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
      </div>
    )
  }

  return (
    <div className="p-10">
      <h2>Something went wrong</h2>
    </div>
  )
}

export default RouterError
