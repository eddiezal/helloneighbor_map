// src/features/listings/components/ListingCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Location {
  address: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Owner {
  id: string;
  name: string;
  avatar: string;
}

export interface ListingProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: Location;
  owner: Owner;
  createdAt: string;
  tags: string[];
}

interface ListingCardProps {
  listing: ListingProps;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/listings/${listing.id}`} className="block">
        <div className="relative h-48">
          <img 
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-bold">
            ${listing.price}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{listing.description}</p>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>{listing.location.address}</span>
          </div>
          
          <div className="mt-3 flex gap-2">
            {listing.tags.map(tag => (
              <span 
                key={tag} 
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ListingCard;