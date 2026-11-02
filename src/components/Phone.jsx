/** Cadre téléphone pour les captures d'applis mobiles. */
export default function Phone({ src, alt = '', className = '', loading = 'lazy', ...rest }) {
  return (
    <div className={`phone ${className}`} {...rest}>
      <img src={src} alt={alt} loading={loading} decoding="async" />
    </div>
  )
}
