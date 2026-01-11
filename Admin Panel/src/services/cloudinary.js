export async function uploadToCloudinary(file) {
  if (!file) throw new Error('No file provided')
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env')
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', uploadPreset)

  const res = await fetch(url, { method: 'POST', body: fd })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`)
  }
  const data = await res.json()
  return data // contains secure_url, public_id, etc.
}
