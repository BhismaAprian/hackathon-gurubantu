export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Unknown"
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}