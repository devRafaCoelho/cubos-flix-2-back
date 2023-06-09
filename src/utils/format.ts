export function formatDate(date: any) {
  const formattedDate = new Date(date)
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
    .toUpperCase()

  return formattedDate
}
