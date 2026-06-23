"use client";

import Image  from "next/image";

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => console.log('CLICK')}>
      <a href="#events">
        Explore Below
        <Image src="icons/arrow-down.svg" alt="down button" width={24} height={24}></Image>
      </a>
    </button>
  )
}

export default ExploreBtn