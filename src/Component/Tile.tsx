import React from 'react'
import './Tile.css' // Import CSS file

interface TileProps {
  imageUrl: string // Front image
  backImageUrl: string // Back image
  isFlipped: boolean
  isMatched: boolean
  onClick: () => void
}

const Tile: React.FC<TileProps> = ({ imageUrl, backImageUrl, isFlipped, isMatched, onClick }) => {
  return (
    <div className='tile-container' onClick={onClick}>
      <div className={`tile-inner ${isFlipped || isMatched ? 'flipped' : ''}`}>
        {/* Back of the tile */}
        <div className='tile-back'>
          <img src={backImageUrl} alt='Back' />
        </div>

        {/* Front of the tile */}
        <div className='tile-front'>
          <img src={imageUrl} alt='Front' className={isMatched ? 'matched' : ''} />
        </div>
      </div>
    </div>
  )
}

export default Tile
