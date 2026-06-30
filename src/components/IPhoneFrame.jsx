export default function IPhoneFrame({ src, alt }) {
  return (
    <div className="iphone-wrap">
      {/* Titanium frame */}
      <div className="iphone-body">
        {/* Dynamic Island */}
        <div className="iphone-island" />
        {/* Screen */}
        <div className="iphone-screen">
          <img src={src} alt={alt} className="iphone-screen__img" loading="lazy" />
        </div>
        {/* Side buttons */}
        <div className="iphone-btn iphone-btn--vol-up" />
        <div className="iphone-btn iphone-btn--vol-down" />
        <div className="iphone-btn iphone-btn--action" />
        <div className="iphone-btn iphone-btn--power" />
      </div>
    </div>
  )
}
