// src/components/shared/TailwindTest.tsx
import React from 'react';

const TailwindTest = () => {
  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline text-red-500">
        Tailwind Test - This should be RED
      </h1>
      
      <div className="bg-blue-500 text-white p-4 rounded">
        This box should have a BLUE background if Tailwind is working
      </div>
      
      <div className="bg-primary text-white p-4 rounded">
        This box should use your PRIMARY color if Tailwind is processing your theme
      </div>
      
      <div style={{backgroundColor: 'purple', color: 'white', padding: '16px', borderRadius: '4px'}}>
        This PURPLE box uses inline styles (should work regardless of Tailwind)
      </div>
      
      <div className="test-primary-bg">
        This should be GREEN if your custom CSS test class is working
      </div>
    </div>
  );
};

export default TailwindTest;