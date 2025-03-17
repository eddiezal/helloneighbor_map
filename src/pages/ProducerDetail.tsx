import React from 'react';
import { useParams } from 'react-router-dom';
import { producers } from '../data/mockProducers';

const ProducerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const producer = producers.find(p => p.id.toString() === id);

  if (!producer) {
    return <div className="p-6">Producer not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{producer.name}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">{producer.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2">Available Items:</h2>
            <ul className="list-disc pl-5">
              {producer.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Details:</h2>
            <p>Rating: {producer.rating} ({producer.reviews} reviews)</p>
            <p>Walking Time: {producer.walkTime} minutes</p>
            <p>Availability: {producer.availability}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDetail;